import { NextRequest, NextResponse } from 'next/server'
import { getKeyAuthAPI } from '@/lib/keyauth'
import { cookies } from 'next/headers'

// Helper to get current reseller identifier from session
async function getResellerIdentifier(): Promise<string | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('reseller_session')

  if (!session) return null

  try {
    const sessionData = JSON.parse(session.value)
    // Use license key if registered with key, otherwise use username
    return sessionData.licenseKey || sessionData.username || null
  } catch {
    return null
  }
}

// Create a unique tag for this reseller's keys
function createResellerTag(identifier: string): string {
  const shortId = identifier.replace(/-/g, '').substring(0, 8).toLowerCase()
  return `[r:${shortId}]`
}

// Check if a key belongs to this reseller
function keyBelongsToReseller(key: any, licenseKey: string): boolean {
  const tag = createResellerTag(licenseKey)
  return key.note && key.note.startsWith(tag)
}

// GET - Fetch all users (filtered by reseller's keys)
export async function GET() {
  try {
    const licenseKey = await getResellerIdentifier()

    if (!licenseKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const keyAuth = getKeyAuthAPI()

    // First get all keys belonging to this reseller
    const keysResult = await keyAuth.fetchAllLicenses()

    // Build a Set of usernames who have used this reseller's keys
    // Using the 'usedby' field on keys which stores the username that activated each key
    const resellerUsernames = new Set<string>()

    if (keysResult.success && keysResult.keys) {
      keysResult.keys
        .filter((key: any) => keyBelongsToReseller(key, licenseKey))
        .forEach((key: any) => {
          // If the key has been used, add the username to our set
          if (key.usedby) {
            resellerUsernames.add(key.usedby)
          }
        })
    }

    // Now get all users
    const usersResult = await keyAuth.fetchAllUsers()

    if (usersResult.success && usersResult.users) {
      // Filter users to only show those whose username is in our resellerUsernames set
      const filteredUsers = usersResult.users.filter((user: any) => {
        return resellerUsernames.has(user.username)
      })

      return NextResponse.json({
        ...usersResult,
        users: filteredUsers,
      })
    }

    return NextResponse.json(usersResult)
  } catch (error) {
    console.error('KeyAuth users fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST - User actions (ban, unban, reset HWID, extend)
export async function POST(request: NextRequest) {
  try {
    const licenseKey = await getResellerIdentifier()

    if (!licenseKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, username, reason, subscription, expiry } = body

    if (!action || !username) {
      return NextResponse.json(
        { error: 'Action and username are required' },
        { status: 400 }
      )
    }

    const keyAuth = getKeyAuthAPI()

    // Verify user belongs to this reseller before performing action
    const keysResult = await keyAuth.fetchAllLicenses()

    // Build a Set of usernames who have used this reseller's keys
    const resellerUsernames = new Set<string>()

    if (keysResult.success && keysResult.keys) {
      keysResult.keys
        .filter((key: any) => keyBelongsToReseller(key, licenseKey))
        .forEach((key: any) => {
          if (key.usedby) {
            resellerUsernames.add(key.usedby)
          }
        })
    }

    const usersResult = await keyAuth.fetchAllUsers()
    if (usersResult.success && usersResult.users) {
      const user = usersResult.users.find((u: any) => u.username === username)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Check if user belongs to this reseller using the usedby-based set
      if (!resellerUsernames.has(user.username)) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    let result

    switch (action) {
      case 'ban':
        result = await keyAuth.banUser(username, reason)
        break
      case 'unban':
        result = await keyAuth.unbanUser(username)
        break
      case 'resetHwid':
        result = await keyAuth.resetUserHWID(username)
        break
      case 'extend':
        if (!subscription || !expiry) {
          return NextResponse.json(
            { error: 'Subscription and expiry are required for extend action' },
            { status: 400 }
          )
        }
        result = await keyAuth.extendUser(username, subscription, parseInt(expiry, 10))
        break
      case 'delete':
        result = await keyAuth.deleteUser(username)
        break
      case 'getData':
        result = await keyAuth.getUserData(username)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('KeyAuth user action error:', error)
    return NextResponse.json(
      { error: 'Failed to perform user action' },
      { status: 500 }
    )
  }
}
