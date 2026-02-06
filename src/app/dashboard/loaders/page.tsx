'use client'

import { motion } from 'framer-motion'
import { Download, ExternalLink, Shield, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { fadeUp, staggerContainer } from '@/lib/animations'

interface Loader {
  name: string
  description: string
  downloadUrl: string
  version?: string
  lastUpdated?: string
}

// Configure download URLs here
const loaders: Loader[] = [
  {
    name: 'Crusader R6S',
    description: 'Rainbow Six Siege cheat loader',
    downloadUrl: '', // Set download URL
    version: '1.0.0',
  },
  {
    name: 'Onyx Full',
    description: 'Full feature cheat suite',
    downloadUrl: '', // Set download URL
    version: '2.0.0',
  },
  {
    name: 'Onyx Lite',
    description: 'Lightweight cheat loader',
    downloadUrl: '', // Set download URL
    version: '2.0.0',
  },
  {
    name: 'Perc R6S',
    description: 'Advanced R6S cheat loader',
    downloadUrl: '', // Set download URL
    version: '1.5.0',
  },
  {
    name: 'Temp Spoofer',
    description: 'Hardware ID spoofer',
    downloadUrl: '', // Set download URL
    version: '3.0.0',
  },
  {
    name: 'Fortnite Loader',
    description: 'Fortnite cheat loader',
    downloadUrl: '', // Set download URL
  },
  {
    name: 'PUBG Loader',
    description: 'PUBG cheat loader',
    downloadUrl: '', // Set download URL
  },
  {
    name: 'Apex Loader',
    description: 'Apex Legends cheat loader',
    downloadUrl: '', // Set download URL
  },
  {
    name: 'Rust Loader',
    description: 'Rust cheat loader',
    downloadUrl: '', // Set download URL
  },
  {
    name: 'COD Loader',
    description: 'Call of Duty cheat loader',
    downloadUrl: '', // Set download URL
  },
  {
    name: 'Tarkov Loader',
    description: 'Escape from Tarkov loader',
    downloadUrl: '', // Set download URL
  },
  {
    name: 'FiveM Loader',
    description: 'FiveM cheat loader',
    downloadUrl: '', // Set download URL
  },
]

export default function LoadersPage() {
  const handleDownload = (loader: Loader) => {
    if (!loader.downloadUrl) {
      alert('Download URL not configured yet. Contact admin.')
      return
    }
    window.open(loader.downloadUrl, '_blank')
  }

  const availableLoaders = loaders.filter(l => l.downloadUrl)
  const unavailableLoaders = loaders.filter(l => !l.downloadUrl)

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-text-primary">Loaders</h1>
        <p className="mt-1 text-text-muted">
          Download software loaders for your customers
        </p>
      </motion.div>

      {/* Warning Notice */}
      <motion.div variants={fadeUp}>
        <Card className="border-status-warn/30 bg-status-warn/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-status-warn flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">Important Notice</p>
                <p className="text-sm text-text-muted mt-1">
                  Only share loaders with verified customers who have valid license keys.
                  Unauthorized distribution is prohibited.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Loaders */}
      {availableLoaders.length > 0 && (
        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-status-ok" />
            Available Downloads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLoaders.map((loader) => (
              <Card key={loader.name} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-text-primary">{loader.name}</h3>
                    {loader.version && (
                      <Badge variant="secondary">v{loader.version}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-text-muted mb-4">{loader.description}</p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDownload(loader)}
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Unavailable Loaders */}
      <motion.div variants={fadeUp}>
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          All Loaders
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loaders.map((loader) => (
            <Card
              key={loader.name}
              className={`transition-colors ${loader.downloadUrl ? 'hover:border-primary/50' : 'opacity-75'}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-text-primary">{loader.name}</h3>
                  <div className="flex items-center gap-2">
                    {loader.version && (
                      <Badge variant="secondary">v{loader.version}</Badge>
                    )}
                    {loader.downloadUrl ? (
                      <Badge variant="success">Ready</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-text-muted mb-4">{loader.description}</p>
                <Button
                  variant={loader.downloadUrl ? 'primary' : 'secondary'}
                  size="sm"
                  className="w-full"
                  onClick={() => handleDownload(loader)}
                  disabled={!loader.downloadUrl}
                  leftIcon={loader.downloadUrl ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                >
                  {loader.downloadUrl ? 'Download' : 'Not Available'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-text-primary">{loaders.length}</p>
            <p className="text-sm text-text-muted">Total Loaders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-ok">{availableLoaders.length}</p>
            <p className="text-sm text-text-muted">Available</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
