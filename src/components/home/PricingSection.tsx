'use client'

import { motion } from 'framer-motion'
import { Check, X, Flame, Clock, Lock, Zap, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer, glowPulse } from '@/lib/animations'
import { homePricingTiers } from '@/lib/products'
import { formatPrice } from '@/lib/utils'
import { CountdownTimer } from '@/components/marketing/CountdownTimer'
import { CheckoutButton } from '@/components/checkout/CheckoutButton'

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-surface-bg relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeUp}
            className="text-primary font-semibold text-sm uppercase tracking-wider"
          >
            Pricing Plans
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary"
          >
            Choose Your <span className="gradient-text">Plan</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-text-muted max-w-2xl mx-auto"
          >
            Start dominating today with our premium HWID Spoofer. All plans include instant delivery.
          </motion.p>

          {/* Urgency Timer */}
          <motion.div variants={fadeUp} className="mt-6 flex justify-center">
            <CountdownTimer hours={23} minutes={59} seconds={59} />
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {homePricingTiers.map((tier) => (
            <motion.div key={tier.name} variants={fadeUp}>
              <Card
                hover
                glow={tier.highlighted}
                className={`relative h-full ${
                  tier.highlighted
                    ? 'border-primary ring-2 ring-primary/20'
                    : ''
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gold" className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {tier.badge}
                    </Badge>
                  </div>
                )}

                {/* Discount Badge */}
                {tier.discount && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="danger" pulse>
                      {tier.discount}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-2">
                      {tier.originalPrice && (
                        <span className="text-text-muted line-through text-lg">
                          {formatPrice(tier.originalPrice)}
                        </span>
                      )}
                      <span className="text-4xl font-black gradient-text">
                        {formatPrice(tier.price)}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm mt-1">{tier.period}</p>
                    <p className="text-primary text-xs mt-2 font-medium">
                      {tier.perUnit}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li
                        key={feature.name}
                        className="flex items-center gap-3 text-sm"
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4 text-status-ok flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-text-dim flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.included ? 'text-text-primary' : 'text-text-dim'
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {tier.highlighted ? (
                    <motion.div
                      variants={glowPulse}
                      initial="initial"
                      animate="animate"
                    >
                      <CheckoutButton
                        productId={tier.sellAuthVariantId || ''}
                        variantId={tier.sellAuthVariantId || ''}
                        label="Get Started"
                        className="w-full"
                      />
                    </motion.div>
                  ) : (
                    <CheckoutButton
                      productId={tier.sellAuthVariantId || ''}
                      variantId={tier.sellAuthVariantId || ''}
                      label="Select Plan"
                      className="w-full"
                      urgency={false}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-text-muted text-sm">
            <span className="flex items-center gap-1">
              <Lock className="w-4 h-4 text-status-ok" /> Secure Payment
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-status-ok" /> Instant Delivery
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-status-ok" /> 24/7 Support
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
