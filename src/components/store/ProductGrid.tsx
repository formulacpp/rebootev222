'use client'

import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import { staggerContainer, fadeUp } from '@/lib/animations'
import type { Product } from '@/lib/products'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.slug} variants={fadeUp}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
