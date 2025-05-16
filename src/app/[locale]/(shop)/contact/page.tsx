'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/ui/Map'), { ssr: false })

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
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

const formFieldVariants = {
  focus: { scale: 1.02, transition: { duration: 0.2 } }
}

// Oslo coordinates
const STORE_LOCATION: [number, number] = [59.52960856188844, 10.088339142547518]

export default function ContactPage() {
  const t = useTranslations('Contact')
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('sending')
    
    // TODO: Implement form submission logic
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setFormStatus('success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h1 variants={itemVariants} className="font-norse text-5xl md:text-6xl text-stone-100 mb-6">
            {t('hero.title')}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-stone-400 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Contact Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-stone-800/50 rounded-2xl border border-stone-700 p-8"
          >
            <motion.h2 variants={itemVariants} className="font-norse text-3xl text-stone-100 mb-8">
              {t('form.title')}
            </motion.h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-2">
                  {t('form.name')}
                </label>
                <motion.input
                  whileFocus="focus"
                  variants={formFieldVariants}
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-stone-700/50 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-100"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                  {t('form.email')}
                </label>
                <motion.input
                  whileFocus="focus"
                  variants={formFieldVariants}
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-stone-700/50 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-100"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block text-sm font-medium text-stone-300 mb-2">
                  {t('form.message')}
                </label>
                <motion.textarea
                  whileFocus="focus"
                  variants={formFieldVariants}
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-stone-700/50 border border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-100 resize-none"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-stone-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {formStatus === 'sending' ? t('form.sending') : t('form.submit')}
                </button>
                {formStatus === 'success' && (
                  <p className="mt-4 text-green-400 text-center">{t('form.success')}</p>
                )}
                {formStatus === 'error' && (
                  <p className="mt-4 text-red-400 text-center">{t('form.error')}</p>
                )}
              </motion.div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Map */}
            <motion.div variants={itemVariants} className="relative h-64 rounded-2xl overflow-hidden">
              <Map center={STORE_LOCATION} zoom={15} className="z-0" />
            </motion.div>

            {/* Contact Details */}
            <motion.div variants={itemVariants} className="bg-stone-800/50 rounded-2xl border border-stone-700 p-8">
              <h3 className="font-norse text-2xl text-stone-100 mb-6">{t('info.title')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-stone-300">{t('info.address')}</p>
                    <p className="text-stone-400">Thorshaugveien 1, 3090 Hof, Norway</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-stone-300">{t('info.email')}</p>
                    <p className="text-stone-400">martin@odinchocolate.no</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-stone-300">{t('info.phone')}</p>
                    <p className="text-stone-400">+47 983 62 072</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div variants={itemVariants} className="bg-stone-800/50 rounded-2xl border border-stone-700 p-8">
              <h3 className="font-norse text-2xl text-stone-100 mb-6">{t('hours.title')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-400">{t('hours.weekdays')}</span>
                  <span className="text-stone-300">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{t('hours.saturday')}</span>
                  <span className="text-stone-300">{t('hours.closed')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">{t('hours.sunday')}</span>
                  <span className="text-stone-300">{t('hours.closed')}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 