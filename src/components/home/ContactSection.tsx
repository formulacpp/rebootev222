'use client'

import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer, glowPulse } from '@/lib/animations'
import { DISCORD_INVITE } from '@/lib/constants'

export function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-surface-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-panel to-surface-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-gold/10 border border-surface-stroke mb-6"
          >
            <MessageCircle className="w-10 h-10 text-primary" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary"
          >
            Ready to <span className="gradient-text">Get Started?</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg text-text-muted max-w-2xl mx-auto"
          >
            Join our Discord community of <span className="text-primary font-semibold">15,000+</span> members.
            Get instant support, updates, and connect with fellow gamers.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              <motion.div
                variants={glowPulse}
                initial="initial"
                animate="animate"
              >
                <Button size="lg" className="text-lg px-8">
                  Join Discord
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">15K+</p>
              <p className="text-sm text-text-muted">Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">24/7</p>
              <p className="text-sm text-text-muted">Support</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">5min</p>
              <p className="text-sm text-text-muted">Response</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
