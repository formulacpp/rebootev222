// KeyAuth API Wrapper
// Documentation: https://keyauth.readme.io/reference/

const KEYAUTH_SELLER_API = 'https://keyauth.win/api/seller/'
const KEYAUTH_APP_API = 'https://keyauth.win/api/1.2/'

interface KeyAuthConfig {
  sellerKey: string
  appName?: string
  ownerId?: string
  appSecret?: string
}

interface KeyAuthAppConfig {
  name: string
  ownerId: string
  secret: string
}

interface KeyAuthResponse {
  success: boolean
  message: string
  [key: string]: any
}

interface LicenseKey {
  key: string
  note?: string
  expires?: string
  status?: string
  level?: number
  genby?: string
  gendate?: string
  usedon?: string
  usedby?: string
  used?: boolean
}

interface User {
  username: string
  subscriptions?: any[]
  ip?: string
  hwid?: string
  createdate?: string
  lastlogin?: string
  banned?: string
}

export class KeyAuthAPI {
  private sellerKey: string
  private appName?: string
  private ownerId?: string
  private appSecret?: string
  private sessionId?: string

  constructor(config: KeyAuthConfig) {
    this.sellerKey = config.sellerKey
    this.appName = config.appName
    this.ownerId = config.ownerId
    this.appSecret = config.appSecret
  }

  private async sellerRequest(params: Record<string, string | number>): Promise<KeyAuthResponse> {
    const url = new URL(KEYAUTH_SELLER_API)
    url.searchParams.append('sellerkey', this.sellerKey)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
    url.searchParams.append('format', 'json')

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`KeyAuth API error: ${response.status}`)
    }

    return response.json()
  }

  private async appRequest(params: Record<string, string>): Promise<KeyAuthResponse> {
    if (!this.appName || !this.ownerId) {
      throw new Error('App credentials not configured')
    }

    const formData = new URLSearchParams()
    formData.append('type', params.type)
    formData.append('name', this.appName)
    formData.append('ownerid', this.ownerId)

    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'type') {
        formData.append(key, value)
      }
    })

    if (this.sessionId) {
      formData.append('sessionid', this.sessionId)
    }

    const response = await fetch(KEYAUTH_APP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error(`KeyAuth API error: ${response.status}`)
    }

    return response.json()
  }

  // Initialize app session (required before login)
  async initApp(): Promise<KeyAuthResponse> {
    const result = await this.appRequest({
      type: 'init',
      ver: '1.0',
      hash: '', // Empty hash for web apps
    })

    if (result.success && result.sessionid) {
      this.sessionId = result.sessionid
    }

    return result
  }

  // Login with username/password (for users/resellers)
  async loginUser(username: string, password: string): Promise<KeyAuthResponse> {
    if (!this.sessionId) {
      const initResult = await this.initApp()
      if (!initResult.success) {
        return initResult
      }
    }

    return this.appRequest({
      type: 'login',
      username,
      pass: password,
    })
  }

  // Register a new user with license key
  async registerUser(username: string, password: string, licenseKey: string): Promise<KeyAuthResponse> {
    if (!this.sessionId) {
      const initResult = await this.initApp()
      if (!initResult.success) {
        return initResult
      }
    }

    return this.appRequest({
      type: 'register',
      username,
      pass: password,
      key: licenseKey,
    })
  }

  // Get user data after login
  async getUserData(): Promise<KeyAuthResponse> {
    if (!this.sessionId) {
      throw new Error('Not initialized')
    }

    return this.appRequest({
      type: 'fetchuserdata',
    })
  }

  // Alias for backward compatibility
  private async request(params: Record<string, string | number>): Promise<KeyAuthResponse> {
    return this.sellerRequest(params)
  }

  // ==================== License Management ====================

  async createLicense(params: {
    expiry: number // Days until expiration
    mask?: string // License format mask
    level?: number // Subscription level
    amount?: number // Number of keys to generate
    note?: string // Optional note
    character?: number // 1 = uppercase, 2 = lowercase
  }): Promise<KeyAuthResponse> {
    return this.request({
      type: 'add',
      expiry: params.expiry,
      mask: params.mask || '******-******-******-******',
      level: params.level || 1,
      amount: params.amount || 1,
      character: params.character || 2, // Default to uppercase
      ...(params.note && { note: params.note }),
    })
  }

  async deleteLicense(key: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'del',
      key,
    })
  }

  async deleteAllLicenses(): Promise<KeyAuthResponse> {
    return this.request({
      type: 'delall',
    })
  }

  async deleteUnusedLicenses(): Promise<KeyAuthResponse> {
    return this.request({
      type: 'delunused',
    })
  }

  async deleteUsedLicenses(): Promise<KeyAuthResponse> {
    return this.request({
      type: 'delused',
    })
  }

  async verifyLicense(key: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'verify',
      key,
    })
  }

  async fetchAllLicenses(): Promise<KeyAuthResponse & { keys?: LicenseKey[] }> {
    return this.request({
      type: 'fetchallkeys',
    })
  }

  async getLicenseInfo(key: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'info',
      key,
    })
  }

  async setKeyNote(key: string, note: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'setnote',
      key,
      note,
    })
  }

  // ==================== User Management ====================

  async fetchAllUsers(): Promise<KeyAuthResponse & { users?: User[] }> {
    return this.request({
      type: 'fetchallusers',
    })
  }

  async getUserData(username: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'userdata',
      user: username,
    })
  }

  async deleteUser(username: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'deluser',
      user: username,
    })
  }

  async deleteExpiredUsers(): Promise<KeyAuthResponse> {
    return this.request({
      type: 'delexpusers',
    })
  }

  async banUser(username: string, reason?: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'ban',
      user: username,
      ...(reason && { reason }),
    })
  }

  async unbanUser(username: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'unban',
      user: username,
    })
  }

  async resetUserHWID(username: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'resetuser',
      user: username,
    })
  }

  async setUserVariable(username: string, varName: string, varData: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'setvar',
      user: username,
      var: varName,
      data: varData,
    })
  }

  async getUserVariable(username: string, varName: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'getvar',
      user: username,
      var: varName,
    })
  }

  async extendUser(username: string, subscription: string, expiry: number): Promise<KeyAuthResponse> {
    return this.request({
      type: 'extend',
      user: username,
      sub: subscription,
      expiry,
    })
  }

  async subtractUserTime(username: string, subscription: string, seconds: number): Promise<KeyAuthResponse> {
    return this.request({
      type: 'subtract',
      user: username,
      sub: subscription,
      seconds,
    })
  }

  // ==================== Reseller Management ====================

  async createReseller(username: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'addreseller',
      user: username,
    })
  }

  async verifyReseller(username: string): Promise<KeyAuthResponse> {
    return this.request({
      type: 'verifyreseller',
      user: username,
    })
  }

  // ==================== Application Stats ====================

  async getStats(): Promise<KeyAuthResponse> {
    return this.request({
      type: 'stats',
    })
  }
}

// Create singleton instance
let keyAuthInstance: KeyAuthAPI | null = null

export function getKeyAuthAPI(): KeyAuthAPI {
  if (!keyAuthInstance) {
    const sellerKey = process.env.KEYAUTH_SELLER_KEY
    const appName = process.env.KEYAUTH_NAME
    const ownerId = process.env.KEYAUTH_OWNER_ID
    const appSecret = process.env.KEYAUTH_SECRET

    if (!sellerKey) {
      throw new Error('KEYAUTH_SELLER_KEY environment variable is not set')
    }

    keyAuthInstance = new KeyAuthAPI({
      sellerKey,
      appName,
      ownerId,
      appSecret,
    })
  }

  return keyAuthInstance
}

// Create a fresh instance for login (needs separate session)
export function createKeyAuthInstance(): KeyAuthAPI {
  const sellerKey = process.env.KEYAUTH_SELLER_KEY
  const appName = process.env.KEYAUTH_NAME
  const ownerId = process.env.KEYAUTH_OWNER_ID
  const appSecret = process.env.KEYAUTH_SECRET

  if (!sellerKey) {
    throw new Error('KEYAUTH_SELLER_KEY environment variable is not set')
  }

  return new KeyAuthAPI({
    sellerKey,
    appName,
    ownerId,
    appSecret,
  })
}
