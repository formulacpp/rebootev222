'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cardHover } from '@/lib/animations'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
  gradient?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, glow = false, gradient = false, children, ...props }, ref) => {
    const Component = hover ? motion.div : 'div'
    const motionProps = hover
      ? {
          variants: cardHover,
          initial: 'initial',
          whileHover: 'hover',
        }
      : {}

    return (
      <Component
        ref={ref}
        className={cn(
          'bg-surface-panel rounded-xl border border-surface-stroke',
          'transition-all duration-300',
          glow && 'shadow-lg shadow-primary/10',
          gradient && 'gradient-border',
          className
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-0', className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}
