'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Product } from '@prisma/client'
import AddToCartButton from '@/app/[locale]/(shop)/products/[id]/AddToCartButton'
import { useState } from 'react'

type NutritionalInfo = {
  [key: string]: string | number
}

type SerializedProduct = Omit<Product, 'price'> & {
  price: number
  nutritionalInfo: NutritionalInfo
}

interface Props {
  product: SerializedProduct
}

export default function ProductDetail({ product }: Props) {
  const t = useTranslations('Products')
  const [mainImgError, setMainImgError] = useState(false)
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<number, boolean>>({})

  // Validate image URL format
  const isValidImageUrl = (url: string) => {
    return url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'))
  }

  // Make sure we have valid images
  const mainImage = product.images && product.images.length > 0 && isValidImageUrl(product.images[0]) 
    ? product.images[0] 
    : '/placeholder-image.jpg'

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Product Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Main Product Image */}
          <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden border border-stone-700 shadow-lg shadow-amber-900/20">
            {!mainImgError ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                onError={() => setMainImgError(true)}
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-800">
                <span className="text-stone-500">Image not available</span>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative w-full h-24 md:h-32 rounded-lg overflow-hidden border border-stone-700 shadow-lg shadow-amber-900/20"
                >
                  {!thumbnailErrors[index] && isValidImageUrl(image) ? (
                    <Image
                      src={image}
                      alt={`${product.name} ${t('productView')} ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 25vw, 15vw"
                      onError={() => setThumbnailErrors(prev => ({ ...prev, [index]: true }))}
                      unoptimized={process.env.NODE_ENV === 'development'}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-800">
                      <span className="text-xs text-stone-500">No image</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h1 className="text-5xl font-bold text-stone-100 mb-4 font-norse tracking-wide">
            {product.name}
          </h1>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-4xl font-bold text-amber-500">
              {product.price.toFixed(2)} {t('currency')}
            </span>

            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              product.stock > 0 ? 'bg-green-900/60 text-green-200' : 'bg-red-900/60 text-red-200'
            }`}>
              {product.stock > 0 ? `${product.stock} ${t('inStock')}` : t('outOfStock')}
            </span>
          </div>

          <div className="prose prose-invert mb-8">
            <p className="text-stone-300 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Add to Cart Section */}
          <div className="mt-auto">
            <AddToCartButton
              productId={product.id}
              stock={product.stock}
            />
          </div>
        </motion.div>
      </div>

      {/* Detailed Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-t border-stone-700 pt-12 grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-stone-800/30 p-6 rounded-lg border border-stone-700">
            <h2 className="text-2xl font-norse font-bold text-stone-100 mb-4">
              {t('detailedDescription')}
            </h2>
            <p className="text-stone-300 leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          <div className="bg-stone-800/30 p-6 rounded-lg border border-stone-700">
            <h2 className="text-2xl font-norse font-bold text-stone-100 mb-4">
              {t('ingredients')}
            </h2>
            <ul className="grid grid-cols-2 gap-2">
              {product.ingredients && product.ingredients.map((ingredient, index) => (
                <li key={index} className="text-stone-300 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-stone-800/30 p-6 rounded-lg border border-stone-700">
            <h2 className="text-2xl font-norse font-bold text-stone-100 mb-4">
              {t('nutritionalInfo')}
            </h2>
            <dl className="grid grid-cols-2 gap-4">
              {product.nutritionalInfo && Object.entries(product.nutritionalInfo).map(([key, value]) => (
                <div key={key} className="bg-stone-800/50 p-3 rounded-md">
                  <dt className="text-stone-400 text-sm">{key}</dt>
                  <dd className="text-stone-200 font-medium">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-stone-800/30 p-6 rounded-lg border border-stone-700">
            <h2 className="text-2xl font-norse font-bold text-stone-100 mb-4">
              {t('productDetails')}
            </h2>
            <dl className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-800/50 p-3 rounded-md">
                  <dt className="text-stone-400 text-sm">{t('weight')}</dt>
                  <dd className="text-stone-200 font-medium">{product.weight}g</dd>
                </div>
                <div className="bg-stone-800/50 p-3 rounded-md">
                  <dt className="text-stone-400 text-sm">{t('sku')}</dt>
                  <dd className="text-stone-200 font-medium">{product.id.slice(0, 8).toUpperCase()}</dd>
                </div>
              </div>
              
              {product.allergens && product.allergens.length > 0 && (
                <div className="bg-stone-800/50 p-3 rounded-md">
                  <dt className="text-stone-400 text-sm mb-2">{t('allergens')}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-900/40 text-red-200 rounded-md text-sm"
                      >
                        {allergen}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </motion.div>
    </div>
  )
}