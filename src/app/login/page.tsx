'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Key, User, Lock, Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { fadeUp, staggerContainer } from '@/lib/animations'

type AuthMode = 'login' | 'register'

export default function ResellerLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Login fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Register fields
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [licenseKey, setLicenseKey] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/keyauth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, action: 'login' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/keyauth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          licenseKey,
          username: regUsername,
          password: regPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Registration successful - redirect to login with success message
      setMode('login')
      setUsername(regUsername)
      setError('')
      alert('Registration successful! You can now login with your credentials.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (newMode: AuthMode) => {
    setError('')
    setMode(newMode)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="fixed inset-0 bg-surface-bg -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="w-full max-w-md px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-gold/10 border border-surface-stroke mb-4">
              {mode === 'login' ? (
                <User className="w-8 h-8 text-primary" />
              ) : (
                <Key className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-text-primary">
              Reseller <span className="gradient-text">{mode === 'login' ? 'Login' : 'Register'}</span>
            </h1>
            <p className="mt-2 text-text-muted">
              {mode === 'login'
                ? 'Sign in to access your reseller dashboard'
                : 'Register with your license key to create an account'}
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Card>
              <CardContent className="p-6">
                {/* Mode Toggle */}
                <div className="flex mb-6 bg-surface-elevated rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      mode === 'login'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      mode === 'register'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    Register
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {mode === 'login' ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                    >
                      <Input
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        leftIcon={<User className="w-4 h-4" />}
                        disabled={isLoading}
                        required
                      />

                      <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4" />}
                        disabled={isLoading}
                        required
                      />

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-status-danger text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || !username || !password}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleRegister}
                      className="space-y-4"
                    >
                      <Input
                        label="License Key"
                        placeholder="******-******-******-******"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        leftIcon={<Key className="w-4 h-4" />}
                        disabled={isLoading}
                        required
                      />

                      <Input
                        label="Username"
                        placeholder="Choose a username"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        leftIcon={<User className="w-4 h-4" />}
                        disabled={isLoading}
                        required
                      />

                      <Input
                        label="Password"
                        type="password"
                        placeholder="Create a password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4" />}
                        disabled={isLoading}
                        required
                      />

                      <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4" />}
                        disabled={isLoading}
                        required
                      />

                      <p className="text-xs text-text-dim">
                        Your license key will be consumed after registration. Use your username and password to login afterwards.
                      </p>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-status-danger text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isLoading || !licenseKey || !regUsername || !regPassword || !regConfirmPassword}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-6 text-center">
            <p className="text-text-dim text-sm">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchMode('register')}
                    className="text-primary hover:underline"
                  >
                    Register with license key
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
            <p className="text-text-dim text-sm mt-2">
              Need a reseller license?{' '}
              <a href="/resellers" className="text-primary hover:underline">
                Become a Reseller
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
