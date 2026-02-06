'use client'

import Link from 'next/link'
import { CreditCard, Wallet, Bitcoin, Banknote } from 'lucide-react'
import { DISCORD_INVITE, NAV_LINKS } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-panel border-t border-surface-stroke">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold gradient-text">REBOOTED.LOL</span>
            </Link>
            <p className="mt-4 text-text-muted max-w-md">
              Premium gaming solutions trusted by thousands. Undetected, secure, and backed by 24/7 support.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="text-text-dim text-sm">Accepted Payments:</span>
              <div className="flex items-center gap-2">
                <CreditCard title="Visa" className="w-5 h-5 text-text-muted opacity-70 hover:opacity-100 transition-opacity" />
                <CreditCard title="Mastercard" className="w-5 h-5 text-text-muted opacity-70 hover:opacity-100 transition-opacity" />
                <Wallet title="PayPal" className="w-5 h-5 text-text-muted opacity-70 hover:opacity-100 transition-opacity" />
                <Bitcoin title="Bitcoin" className="w-5 h-5 text-text-muted opacity-70 hover:opacity-100 transition-opacity" />
                <Banknote title="CashApp" className="w-5 h-5 text-text-muted opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-muted hover:text-primary transition-colors duration-200"
                >
                  Discord Server
                </a>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-text-muted hover:text-primary transition-colors duration-200"
                >
                  Reseller Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-text-muted hover:text-primary transition-colors duration-200"
                >
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-surface-stroke">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text-dim text-sm">
              &copy; {currentYear} REBOOTED.LOL. All rights reserved.
            </p>
            <p className="text-text-dim text-xs text-center md:text-right max-w-xl">
              Disclaimer: REBOOTED is not affiliated with or endorsed by any game publishers or anti-cheat providers.
              Use at your own risk. By purchasing, you agree to our terms of service.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
