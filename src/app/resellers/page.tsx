'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, Users, DollarSign, Headphones, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer, glowPulse } from '@/lib/animations'
import { DISCORD_INVITE } from '@/lib/constants'

const benefits = [
  {
    icon: TrendingUp,
    title: 'High Margins',
    description: 'Earn competitive commissions on every sale with our generous reseller pricing.',
  },
  {
    icon: Users,
    title: 'Growing Market',
    description: 'Tap into a rapidly growing market with high demand for premium gaming solutions.',
  },
  {
    icon: DollarSign,
    title: 'Instant Payouts',
    description: 'Get paid instantly via your preferred method - crypto, PayPal, or bank transfer.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Access priority support and resources to help you succeed as a reseller.',
  },
]

const tiers = [
  {
    name: 'Starter',
    keys: 10,
    discount: '10%',
    price: 89.99,
    features: ['10 License Keys', '10% Discount', 'Basic Support', 'Dashboard Access'],
  },
  {
    name: 'Pro',
    keys: 25,
    discount: '15%',
    price: 199.99,
    popular: true,
    features: ['25 License Keys', '15% Discount', 'Priority Support', 'Dashboard Access', 'Custom Branding'],
  },
  {
    name: 'Enterprise',
    keys: 50,
    discount: '20%',
    price: 349.99,
    features: ['50 License Keys', '20% Discount', 'VIP Support', 'Dashboard Access', 'Custom Branding', 'API Access'],
  },
]

export default function ResellersPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="fixed inset-0 bg-surface-bg -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Hero */}
          <motion.div variants={fadeUp} className="text-center mb-16">
            <Badge variant="gold" className="mb-4">
              💰 Reseller Program
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary">
              Grow Your <span className="gradient-text">Business</span>
            </h1>
            <p className="mt-4 text-lg text-text-muted max-w-2xl mx-auto">
              Partner with REBOOTED and start earning. Access wholesale pricing, dedicated support, and a proven product line.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <motion.div variants={glowPulse} initial="initial" animate="animate">
                  <Button size="lg">
                    Become a Reseller
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              </a>
              <Link href="/login">
                <Button variant="secondary" size="lg">
                  Reseller Login
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div variants={fadeUp} className="mb-20">
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
              Why Partner With Us?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit) => (
                <Card key={benefit.title} hover className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent-gold/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-text-muted text-sm">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Tiers */}
          <motion.div variants={fadeUp}>
            <h2 className="text-2xl font-bold text-text-primary text-center mb-8">
              Reseller Packages
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  hover
                  glow={tier.popular}
                  className={`relative ${tier.popular ? 'border-primary ring-2 ring-primary/20' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="gold">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {tier.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-black gradient-text">
                        ${tier.price}
                      </span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-text-muted">
                          <span className="text-status-ok">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant={tier.popular ? 'primary' : 'secondary'}
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-20 text-center">
            <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent-gold/10 border-primary/20">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Ready to Start Earning?
              </h3>
              <p className="text-text-muted mb-6 max-w-lg mx-auto">
                Join our Discord and open a ticket to become a verified reseller. Our team will guide you through the process.
              </p>
              <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  Contact Us on Discord
                </Button>
              </a>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
