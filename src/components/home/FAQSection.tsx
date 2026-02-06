'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { FAQ_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 bg-surface-panel">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
            FAQ
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl sm:text-4xl font-bold text-text-primary"
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-4"
        >
          {FAQ_ITEMS.map((item, index) => (
            <motion.div key={index} variants={fadeUp}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={cn(
                  'w-full text-left p-5 rounded-xl bg-surface-bg border transition-all duration-300',
                  openIndex === index
                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                    : 'border-surface-stroke hover:border-surface-stroke-light'
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary pr-4">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </div>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-text-muted leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
