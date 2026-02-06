'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { useSellAuth } from '@/hooks/useSellAuth'
import { cn } from '@/lib/utils'

interface CheckoutButtonProps {
  productId: string | number
  variantId: string | number
  quantity?: number
  label?: string
  price?: number
  className?: string
  urgency?: boolean
}

export function CheckoutButton({
  productId,
  variantId,
  quantity = 1,
  label = 'Buy Now',
  className = '',
  urgency = true,
}: CheckoutButtonProps) {
  const { checkoutSingle, isLoaded, isLoading } = useSellAuth()

  // Check if product IDs are configured
  const isConfigured = productId && variantId

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (!isConfigured) {
      alert('This product will be available soon! Join our Discord for updates.')
      return
    }

    if (!isLoaded) {
      alert('Payment system is loading. Please try again in a moment.')
      return
    }

    checkoutSingle(productId, variantId, quantity)
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      className={cn(
        'relative inline-flex items-center justify-center gap-3 px-8 py-4',
        'bg-gradient-to-r from-primary to-accent-gold',
        'text-white font-bold text-lg rounded-xl cursor-pointer',
        'shadow-lg shadow-primary/30',
        'transition-all duration-300',
        'disabled:opacity-70 disabled:cursor-not-allowed',
        urgency && 'animate-[pulse-glow_2s_ease-in-out_infinite]',
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {label}
    </motion.button>
  )
}
