'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Headphones, Settings, RefreshCw, CreditCard } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { FEATURES } from '@/lib/constants'

const iconMap = {
  Shield,
  Zap,
  Headphones,
  Settings,
  RefreshCw,
  CreditCard,
}

export function WhyChooseSection() {
  return (
    <section className="py-20 bg-surface-bg relative">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-panel to-surface-bg" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            className="text-primary font-semibold text-sm uppercase tracking-wider"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary"
          >
            Everything You Need to{' '}
            <span className="gradient-text">Dominate</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-text-muted max-w-2xl mx-auto"
          >
            Industry-leading features designed for serious gamers who demand the best.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap]
            return (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card hover className="h-full">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent-gold/20 flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
