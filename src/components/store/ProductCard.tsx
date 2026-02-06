'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Flame, Gamepad2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cardHover } from '@/lib/animations'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = Math.min(...product.variants.map((v) => v.price))

  return (
    <motion.div
      variants={cardHover}
      initial="initial"
      whileHover="hover"
      className="rounded-xl"
    >
      <Link href={`/store/${product.slug}`}>
        <Card className="h-full overflow-hidden group">
          {/* Image */}
          <div className="relative aspect-video bg-surface-elevated overflow-hidden">
            {product.images && product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-panel to-surface-elevated flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-primary/50" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isBestSeller && (
                <Badge variant="gold" className="flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Best Seller
                </Badge>
              )}
              {product.badge && !product.isBestSeller && (
                <Badge variant="primary">{product.badge}</Badge>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-5">
            <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <p className="mt-2 text-text-muted text-sm line-clamp-2">
              {product.shortDescription}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-text-dim text-sm">Starting at</span>
                <p className="text-2xl font-bold gradient-text">
                  {formatPrice(lowestPrice)}
                </p>
              </div>

              <Button variant="secondary" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                View
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Features Preview */}
            <div className="mt-4 pt-4 border-t border-surface-stroke">
              <div className="flex flex-wrap gap-2">
                {product.antiCheat.split(',').map((ac) => (
                  <span
                    key={ac.trim()}
                    className="text-xs px-2 py-1 bg-surface-elevated rounded text-text-muted"
                  >
                    {ac.trim()}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
