'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import type { ProductWithStats } from '@/lib/db/actions/products'

interface ProductListProps {
  products: ProductWithStats[]
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
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function ProductList({ products }: ProductListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {products.map((product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm p-6 border border-stone-200"
        >
          <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-sm text-stone-600 mt-1">
                {product.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {new Intl.NumberFormat('no-NO', {
                  style: 'currency',
                  currency: 'NOK'
                }).format(Number(product.price))}
              </p>
              <p className="text-sm text-stone-500 mt-1">
                {product.stock} in stock
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-600">
                {product.totalOrders} orders
              </span>
              <span className="text-sm text-stone-600">·</span>
              <span className="text-sm text-stone-600">
                {new Intl.NumberFormat('no-NO', {
                  style: 'currency',
                  currency: 'NOK'
                }).format(product.totalRevenue)} revenue
              </span>
            </div>
            <Link
              href={`/admin/products/${product.id}`}
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              View Details →
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 