'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Key, Users, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { fadeUp, staggerContainer } from '@/lib/animations'

interface KeyData {
  key: string
  used?: boolean
  usedby?: string
  usedon?: string
  expires?: string
}

interface UserData {
  username: string
}

export default function ResellerDashboardPage() {
  const { data: keysData, isLoading: keysLoading } = useQuery({
    queryKey: ['reseller-keys'],
    queryFn: async () => {
      const res = await fetch('/api/keyauth/keys')
      if (!res.ok) throw new Error('Failed to fetch keys')
      return res.json()
    },
  })

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['reseller-users'],
    queryFn: async () => {
      const res = await fetch('/api/keyauth/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      return res.json()
    },
  })

  const keys: KeyData[] = keysData?.keys || []
  const users: UserData[] = usersData?.users || []

  const stats = [
    {
      icon: Key,
      label: 'Total Keys',
      value: keys.length,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Users,
      label: 'Active Users',
      value: users.length,
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
    },
    {
      icon: Clock,
      label: 'Unused Keys',
      value: keys.filter((k) => !k.usedby && !k.used && !k.usedon).length,
      color: 'text-status-warn',
      bg: 'bg-status-warn/10',
    },
    {
      icon: TrendingUp,
      label: 'Used Keys',
      value: keys.filter((k) => k.usedby || k.used || k.usedon).length,
      color: 'text-status-ok',
      bg: 'bg-status-ok/10',
    },
  ]

  const isLoading = keysLoading || usersLoading

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="mt-2 text-text-muted">
          Welcome back! Here's an overview of your reseller account.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp}>
        <h2 className="text-xl font-bold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card hover className="cursor-pointer">
            <a href="/dashboard/keys">
              <CardContent className="p-6 text-center">
                <Key className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary">Manage Keys</h3>
                <p className="text-sm text-text-muted mt-1">
                  Create, view, and delete license keys
                </p>
              </CardContent>
            </a>
          </Card>

          <Card hover className="cursor-pointer">
            <a href="/dashboard/users">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                <h3 className="font-semibold text-text-primary">Manage Users</h3>
                <p className="text-sm text-text-muted mt-1">
                  View users, reset HWID, extend subscriptions
                </p>
              </CardContent>
            </a>
          </Card>
        </div>
      </motion.div>

    </motion.div>
  )
}
