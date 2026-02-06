'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Shield, Zap, Users, Flame } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { fadeUp, staggerContainer, floatAnimation, glowPulse } from '@/lib/animations'
import { DISCORD_INVITE } from '@/lib/constants'

const heroStats = [
  { icon: Users, value: '15K+', label: 'Active Users' },
  { icon: Shield, value: '99.9%', label: 'Uptime' },
  { icon: Zap, value: '24/7', label: 'Support' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-bg via-surface-bg to-surface-panel" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="mb-6">
            <Badge variant="gold" size="md" className="animate-pulse">
              <Flame className="w-4 h-4 inline mr-1" />
              LIMITED TIME: 50% OFF 90-Day Plans
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
          >
            <span className="text-text-primary">Premium Gaming</span>
            <br />
            <span className="gradient-text">Solutions That Work</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto"
          >
            Trusted by <span className="text-primary font-semibold">15,000+</span> gamers worldwide.
            Undetected, instant delivery, and backed by 24/7 expert support.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/store">
              <motion.div
                variants={glowPulse}
                initial="initial"
                animate="animate"
                className="rounded-lg"
              >
                <Button size="lg" className="text-lg px-8">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </Link>
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                Join Community
              </Button>
            </a>
          </motion.div>

          {/* Trust Stats */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-surface-panel border border-surface-stroke">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Product Image */}
          <motion.div
            variants={floatAnimation}
            initial="initial"
            animate="animate"
            className="mt-16"
          >
            <div className="max-w-md mx-auto">
              <Image
                src="/images/hero.png"
                alt="Premium Gaming Tools"
                width={504}
                height={504}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-text-muted rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
