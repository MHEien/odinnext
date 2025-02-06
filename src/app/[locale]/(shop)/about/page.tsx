'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function AboutPage() {
  const t = useTranslations('About')

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

        {/* Mission */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24"
        >
          <motion.div variants={itemVariants} className="relative h-96">
            <Image
              src="/images/crafting.jpg"
              alt="Artisanal chocolate crafting"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent rounded-lg" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <h2 className="font-norse text-3xl text-stone-100 mb-6">
              {t('mission.title')}
            </h2>
            <p className="text-stone-400 mb-6">
              {t('mission.description1')}
            </p>
            <p className="text-stone-400">
              {t('mission.description2')}
            </p>
          </motion.div>
        </motion.div>

        {/* Values */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-stone-800/50 rounded-2xl border border-stone-700 p-12 mb-24"
        >
          <motion.h2 variants={itemVariants} className="font-norse text-3xl text-stone-100 text-center mb-12">
            {t('values.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="font-norse text-xl text-stone-100 mb-2">{t('values.honor.title')}</h3>
              <p className="text-stone-400">
                {t('values.honor.description')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 className="font-norse text-xl text-stone-100 mb-2">{t('values.harmony.title')}</h3>
              <p className="text-stone-400">
                {t('values.harmony.description')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="w-16 h-16 bg-amber-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <h3 className="font-norse text-xl text-stone-100 mb-2">{t('values.knowledge.title')}</h3>
              <p className="text-stone-400">
                {t('values.knowledge.description')}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 variants={itemVariants} className="font-norse text-3xl text-stone-100 mb-12">
            {t('team.title')}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/team/master-craftsman.jpg"
                  alt="Master Chocolatier"
                  fill
                  className="object-cover rounded-full border-2 border-amber-600"
                />
              </div>
              <h3 className="font-norse text-xl text-stone-100 mb-1">
                Martin Henriksen
              </h3>
              <p className="text-amber-500">{t('team.roles.masterChocolatier')}</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/team/artisan.jpg"
                  alt="Lead Artisan"
                  fill
                  className="object-cover rounded-full border-2 border-amber-600"
                />
              </div>
              <h3 className="font-norse text-xl text-stone-100 mb-1">
                Kristoffer Klausen
              </h3>
              <p className="text-amber-500">{t('team.roles.leadArtisan')}</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src="/images/team/flavor-master.jpg"
                  alt="Flavor Master"
                  fill
                  className="object-cover rounded-full border-2 border-amber-600"
                />
              </div>
              <h3 className="font-norse text-xl text-stone-100 mb-1">
                Thor Bjarne Henriksen
              </h3>
              <p className="text-amber-500">{t('team.roles.flavorMaster')}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 