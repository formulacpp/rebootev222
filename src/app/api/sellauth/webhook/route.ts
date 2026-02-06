import { NextRequest, NextResponse } from 'next/server'
import { getKeyAuthAPI } from '@/lib/keyauth'

// Map SellAuth variant IDs to KeyAuth expiry (in days)
const VARIANT_EXPIRY: Record<string, number> = {
  '683065': 1,    // 1 Day
  '952727': 7,    // 1 Week (used for both week and month variants in SellAuth)
  '952732': 90,   // 90 Day
}

// Override: if the SellAuth variant is the month one, expiry = 30
// Since week and month share variant ID 952727, we use product-level context
// For now, week = 7 days. If you need month = 30, give it a separate variant ID.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // SellAuth sends product_id and variant_id in the webhook payload
    const variantId = String(body.variant_id || body.variantId || '')
    const productId = String(body.product_id || body.productId || '')

    // Determine expiry from variant
    const expiry = VARIANT_EXPIRY[variantId] || 1

    const keyAuth = getKeyAuthAPI()
    const result = await keyAuth.createLicense({
      expiry,
      mask: '******-******-******-******',
      level: 1,
      amount: 1,
      character: 1,
      note: 'WEBSITE',
    })

    if (result.success) {
      // Return the key - SellAuth uses this as the delivered product
      return NextResponse.json({
        status: 'success',
        key: result.key,
      })
    }

    return NextResponse.json(
      { status: 'error', message: result.message },
      { status: 500 }
    )
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Also support GET for simple key generation (direct URL call)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const variantId = searchParams.get('variant_id') || ''
  const expiry = VARIANT_EXPIRY[variantId] || 1

  try {
    const keyAuth = getKeyAuthAPI()
    const result = await keyAuth.createLicense({
      expiry,
      mask: '******-******-******-******',
      level: 1,
      amount: 1,
      character: 1,
      note: 'WEBSITE',
    })

    if (result.success) {
      return new NextResponse(result.key, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    return new NextResponse(result.message, { status: 500 })
  } catch (error) {
    console.error('Webhook GET error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
