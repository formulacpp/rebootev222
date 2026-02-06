import { Shield, Lock, Zap, Headphones } from 'lucide-react'

const badges = [
  { icon: Shield, label: 'Undetected' },
  { icon: Lock, label: 'Secure Payment' },
  { icon: Zap, label: 'Instant Delivery' },
  { icon: Headphones, label: '24/7 Support' },
]

export function TrustBadges({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-6 ${className}`}>
      {badges.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 text-text-muted text-sm"
        >
          <Icon className="w-4 h-4 text-status-ok" />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
