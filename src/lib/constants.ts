export const SITE_NAME = 'REBOOTED.LOL'
export const SITE_DESCRIPTION = 'Premium Gaming Solutions'

export const DISCORD_INVITE = 'https://discord.gg/REBOOTED'
export const STATUS_API = 'https://raw.githubusercontent.com/SunnyMonday45/Status/refs/heads/main/status.json'

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Store' },
  { href: '/status', label: 'Status' },
  { href: '/resellers', label: 'Resellers' },
] as const

export const STATS = [
  { label: 'Happy Users', value: 15000, suffix: '+' },
  { label: 'Successful Spoofs', value: 2500000, suffix: '+' },
  { label: 'Total Downloads', value: 500000, suffix: '+' },
  { label: 'Satisfaction Rate', value: 99, suffix: '%' },
] as const

export const SUPPORTED_GAMES = [
  'Fortnite',
  'Rainbow Six Siege',
  'PUBG',
  'Apex Legends',
  'Rust',
  'Call of Duty',
  'Escape from Tarkov',
  'FiveM',
  'Delta Force',
  'Dead By Daylight',
] as const

export const FEATURES = [
  {
    title: 'Undetected',
    description: 'Our solutions stay ahead of anti-cheat systems with daily updates.',
    icon: 'Shield',
  },
  {
    title: 'Instant Delivery',
    description: 'Get your license key immediately after purchase via email.',
    icon: 'Zap',
  },
  {
    title: '24/7 Support',
    description: 'Our team is available around the clock to help you.',
    icon: 'Headphones',
  },
  {
    title: 'Easy Setup',
    description: 'Simple installation process with detailed guides.',
    icon: 'Settings',
  },
  {
    title: 'Regular Updates',
    description: 'Continuous improvements and new features added regularly.',
    icon: 'RefreshCw',
  },
  {
    title: 'Secure Payment',
    description: 'Multiple payment options with encrypted transactions.',
    icon: 'CreditCard',
  },
] as const

export const FAQ_ITEMS = [
  {
    question: 'How do I receive my product?',
    answer: 'After completing your purchase, you will receive an email with your license key and download instructions within minutes.',
  },
  {
    question: 'Is it safe to use?',
    answer: 'Our products are designed with safety as the top priority. We use advanced techniques to stay undetected and provide daily updates.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, cryptocurrency (Bitcoin, Ethereum, etc.), CashApp, and more.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes! We offer refunds on weekly plans and above. Please contact our support team via Discord for assistance.',
  },
] as const
