'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { RefreshCw, Search, Ban, RotateCcw, Clock, Trash2, MoreVertical, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { fadeUp, staggerContainer } from '@/lib/animations'

interface UserData {
  username: string
  ip?: string
  hwid?: string
  createdate?: string
  lastlogin?: string
  banned?: string
  subscriptions?: Array<{
    subscription: string
    expiry: string
  }>
}

type SortField = 'username' | 'status' | 'createdate' | 'lastlogin'
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

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [extendDays, setExtendDays] = useState('30')
  const [sortField, setSortField] = useState<SortField>('createdate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['reseller-users'],
    queryFn: async () => {
      const res = await fetch('/api/keyauth/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      return res.json()
    },
  })

  const userActionMutation = useMutation({
    mutationFn: async (params: { action: string; username: string; [key: string]: any }) => {
      const res = await fetch('/api/keyauth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) throw new Error('Action failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller-users'] })
      setIsActionModalOpen(false)
      setSelectedUser(null)
    },
  })

  const users: UserData[] = data?.users || []

  // Sort and filter users
  const sortedAndFilteredUsers = useMemo(() => {
    let result = [...users]

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((u) =>
        u.username.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'username':
          comparison = a.username.localeCompare(b.username)
          break
        case 'status':
          comparison = (a.banned ? 1 : 0) - (b.banned ? 1 : 0)
          break
        case 'createdate':
          comparison = (Number(a.createdate) || 0) - (Number(b.createdate) || 0)
          break
        case 'lastlogin':
          comparison = (Number(a.lastlogin) || 0) - (Number(b.lastlogin) || 0)
          break
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })

    return result
  }, [users, searchQuery, sortField, sortDirection])

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

  const handleAction = (action: string) => {
    if (!selectedUser) return

    const params: any = {
      action,
      username: selectedUser.username,
    }

    if (action === 'extend') {
      params.subscription = 'default'
      params.expiry = extendDays
    }

    userActionMutation.mutate(params)
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Users</h1>
          <p className="mt-1 text-text-muted">
            Manage your users and their subscriptions
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          leftIcon={<RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeUp}>
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </motion.div>

      {/* Users Table */}
      <motion.div variants={fadeUp}>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : sortedAndFilteredUsers.length === 0 ? (
              <div className="p-8 text-center text-text-muted">
                {searchQuery ? 'No users match your search' : 'No users found'}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-surface-elevated">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      <button
                        onClick={() => toggleSort('username')}
                        className="flex items-center gap-1 hover:text-text-primary transition-colors"
                      >
                        Username <SortIcon field="username" />
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
                      IP Address
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      <button
                        onClick={() => toggleSort('lastlogin')}
                        className="flex items-center gap-1 hover:text-text-primary transition-colors"
                      >
                        Last Login <SortIcon field="lastlogin" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-text-muted">
                      <button
                        onClick={() => toggleSort('createdate')}
                        className="flex items-center gap-1 hover:text-text-primary transition-colors"
                      >
                        Created <SortIcon field="createdate" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-stroke">
                  {sortedAndFilteredUsers.map((user) => (
                    <tr key={user.username} className="hover:bg-surface-elevated/50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-text-primary">
                          {user.username}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.banned ? 'danger' : 'success'}>
                          {user.banned ? 'Banned' : 'Active'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted font-mono">
                        {user.ip || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {formatTimestamp(user.lastlogin)}
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {formatTimestamp(user.createdate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setIsActionModalOpen(true)
                            }}
                            className="p-2 text-text-muted hover:text-primary transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
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
            <p className="text-2xl font-bold text-text-primary">{users.length}</p>
            <p className="text-sm text-text-muted">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-ok">
              {users.filter((u) => !u.banned).length}
            </p>
            <p className="text-sm text-text-muted">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-status-danger">
              {users.filter((u) => u.banned).length}
            </p>
            <p className="text-sm text-text-muted">Banned</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false)
          setSelectedUser(null)
        }}
        title={`Manage User: ${selectedUser?.username}`}
        size="md"
      >
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => handleAction('resetHwid')}
              isLoading={userActionMutation.isPending}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Reset HWID
            </Button>
            <Button
              variant={selectedUser?.banned ? 'success' : 'danger'}
              onClick={() => handleAction(selectedUser?.banned ? 'unban' : 'ban')}
              isLoading={userActionMutation.isPending}
              leftIcon={<Ban className="w-4 h-4" />}
            >
              {selectedUser?.banned ? 'Unban' : 'Ban'}
            </Button>
          </div>

          <hr className="border-surface-stroke" />

          <div>
            <h4 className="font-semibold text-text-primary mb-3">Extend Subscription</h4>
            <div className="space-y-3">
              <Input
                label="Days to Add"
                type="number"
                min="1"
                value={extendDays}
                onChange={(e) => setExtendDays(e.target.value)}
              />
              <Button
                variant="primary"
                onClick={() => handleAction('extend')}
                isLoading={userActionMutation.isPending}
                leftIcon={<Clock className="w-4 h-4" />}
                className="w-full"
              >
                Extend
              </Button>
            </div>
          </div>

          <hr className="border-surface-stroke" />

          <Button
            variant="danger"
            onClick={() => handleAction('delete')}
            isLoading={userActionMutation.isPending}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="w-full"
          >
            Delete User
          </Button>
        </div>
      </Modal>
    </motion.div>
  )
}
