import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'REBOOTED | Premium Gaming Solutions',
  description: 'Premium HWID Spoofer & Gaming Enhancement Tools. Undetected, Fast Support, Instant Delivery.',
  keywords: ['HWID Spoofer', 'Gaming Tools', 'Rainbow Six Siege', 'Fortnite', 'PUBG', 'Apex Legends'],
  openGraph: {
    title: 'REBOOTED | Premium Gaming Solutions',
    description: 'Premium HWID Spoofer & Gaming Enhancement Tools',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-surface-bg text-text-primary antialiased">
        <Providers>
          <Header />
          <main className="relative">
            {children}
          </main>
          <Footer />
        </Providers>
        {/* SellAuth embed script for checkout functionality */}
        <Script
          src="https://sellauth.com/assets/js/sellauth-embed-2.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
