export interface ProductVariant {
  id: string
  label: string
  price: number
  originalPrice?: number
  sellAuthVariantId: string
  isBestValue?: boolean
}

export interface Product {
  slug: string
  name: string
  shortDescription: string
  description: string
  images: string[]
  videoUrl?: string
  isBestSeller?: boolean
  badge?: string
  antiCheat: string
  platforms: string[]
  includesSpoofer: boolean
  variants: ProductVariant[]
  features: {
    visual?: string[]
    aimbot?: string[]
    unlock?: string[]
    misc?: string[]
  }
  requirements?: {
    os: string
    processor: string
    antiCheat: string
    gameMode: string
    spoofer: string
    platform: string
  }
  sellAuthProductId: string
}

export const products: Product[] = [
  {
    slug: 'temp-spoofer',
    name: 'Temp Spoofer',
    shortDescription: 'Premium HWID Spoofer for 14+ games',
    description: 'Industry-leading HWID Spoofer supporting 14+ games with advanced Hyper-V technology, trace removers, and TPM virtualization.',
    images: ['/images/products/hwid.webp'],
    videoUrl: 'https://www.youtube.com/embed/Ogd019onPV4',
    isBestSeller: true,
    badge: 'BEST SELLER',
    antiCheat: 'All',
    platforms: ['All'],
    includesSpoofer: true,
    sellAuthProductId: '465195',
    variants: [
      { id: 'day', label: '1 Day', price: 4.99, sellAuthVariantId: '683065' },
      { id: 'week', label: '1 Week', price: 19.99, sellAuthVariantId: '952727' },
      { id: 'month', label: '1 Month', price: 49.99, sellAuthVariantId: '952727' },
      { id: '3month', label: '3 Month', price: 99.99, originalPrice: 149.99, sellAuthVariantId: '952732', isBestValue: true },
    ],
    features: {
      misc: ['Hyper-V Technology', 'Trace Removers', 'TPM Virtualization', 'Custom Seeding System', 'Advanced Live Status', 'Serial Checker', 'Reward System', 'Multiple Language Support'],
    },
    requirements: {
      os: 'Windows 10/11',
      processor: 'Intel / AMD',
      antiCheat: 'All Anti-Cheats',
      gameMode: 'All Modes',
      spoofer: 'This IS the Spoofer',
      platform: 'All Platforms',
    },
  },
  {
    slug: 'fortnite',
    name: 'Fortnite',
    shortDescription: 'Premium Fortnite Enhancement',
    description: 'Advanced Fortnite cheat featuring aimbot, ESP, and extensive visual customization options for competitive gameplay.',
    images: ['/images/products/fortnite.webp'],
    antiCheat: 'EasyAntiCheat',
    platforms: ['PC'],
    includesSpoofer: false,
    sellAuthProductId: '',
    variants: [
      { id: 'day', label: '1 Day', price: 4.99, sellAuthVariantId: '' },
      { id: 'week', label: '1 Week', price: 19.99, sellAuthVariantId: '' },
      { id: 'month', label: '1 Month', price: 49.99, sellAuthVariantId: '', isBestValue: true },
    ],
    features: {
      visual: ['Player ESP', 'Box ESP', 'Distance ESP', 'Health ESP', 'Skeleton ESP', 'Item ESP', 'Chest ESP'],
      aimbot: ['Aimbot', 'Aim Smoothing', 'FOV Circle', 'Target Lock', 'Prediction'],
      misc: ['No Recoil', 'No Spread', 'Auto Fire'],
    },
    requirements: {
      os: 'Windows 10/11 64-bit',
      processor: 'Intel / AMD',
      antiCheat: 'EasyAntiCheat',
      gameMode: 'All Modes',
      spoofer: 'Not Included',
      platform: 'Epic Games',
    },
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getAllProductSlugs(): string[] {
  return products.map(p => p.slug)
}

// Home page pricing tiers (Temp Spoofer variants)
export const homePricingTiers = [
  {
    name: 'Daily',
    price: 4.99,
    period: 'One Day',
    perUnit: 'Less than $0.21/hour',
    features: [
      { name: 'Unlimited Usage', included: true },
      { name: 'Daily Updates', included: true },
      { name: 'Fast Support', included: true },
      { name: 'Refunds', included: false },
      { name: 'Rewards', included: false },
      { name: 'License Freeze', included: false },
      { name: 'Self HWID Reset', included: false },
    ],
    sellAuthVariantId: '',
  },
  {
    name: 'Weekly',
    price: 19.99,
    period: 'One Week',
    perUnit: 'Less than $3.00/day',
    features: [
      { name: 'Unlimited Usage', included: true },
      { name: 'Daily Updates', included: true },
      { name: 'Fast Support', included: true },
      { name: 'Refunds', included: true },
      { name: 'Rewards', included: true },
      { name: 'License Freeze', included: false },
      { name: 'Self HWID Reset', included: false },
    ],
    sellAuthVariantId: '',
  },
  {
    name: 'Monthly',
    price: 49.99,
    period: 'One Month',
    perUnit: 'Less than $12.00/week',
    features: [
      { name: 'Unlimited Usage', included: true },
      { name: 'Daily Updates', included: true },
      { name: 'Fast Support', included: true },
      { name: 'Refunds', included: true },
      { name: 'Rewards', included: true },
      { name: 'License Freeze', included: true },
      { name: 'Self HWID Reset', included: false },
    ],
    sellAuthVariantId: '',
  },
  {
    name: '90-Day',
    price: 99.99,
    originalPrice: 149.99,
    period: 'Three Months',
    perUnit: 'Less than $1.25/day',
    badge: 'BEST SELLER',
    discount: '50% OFF',
    features: [
      { name: 'Unlimited Usage', included: true },
      { name: 'Daily Updates', included: true },
      { name: 'Fast Support', included: true },
      { name: 'Refunds', included: true },
      { name: 'Rewards', included: true },
      { name: 'License Freeze', included: true },
      { name: 'Self HWID Reset', included: true },
    ],
    sellAuthVariantId: '',
    highlighted: true,
  },
]
