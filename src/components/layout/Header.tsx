'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS, DISCORD_INVITE } from '@/lib/constants'
import { Button } from '@/components/ui/Button'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const ticking = useRef(false)

  const updateScrollState = useCallback(() => {
    const shouldBeScrolled = window.scrollY > 50
    // Only update state if it actually changed
    setIsScrolled(prev => {
      if (prev !== shouldBeScrolled) {
        return shouldBeScrolled
      }
      return prev
    })
    ticking.current = false
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        // Use RAF to throttle to once per frame
        requestAnimationFrame(updateScrollState)
        ticking.current = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [updateScrollState])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
      {/* Dynamic Island Container */}
      <div className={cn(
        'mx-auto transition-all duration-500 ease-out',
        isScrolled ? 'pt-3 max-w-3xl' : 'pt-4 max-w-6xl'
      )}>
        <motion.div
          initial={false}
          animate={{
            borderRadius: isScrolled ? 9999 : 16,
          }}
          transition={{
            borderRadius: { duration: 0.3 },
          }}
          style={{ willChange: 'border-radius' }}
          className={cn(
            'mx-auto transition-all duration-300',
            'bg-surface-panel/95 backdrop-blur-md border border-surface-stroke',
            isScrolled
              ? 'shadow-2xl shadow-black/20'
              : 'shadow-lg shadow-black/10'
          )}
        >
          <div className={cn(
            'transition-all duration-300 px-4 sm:px-6',
          )}>
            <div className={cn(
              'flex items-center justify-between transition-all duration-300',
              isScrolled ? 'h-12' : 'h-14 md:h-16'
            )}>
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="REBOOTED.LOL"
                  width={32}
                  height={32}
                  className={cn(
                    'transition-all duration-300',
                    isScrolled ? 'w-6 h-6' : 'w-8 h-8'
                  )}
                />
                <span
                  className={cn(
                    'font-bold gradient-text transition-all duration-300',
                    isScrolled ? 'text-lg' : 'text-xl md:text-2xl'
                  )}
                >
                  REBOOTED.LOL
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'text-text-muted hover:text-text-primary transition-all duration-200 font-medium',
                      isScrolled ? 'text-sm' : 'text-sm lg:text-base'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* CTA Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="transition-all duration-300"
                  >
                    Reseller
                  </Button>
                </Link>
                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="primary"
                    size="xs"
                    className="glow-primary transition-all duration-300"
                  >
                    Discord
                  </Button>
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-text-primary"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-auto mt-2 max-w-6xl"
          >
            <div className="bg-surface-panel/95 backdrop-blur-md rounded-2xl border border-surface-stroke shadow-xl">
              <nav className="flex flex-col px-4 py-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors duration-200 font-medium py-2.5 px-3 rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-surface-stroke my-2" />
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors duration-200 font-medium py-2.5 px-3 rounded-lg"
                >
                  Reseller Login
                </Link>
                <a
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2"
                >
                  <Button variant="primary" size="md" className="w-full glow-primary">
                    Join Discord
                  </Button>
                </a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
