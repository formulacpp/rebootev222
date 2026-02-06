'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

interface CountdownTimerProps {
  hours?: number
  minutes?: number
  seconds?: number
  label?: string
}

export function CountdownTimer({
  hours: initialHours = 23,
  minutes: initialMinutes = 59,
  seconds: initialSeconds = 59,
  label = 'Sale ends in:',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          // Reset to initial values for perpetual urgency
          return {
            hours: initialHours,
            minutes: initialMinutes,
            seconds: initialSeconds,
          }
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [initialHours, initialMinutes, initialSeconds])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 bg-status-danger/10 border border-status-danger/30 rounded-lg px-4 py-2"
    >
      <Clock className="w-5 h-5 text-status-danger animate-pulse" />
      <span className="text-status-danger font-medium text-sm">{label}</span>
      <div className="flex items-center gap-1 font-mono font-bold text-text-primary">
        <TimeBlock value={timeLeft.hours} />
        <span className="text-status-danger">:</span>
        <TimeBlock value={timeLeft.minutes} />
        <span className="text-status-danger">:</span>
        <TimeBlock value={timeLeft.seconds} />
      </div>
    </motion.div>
  )
}

function TimeBlock({ value }: { value: number }) {
  return (
    <span className="bg-surface-panel px-2 py-1 rounded text-sm min-w-[2rem] text-center">
      {String(value).padStart(2, '0')}
    </span>
  )
}
