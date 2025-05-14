'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'


export function HeroSection() {
  const t = useTranslations('Products.hero')
  const tProducts = useTranslations('Navigation')

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/bg-hero.png"
          alt="Viking-inspired chocolate craftsmanship"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center text-white px-4"
      >
        <h1 className="font-norse text-6xl md:text-7xl lg:text-8xl mb-6">
          {t('title')}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link
          href="/products"
          className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
            hover:to-amber-600 text-white px-8 py-4 rounded-lg font-medium transition-all hover:scale-105"
        >
          {tProducts('products')}
        </Link>
      </motion.div>
    </section>
  )
} 