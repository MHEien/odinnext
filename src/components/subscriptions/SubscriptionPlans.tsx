'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import type { Collection, CollectionProduct, Product } from '@prisma/client'

type CollectionWithProducts = Collection & {
  products: (CollectionProduct & {
    product: Product
  })[]
}

interface SubscriptionPlansProps {
  collections: CollectionWithProducts[]
}

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

export function SubscriptionPlans({ collections }: SubscriptionPlansProps) {
  const t = useTranslations('SubscriptionPlans')

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-stone-800 to-stone-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="font-norse text-4xl text-stone-100 mb-4">{t('title')}</h2>
          <p className="text-stone-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              className={`bg-stone-800/50 rounded-lg border ${
                index === 1 
                  ? 'bg-gradient-to-b from-amber-900/50 to-stone-800/50 border-amber-600 transform hover:scale-105 relative' 
                  : 'border-stone-700 hover:border-amber-600'
              } p-8 transition-all`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm">
                    {t('mostPopular')}
                  </span>
                </div>
              )}
              <h3 className="font-norse text-2xl text-stone-100 mb-2">{collection.name}</h3>
              <p className="text-stone-400 mb-6">{collection.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-amber-500">${Number(collection.price).toFixed(2)}</span>
                <span className="text-stone-400"> {t('monthly')}</span>
              </div>
              <ul className="space-y-3 mb-8 text-stone-300">
                {collection.products.map((item) => (
                  <li key={item.id} className="flex items-start">
                    <svg className="w-6 h-6 text-amber-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item.quantity}x {item.product.name}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/collections/${collection.id}`}
                className="inline-block w-full text-center bg-gradient-to-r from-amber-600 to-amber-700 
                  hover:from-amber-500 hover:to-amber-600 text-white px-4 py-3 rounded-lg transition-colors"
              >
                {t('choosePlan')}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
} 