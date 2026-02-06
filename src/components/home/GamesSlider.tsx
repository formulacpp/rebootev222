'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/animations'
import { SUPPORTED_GAMES } from '@/lib/constants'

export function GamesSlider() {
  // Duplicate the games array for seamless infinite scroll
  const duplicatedGames = [...SUPPORTED_GAMES, ...SUPPORTED_GAMES]

  return (
    <section className="py-16 bg-surface-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Supported Games
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-text-primary">
            Works With Your Favorite Games
          </h2>
        </motion.div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-bg to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-bg to-transparent z-10" />

        {/* Scrolling Content */}
        <div className="flex animate-[games-scroll_28s_linear_infinite]">
          {duplicatedGames.map((game, index) => (
            <div
              key={`${game}-${index}`}
              className="flex-shrink-0 mx-4"
            >
              <div className="px-6 py-3 bg-surface-panel border border-surface-stroke rounded-lg hover:border-primary/50 transition-colors duration-300">
                <span className="text-text-muted hover:text-text-primary transition-colors whitespace-nowrap font-medium">
                  {game}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
