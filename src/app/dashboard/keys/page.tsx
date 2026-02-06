'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Copy, Check, RefreshCw, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { fadeUp, staggerContainer } from '@/lib/animations'

interface KeyData {
  key: string
  used?: boolean
  expires?: string
  expiry?: string
  duration?: string
  note?: string
  level?: number
  gendate?: string
  usedby?: string
  usedon?: string
}

type SortField = 'gendate' | 'key' | 'status' | 'usedby'
type SortDirection = 'asc' | 'desc'

// Helper to format Unix timestamp
function formatTimestamp(timestamp: string | number | undefined): string {
  if (!timestamp) return '-'
  const num = Number(timestamp)
  if (isNaN(num) || num === 0) return '-'

  // If it looks like a Unix timestamp (seconds since epoch)
  const date = num > 9999999999 ? new Date(num) : new Date(num * 1000)

  if (isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Helper to format key duration/expiry
function formatDuration(key: KeyData): string {
  // KeyAuth returns expiry as Unix timestamp or duration in seconds
  const expiry = key.expires || key.expiry || key.duration
  if (!expiry) return '-'

  const num = Number(expiry)
  if (isNaN(num) || num === 0) return '-'

  // If it's a Unix timestamp (large number), calculate days from now
  if (num > 1000000000) {
    const now = Date.now() / 1000
    const diffSeconds = num - now
    if (diffSeconds <= 0) return 'Expired'
    const days = Math.ceil(diffSeconds / 86400)
    if (days === 1) return '1 day'
    if (days < 30) return `${days} days`
    if (days < 365) return `${Math.floor(days / 30)} months`
    return `${Math.floor(days / 365)} years`
  }

  // If it's duration in days or seconds
  if (num < 1000) {
    // Likely days
    if (num === 1) return '1 day'
    if (num < 30) return `${num} days`
    if (num < 365) return `${Math.floor(num / 30)} months`
    return `${Math.floor(num / 365)} years`
  }

  // Likely seconds
  const days = Math.ceil(num / 86400)
  if (days === 1) return '1 day'
  if (days < 30) return `${days} days`
  if (days < 365) return `${Math.floor(days / 30)} months`
  return `${Math.floor(days / 365)} years`
}

export default function KeysPage() {
  const queryClient = useQueryClient()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('gendate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Form state
  const [expiry, setExpiry] = useState('30')
  const [amount, setAmount] = useState('1')
  const [note, setNote] = useState('')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['reseller-keys'],
    queryFn: async () => {
      const res = await fetch('/api/keyauth/keys')
      if (!res.ok) throw new Error('Failed to fetch keys')
      return res.json()
    },
  })

  const createMutation = useMutation({
    mutationFn: async (params: { expiry: string; amount: string; note: string }) => {
      const res = await fetch('/api/keyauth/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error('Failed to create keys')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller-keys'] })
      setIsCreateModalOpen(false)
      setExpiry('30')
      setAmount('1')
      setNote('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (key: string) => {
      const res = await fetch(`/api/keyauth/keys?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete key')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller-keys'] })
    },
  })

  const keys: KeyData[] = data?.keys || []

  // Check if key is used (has usedby field or used flag)
  const isKeyUsed = (key: KeyData): boolean => {
    return Boolean(key.usedby) || Boolean(key.used) || Boolean(key.usedon)
  }

  // Sort and filter keys
  const sortedAndFilteredKeys = useMemo(() => {
    let result = [...keys]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (k) =>
          k.key.toLowerCase().includes(query) ||
          k.note?.toLowerCase().includes(query) ||
          k.usedby?.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'gendate':
          comparison = (Number(a.gendate) || 0) - (Number(b.gendate) || 0)
          break
        case 'key':
          comparison = a.key.localeCompare(b.key)
          break
        case 'status':
          comparison = (isKeyUsed(a) ? 1 : 0) - (isKeyUsed(b) ? 1 : 0)
          break
        case 'usedby':
          comparison = (a.usedby || '').localeCompare(b.usedby || '')
          break
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })

    return result
  }, [keys, searchQuery, sortField, sortDirection])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 opacity-50" />
    return sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const usedCount = keys.filter(isKeyUsed).length
  const unusedCount = keys.length - usedCount

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">License Keys</h1>
          <p className="mt-1 text-text-muted">
            Create and manage your license keys
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            leftIcon={<RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Keys
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeUp}>
        <Input
          placeholder="Search by key, note, or user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </motion.div>

      {/* Keys Table */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : sortedAndFilteredKeys.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                {searchQuery ? 'No keys match your search' : 'No keys found. Create your first key!'}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-surface-elevated">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      <button
                        onClick={() => toggleSort('key')}
                        className="flex items-center gap-1 hover:text-text-primary transition-colors"
                      >
                        Key <SortIcon field="key" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      <button
                        onClick={() => toggleSort('status')}
                        className="flex items-center gap-1 hover:text-text-primary transition-colors"
                      >
                        Status <SortIcon field="status" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      <button
                        onClick={() => toggleSort('usedby')}
                        className="flex items-center gap-1 hover:text-text-primary transition-colors"
                      >
                        Used By <SortIcon field="usedby" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      Note
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      <button
                        onClick={() => toggleSort('gendate')}
                        className="flex items-center gap-1 hover:text-text-primary transition-colors"
                      >
                        Created <SortIcon field="gendate" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-stroke">
                  {sortedAndFilteredKeys.map((key) => (
                    <tr key={key.key} className="hover:bg-surface-elevated/50">
                      <td className="px-4 py-3">
                        <code className="text-sm font-mono text-text-primary">
                          {key.key}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={isKeyUsed(key) ? 'success' : 'warning'}>
                          {isKeyUsed(key) ? 'Used' : 'Unused'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {formatDuration(key)}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {key.usedby || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {key.note || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {formatTimestamp(key.gendate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyToClipboard(key.key)}
                            className="p-2 text-text-muted hover:text-primary transition-colors"
                            title="Copy key"
                          >
                            {copiedKey === key.key ? (
                              <Check className="w-4 h-4 text-status-ok" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => deleteMutation.mutate(key.key)}
                            disabled={deleteMutation.isPending}
                            className="p-2 text-text-muted hover:text-status-danger transition-colors"
                            title="Delete key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-text-primary">{keys.length}</p>
            <p className="text-sm text-text-muted">Total Keys</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-warn">{unusedCount}</p>
            <p className="text-sm text-text-muted">Unused</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-ok">{usedCount}</p>
            <p className="text-sm text-text-muted">Used</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create License Keys"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createMutation.mutate({ expiry, amount, note })
          }}
          className="p-6 space-y-4"
        >
          <Input
            label="Expiry (days)"
            type="number"
            min="1"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
          />
          <Input
            label="Amount"
            type="number"
            min="1"
            max="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <Input
            label="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Customer name"
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={createMutation.isPending}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
