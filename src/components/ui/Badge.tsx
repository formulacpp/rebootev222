import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'gold'
  size?: 'sm' | 'md'
  pulse?: boolean
}

const variants = {
  default: 'bg-surface-elevated text-text-muted border-surface-stroke',
  primary: 'bg-primary/20 text-primary border-primary/30',
  success: 'bg-status-ok/20 text-status-ok border-status-ok/30',
  warning: 'bg-status-warn/20 text-status-warn border-status-warn/30',
  danger: 'bg-status-danger/20 text-status-danger border-status-danger/30',
  gold: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded-full border',
        variants[variant],
        sizes[size],
        pulse && 'animate-pulse',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
