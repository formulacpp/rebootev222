'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface StockIndicatorProps {
  stock?: number
  threshold?: number
}

export function StockIndicator({ stock = 7, threshold = 10 }: StockIndicatorProps) {
  if (stock > threshold) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 text-status-warn bg-status-warn/10 px-3 py-1.5 rounded-lg"
    >
      <AlertTriangle className="w-4 h-4 animate-pulse" />
      <span className="text-sm font-medium">
        Only <span className="font-bold">{stock}</span> left at this price!
      </span>
    </motion.div>
  )
}
