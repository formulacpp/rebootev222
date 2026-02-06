'use client'

import { useState, useCallback, useEffect } from 'react'

interface CartItem {
  productId: number
  variantId: number
  quantity: number
}

interface SellAuthConfig {
  cart: CartItem[]
  shopId: number
  modal?: boolean
  scrollTop?: boolean
}

declare global {
  interface Window {
    sellAuthEmbed?: {
      checkout: (element: HTMLElement | null, config: SellAuthConfig) => void
    }
  }
}

export function useSellAuth() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if script is already loaded
    if (window.sellAuthEmbed) {
      setIsLoaded(true)
      return
    }

    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="sellauth-embed"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true))
      return
    }

    // Load SellAuth embed script
    const script = document.createElement('script')
    script.src = 'https://sellauth.com/assets/js/sellauth-embed-2.js'
    script.async = true
    script.onload = () => {
      setIsLoaded(true)
    }
    script.onerror = () => {
      console.error('Failed to load SellAuth embed script')
    }
    document.head.appendChild(script)
  }, [])

  const checkout = useCallback(
    (cart: CartItem[]) => {
      if (!isLoaded || !window.sellAuthEmbed) {
        console.error('SellAuth not loaded yet')
        return
      }

      const shopId = parseInt(process.env.NEXT_PUBLIC_SELLAUTH_SHOP_ID || '0', 10)

      if (!shopId) {
        console.error('SellAuth shop ID not configured')
        return
      }

      setIsLoading(true)

      try {
        window.sellAuthEmbed.checkout(null, {
          cart,
          shopId,
          modal: true,
          scrollTop: true,
        })
      } catch (error) {
        console.error('SellAuth checkout error:', error)
      } finally {
        // Reset loading after a short delay
        setTimeout(() => setIsLoading(false), 1000)
      }
    },
    [isLoaded]
  )

  const checkoutSingle = useCallback(
    (productId: number | string, variantId: number | string, quantity: number = 1) => {
      checkout([
        {
          productId: typeof productId === 'string' ? parseInt(productId, 10) : productId,
          variantId: typeof variantId === 'string' ? parseInt(variantId, 10) : variantId,
          quantity,
        },
      ])
    },
    [checkout]
  )

  return {
    checkout,
    checkoutSingle,
    isLoaded,
    isLoading,
  }
}
