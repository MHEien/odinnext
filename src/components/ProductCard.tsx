'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import type { Product } from '@prisma/client'
import { formatCurrency } from '@/lib/utils/shared-format'

type SerializedProduct = Omit<Product, 'price'> & {
  price: number
}

interface ProductCardProps {
  product: SerializedProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('Products')

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-stone-900 rounded-lg overflow-hidden border border-stone-700 hover:border-amber-600 transition-colors"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-stone-100 mb-2">
          {product.name}
        </h3>
        <p className="text-stone-400 line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-500">
            {formatCurrency(product.price)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              product.stock > 0
                ? 'bg-green-900 text-green-200'
                : 'bg-red-900 text-red-200'
            }`}
          >
            {product.stock > 0 ? `${product.stock} ${t('price')}` : t('outOfStock')}
          </span>
        </div>
      </div>
    </Link>
  )
} 