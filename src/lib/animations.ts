import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 0.61, 0.36, 1]
    },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

export const fadeLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1]
    },
  },
}

export const fadeRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1]
    },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    },
  },
}

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    },
  },
}

export const scaleOnHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  tap: { scale: 0.98 },
}

export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
  },
  hover: {
    y: -8,
    boxShadow: '0 22px 48px rgba(0,0,0,0.42)',
    transition: { duration: 0.3 },
  },
}

export const glowPulse: Variants = {
  initial: {
    boxShadow: '0 0 20px rgba(220, 123, 57, 0.3)'
  },
  animate: {
    boxShadow: [
      '0 0 20px rgba(220, 123, 57, 0.3)',
      '0 0 40px rgba(220, 123, 57, 0.6)',
      '0 0 20px rgba(220, 123, 57, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    },
  },
}

export const slideUp: Variants = {
  hidden: {
    y: 100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 0.61, 0.36, 1]
    },
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-12, 0, -12],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const pulseScale: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
