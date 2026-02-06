import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getKeyAuthAPI, createKeyAuthInstance } from '@/lib/keyauth'

// POST - Handle login (username/password) or register (license key)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password, licenseKey } = body

    // Handle registration with license key + username + password
    if (action === 'register') {
      return handleRegister(licenseKey, username, password)
    }

    // Handle login with username/password
    if (action === 'login' || (!action && username && password)) {
      return handleLogin(username, password)
    }

    return NextResponse.json(
      { error: 'Invalid request. Provide username/password for login or licenseKey for register.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}

// Handle login with username/password via KeyAuth
async function handleLogin(username: string, password: string) {
  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    )
  }

  try {
    // Create fresh KeyAuth instance for login
    const keyAuth = createKeyAuthInstance()

    // Initialize app session
    const initResult = await keyAuth.initApp()
    if (!initResult.success) {
      console.error('KeyAuth init failed:', initResult.message)
      return NextResponse.json(
        { error: initResult.message || 'Authentication service unavailable' },
        { status: 503 }
      )
    }

    // Login with KeyAuth
    const loginResult = await keyAuth.loginUser(username, password)

    if (!loginResult.success) {
      return NextResponse.json(
        { error: loginResult.message || 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Get user info for session
    const subscriptions = loginResult.info?.subscriptions || []

    // Create session - user must have registered with a valid reseller key
    const cookieStore = await cookies()
    cookieStore.set('reseller_session', JSON.stringify({
      username: username.toLowerCase(),
      authType: 'login',
      authenticated: true,
      timestamp: Date.now(),
      subscriptions,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      username: username.toLowerCase(),
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}

// Handle registration with license key, username, and password
async function handleRegister(licenseKey: string, username?: string, password?: string) {
  if (!licenseKey) {
    return NextResponse.json(
      { error: 'License key is required' },
      { status: 400 }
    )
  }

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required' },
      { status: 400 }
    )
  }

  try {
    const sellerApi = getKeyAuthAPI()

    // Verify the license key exists and get info
    const keyInfo = await sellerApi.getLicenseInfo(licenseKey)

    if (!keyInfo.success) {
      return NextResponse.json(
        { error: keyInfo.message || 'Invalid license key' },
        { status: 401 }
      )
    }

    // Check if the key has admin access (level 999 or "admin" in note/subscription)
    const level = Number(keyInfo.level) || 0
    const note = (keyInfo.note || '').toLowerCase()
    const subscription = (keyInfo.subscription || '').toLowerCase()

    const isAdmin = level === 999 ||
                    note.includes('admin') ||
                    subscription.includes('admin') ||
                    note.includes('reseller') ||
                    subscription.includes('reseller')

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'This license key does not have reseller access. Required: Level 999 or admin subscription.' },
        { status: 403 }
      )
    }

    // Check if key is already used
    if (keyInfo.usedby || keyInfo.usedon) {
      return NextResponse.json(
        { error: 'This license key has already been used' },
        { status: 400 }
      )
    }

    // Register user with KeyAuth using the application API
    const appKeyAuth = createKeyAuthInstance()

    // Initialize app session
    const initResult = await appKeyAuth.initApp()
    if (!initResult.success) {
      console.error('KeyAuth init failed:', initResult.message)
      return NextResponse.json(
        { error: 'Registration service unavailable' },
        { status: 503 }
      )
    }

    // Register the user with KeyAuth (this consumes the license key)
    const registerResult = await appKeyAuth.registerUser(username, password, licenseKey)

    if (!registerResult.success) {
      return NextResponse.json(
        { error: registerResult.message || 'Registration failed. Username may already exist.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful! You can now login with your credentials.',
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

// GET - Check current session
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('reseller_session')

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)

    return NextResponse.json({
      authenticated: true,
      authType: session.authType,
      username: session.username,
      level: session.level,
    })
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}

// DELETE - Logout (clear session)
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('reseller_session')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
