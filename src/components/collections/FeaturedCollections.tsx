'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import type { Collection, CollectionProduct, Product } from '@prisma/client'

type CollectionWithProducts = Collection & {
  products: (CollectionProduct & {
    product: Product
  })[]
}

interface FeaturedCollectionsProps {
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

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  const t = useTranslations('FeaturedCollections')

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-stone-900 to-stone-800">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {collections.map((collection) => (
            <motion.div
              key={collection.id}
              variants={itemVariants}
              className="bg-stone-800/50 rounded-lg overflow-hidden border border-stone-700 
                hover:border-amber-600 transition-all hover:scale-105"
            >
              <div className="aspect-square relative">
                <Image
                  src={collection.image || '/images/hero-bg.png'}
                  alt={collection.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-norse text-2xl text-stone-100 mb-2">{collection.name}</h3>
                <p className="text-stone-400 mb-4">
                  {collection.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-amber-500 text-lg font-medium">
                      ${Number(collection.price).toFixed(2)}
                    </span>
                    <span className="text-stone-400 text-sm ml-2">{t('perDelivery')}</span>
                  </div>
                  <span className="bg-amber-900/30 text-amber-500 px-3 py-1 rounded-full text-sm">
                    {t('saveWithSubscription')}
                  </span>
                </div>
                <Link 
                  href={`/collections/${collection.id}`}
                  className="inline-block w-full text-center bg-gradient-to-r from-amber-600 to-amber-700 
                    hover:from-amber-500 hover:to-amber-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  {t('exploreCollection')}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
} 