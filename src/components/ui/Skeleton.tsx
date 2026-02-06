import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'text'
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-elevated',
        variant === 'circular' && 'rounded-full',
        variant === 'text' && 'rounded h-4',
        variant === 'default' && 'rounded-lg',
        className
      )}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface-panel rounded-xl border border-surface-stroke p-6 space-y-4">
      <Skeleton className="h-48 w-full" />
      <Skeleton variant="text" className="w-3/4" />
      <Skeleton variant="text" className="w-1/2" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}
