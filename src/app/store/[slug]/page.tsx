'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Check, Monitor, Cpu, Shield, Gamepad2, HardDrive, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckoutButton } from '@/components/checkout/CheckoutButton'
import { TrustBadges } from '@/components/marketing/TrustBadges'
import { StockIndicator } from '@/components/marketing/StockIndicator'
import { fadeUp, staggerContainer, glowPulse } from '@/lib/animations'
import { getProductBySlug } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'

const requirementIcons = {
  os: Monitor,
  processor: Cpu,
  antiCheat: Shield,
  gameMode: Gamepad2,
  spoofer: HardDrive,
  platform: Globe,
}

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const product = getProductBySlug(slug)

  const [selectedVariant, setSelectedVariant] = useState(0)

  if (!product) {
    notFound()
  }

  const currentVariant = product.variants[selectedVariant]

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Background */}
      <div className="fixed inset-0 bg-surface-bg -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/store"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Store
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <div className="sticky top-24">
              <div className="aspect-video bg-surface-panel rounded-2xl border border-surface-stroke overflow-hidden relative">
                {product.images && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-panel to-surface-elevated flex items-center justify-center">
                    <Gamepad2 className="w-16 h-16 text-primary/50" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-3 mb-2">
                {product.isBestSeller && (
                  <Badge variant="gold">🔥 Best Seller</Badge>
                )}
                {product.badge && !product.isBestSeller && (
                  <Badge variant="primary">{product.badge}</Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-text-primary">
                {product.name}
              </h1>
              <p className="mt-2 text-text-muted">
                {product.description}
              </p>
            </motion.div>

            {/* Variant Selector */}
            <motion.div variants={fadeUp}>
              <h3 className="text-lg font-semibold text-text-primary mb-3">
                Select Duration
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(index)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedVariant === index
                        ? 'border-primary bg-primary/10'
                        : 'border-surface-stroke hover:border-surface-stroke-light bg-surface-panel'
                    }`}
                  >
                    {variant.isBestValue && (
                      <Badge
                        variant="gold"
                        size="sm"
                        className="absolute -top-2 -right-2"
                      >
                        Best
                      </Badge>
                    )}
                    <p className="font-semibold text-text-primary">
                      {variant.label}
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      {variant.originalPrice && (
                        <span className="text-text-dim line-through text-sm">
                          {formatPrice(variant.originalPrice)}
                        </span>
                      )}
                      <span className="text-xl font-bold gradient-text">
                        {formatPrice(variant.price)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Stock Indicator */}
            <motion.div variants={fadeUp}>
              <StockIndicator stock={7} />
            </motion.div>

            {/* Purchase Button */}
            <motion.div variants={fadeUp}>
              <motion.div
                variants={glowPulse}
                initial="initial"
                animate="animate"
                className="rounded-xl"
              >
                <CheckoutButton
                  productId={product.sellAuthProductId}
                  variantId={currentVariant.sellAuthVariantId}
                  price={currentVariant.price}
                  label={`Buy Now - ${formatPrice(currentVariant.price)}`}
                  className="w-full"
                />
              </motion.div>
              <TrustBadges className="mt-4" />
            </motion.div>

            {/* Requirements */}
            {product.requirements && (
              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Requirements
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(product.requirements).map(([key, value]) => {
                    const Icon = requirementIcons[key as keyof typeof requirementIcons]
                    return (
                      <div
                        key={key}
                        className="p-4 bg-surface-panel rounded-xl border border-surface-stroke"
                      >
                        <Icon className="w-5 h-5 text-primary mb-2" />
                        <p className="text-xs text-text-dim capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm font-medium text-text-primary">{value}</p>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Features */}
            <motion.div variants={fadeUp}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Features
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(product.features).map(([category, features]) => (
                  features && features.length > 0 && (
                    <Card key={category} className="p-4">
                      <h4 className="font-semibold text-primary capitalize mb-3">
                        {category}
                      </h4>
                      <ul className="space-y-2">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-text-muted"
                          >
                            <Check className="w-4 h-4 text-status-ok flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )
                ))}
              </div>
            </motion.div>

            {/* Video (if available) */}
            {product.videoUrl && (
              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Showcase
                </h3>
                <div className="aspect-video bg-surface-panel rounded-xl border border-surface-stroke overflow-hidden">
                  <iframe
                    src={product.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
