'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { STATS } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const steps = 60
    const stepValue = value / steps
    const stepDuration = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-surface-panel relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center min-w-[5rem] px-4 py-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-gold/10 border border-surface-stroke mb-4 overflow-hidden">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black gradient-text whitespace-nowrap">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <p className="text-text-muted font-medium text-sm sm:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
