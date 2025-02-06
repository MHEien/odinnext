'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function ProductHero() {
  const t = useTranslations('Products.hero')

  return (
    <div className="relative h-[40vh] overflow-hidden">
      <div className="absolute inset-0 bg-black/40 z-10" />
      <Image
        src="/globe.svg"
        alt="Viking products banner"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white mb-4 font-norse"
        >
          {t('title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-stone-200 max-w-2xl"
        >
          {t('subtitle')}
        </motion.p>
      </div>
    </div>
  )
} 