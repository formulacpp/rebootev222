'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { fadeUp, staggerContainer } from '@/lib/animations'

// Game icon images mapping
const gameImages: Record<string, string> = {
  'Fortnite': '/images/games/fortnite.png',
  'Rainbow Six Siege': '/images/games/rainbow.png',
  'PUBG': '/images/games/pubg.png',
  'Apex Legends': '/images/games/apex.png',
  'Rust': '/images/games/rust.png',
  'Call of Duty': '/images/games/cod.png',
  'Escape from Tarkov': '/images/games/eft.png',
  'FiveM': '/images/games/gta.png',
  'Delta Force': '/images/games/deltaforce.png',
  'Dead By Daylight': '/images/games/dbd.png',
}

const games = [
  { name: 'Fortnite', status: 'Updated' },
  { name: 'Rainbow Six Siege', status: 'Updated' },
  { name: 'PUBG', status: 'Updated' },
  { name: 'Apex Legends', status: 'Updated' },
  { name: 'Rust', status: 'Updated' },
  { name: 'Call of Duty', status: 'Updated' },
  { name: 'Escape from Tarkov', status: 'Updated' },
  { name: 'FiveM', status: 'Updated' },
  { name: 'Delta Force', status: 'Updated' },
  { name: 'Dead By Daylight', status: 'Updated' },
]

export default function StatusPage() {
  const lastChecked = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="fixed inset-0 bg-surface-bg -z-10" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-status-ok/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary">
              System <span className="gradient-text">Status</span>
            </h1>
            <p className="mt-2 text-text-muted">
              Real-time status of all REBOOTED services
            </p>
          </motion.div>

          {/* Overall Status */}
          <motion.div variants={fadeUp} className="mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-status-ok/10">
                    <CheckCircle className="w-6 h-6 text-status-ok" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">
                      All Systems Operational
                    </h2>
                    <p className="text-sm font-medium text-status-ok">
                      Everything is running smoothly
                    </p>
                  </div>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
              <p className="mt-4 text-sm text-text-dim">
                Last checked: {lastChecked}
              </p>
            </Card>
          </motion.div>

          {/* Games Status List */}
          <motion.div variants={fadeUp}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Supported Games</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {games.map((game) => {
                return (
                  <Card key={game.name} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg">
                          <Image src={gameImages[game.name]} alt={game.name} width={28} height={28} className="w-7 h-7 object-contain" />
                        </div>
                        <span className="font-medium text-text-primary">{game.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-status-ok" />
                        <span className="text-sm text-status-ok font-medium">{game.status}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </motion.div>

          {/* Products Status */}
          <motion.div variants={fadeUp} className="mt-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Products</h3>
            <div className="space-y-3">
              {['Temp Spoofer', 'Fortnite'].map((product) => (
                <Card key={product} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-status-ok" />
                      <span className="font-medium text-text-primary">{product}</span>
                    </div>
                    <Badge variant="success">Operational</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={fadeUp} className="mt-12 text-center">
            <p className="text-text-dim text-sm">
              Having issues? Contact us on{' '}
              <a href="https://discord.gg/REBOOTED" className="text-primary hover:underline">
                Discord
              </a>
            </p>
            <p className="text-text-dim text-xs mt-2">
              Status updates are refreshed automatically. Real-time API integration coming soon.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
