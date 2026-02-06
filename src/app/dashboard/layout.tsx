'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutDashboard, Key, Users, Download, LogOut, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/keys', label: 'Keys', icon: Key },
  { href: '/dashboard/users', label: 'Users', icon: Users },
  { href: '/dashboard/loaders', label: 'Loaders', icon: Download },
]

export default function ResellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/keyauth/keys', { method: 'GET' })
        if (!response.ok) {
          router.push('/login')
          return
        }
        setIsLoading(false)
      } catch {
        router.push('/reseller-login')
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/keyauth/login', { method: 'DELETE' })
      router.push('/reseller-login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 min-h-[calc(100vh-5rem)] bg-surface-panel border-r border-surface-stroke">
          <div className="p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6">
              Reseller Panel
            </h2>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-8 pt-8 border-t border-surface-stroke">
              <Button
                variant="ghost"
                className="w-full justify-start text-text-muted hover:text-status-danger"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-20 left-0 right-0 z-40 bg-surface-panel border-b border-surface-stroke px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-primary">Reseller Panel</h2>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-text-primary"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="lg:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="w-64 h-full bg-surface-panel pt-32"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-text-muted hover:text-text-primary hover:bg-surface-elevated'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
                <Button
                  variant="ghost"
                  className="w-full justify-start text-text-muted hover:text-status-danger mt-4"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </nav>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 mt-14 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  )
}
