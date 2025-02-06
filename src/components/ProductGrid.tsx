'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import ProductCard from './ProductCard'
import type { Product } from '@prisma/client'

type SerializedProduct = Omit<Product, 'price'> & {
  price: number
}

interface ProductGridProps {
  products: SerializedProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const t = useTranslations('Products.grid')

  if (!products.length) {
    return (
      <div className="text-center py-12 text-stone-300">
        {t('noProducts')}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  )
} 