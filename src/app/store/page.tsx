'use client'

import { motion } from 'framer-motion'
import { Flame, Lock, Zap, MessageCircle, RefreshCw } from 'lucide-react'
import { ProductGrid } from '@/components/store/ProductGrid'
import { Badge } from '@/components/ui/Badge'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { products } from '@/lib/products'

export default function StorePage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-surface-bg -z-10" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.div variants={fadeUp}>
            <Badge variant="gold" className="mb-4 inline-flex items-center gap-1">
              <Flame className="w-4 h-4" /> Limited Time Deals
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-text-primary"
          >
            Premium <span className="gradient-text">Products</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-text-muted max-w-2xl mx-auto"
          >
            Exceptional quality for the best price. All products include instant delivery and 24/7 support.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <ProductGrid products={products} />

        {/* Trust Footer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-text-muted text-sm">
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-status-ok" /> Secure Checkout
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-status-ok" /> Instant Delivery
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-status-ok" /> 24/7 Support
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-4 h-4 text-status-ok" /> Easy Refunds
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
