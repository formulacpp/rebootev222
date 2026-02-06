import { NextRequest, NextResponse } from 'next/server'
import { getKeyAuthAPI } from '@/lib/keyauth'
import { cookies } from 'next/headers'

// Helper to get current reseller identifier from session
async function getResellerIdentifier(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('reseller_session')

  if (!session) return null

  try {
    const sessionData = JSON.parse(session.value)
    // Use license key if registered with key, otherwise use username
    return sessionData.licenseKey || sessionData.username || null
  } catch {
    return null
  }
}

// Create a unique tag for this reseller's keys
function createResellerTag(identifier: string): string {
  // Use first 8 chars of the identifier (license key or username) as tag
  const shortId = identifier.replace(/-/g, '').substring(0, 8).toLowerCase()
  return `[r:${shortId}]`
}

// Check if a key belongs to this reseller
function keyBelongsToReseller(key: any, licenseKey: string): boolean {
  const tag = createResellerTag(licenseKey)
  return key.note && key.note.startsWith(tag)
}

// Clean the note (remove reseller tag for display)
function cleanNote(note: string | undefined, licenseKey: string): string {
  if (!note) return ''
  const tag = createResellerTag(licenseKey)
  if (note.startsWith(tag)) {
    return note.slice(tag.length)
  }
  return note
}

// Add reseller tag to note
function tagNote(note: string | undefined, licenseKey: string): string {
  const tag = createResellerTag(licenseKey)
  return `${tag}${note || ''}`
}

// GET - Fetch all keys (filtered by reseller's license key)
export async function GET() {
  try {
    const licenseKey = await getResellerIdentifier()

    if (!licenseKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const keyAuth = getKeyAuthAPI()
    const result = await keyAuth.fetchAllLicenses()

    if (result.success && result.keys) {
      // Filter keys to only show those belonging to this reseller
      const filteredKeys = result.keys
        .filter((key: any) => keyBelongsToReseller(key, licenseKey))
        .map((key: any) => ({
          ...key,
          note: cleanNote(key.note, licenseKey),
        }))

      return NextResponse.json({
        ...result,
        keys: filteredKeys,
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('KeyAuth keys fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 }
    )
  }
}

// POST - Create new keys (tagged with reseller's license key)
export async function POST(request: NextRequest) {
  try {
    const licenseKey = await getResellerIdentifier()

    if (!licenseKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { expiry, amount, mask, note, level } = body

    if (!expiry) {
      return NextResponse.json({ error: 'Expiry is required' }, { status: 400 })
    }

    const keyAuth = getKeyAuthAPI()
    const result = await keyAuth.createLicense({
      expiry: parseInt(expiry, 10),
      amount: parseInt(amount, 10) || 1,
      mask: mask || '******-******-******-******',
      note: tagNote(note, licenseKey), // Tag with reseller's license key
      level: parseInt(level, 10) || 1,
      character: 1, // 1 = uppercase only, 2 = lowercase only
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('KeyAuth key creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create license' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a key (only if it belongs to this reseller)
export async function DELETE(request: NextRequest) {
  try {
    const licenseKey = await getResellerIdentifier()

    if (!licenseKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const keyAuth = getKeyAuthAPI()

    // First verify the key belongs to this reseller
    const allKeys = await keyAuth.fetchAllLicenses()
    if (allKeys.success && allKeys.keys) {
      const keyData = allKeys.keys.find((k: any) => k.key === key)
      if (!keyData || !keyBelongsToReseller(keyData, licenseKey)) {
        return NextResponse.json(
          { error: 'Key not found or access denied' },
          { status: 403 }
        )
      }
    }

    const result = await keyAuth.deleteLicense(key)

    return NextResponse.json(result)
  } catch (error) {
    console.error('KeyAuth key deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete license' },
      { status: 500 }
    )
  }
}
