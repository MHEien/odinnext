'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function CallToAction() {
  const t = useTranslations('CallToAction')

  return (
    <section className="py-20 px-4 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <motion.h2
          variants={itemVariants}
          className="font-norse text-4xl text-white mb-6"
        >
          {t('title')}
        </motion.h2>
        <motion.p variants={itemVariants} className="text-xl text-stone-300 mb-8">
          {t('description')}
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
              hover:to-amber-600 text-white px-8 py-4 rounded-lg transition-all hover:scale-105"
          >
            {t('exploreProducts')}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
} 