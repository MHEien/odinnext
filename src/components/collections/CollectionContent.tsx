'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/lib/context/CartContext'
import { useRouter} from '@/i18n/routing'
import { Product, Prisma } from '@prisma/client'

interface CollectionProduct {
  id: string
  quantity: number
  product: Product
}

interface Collection {
  id: string
  name: string
  description: string
  image: string | null
  price: Prisma.Decimal
  featured: boolean
  active: boolean
  products: CollectionProduct[]
}

interface CollectionContentProps {
  collection: Collection
  translations: {
    loading: string
    includedProducts: string
    quantity: string
    perDelivery: string
    subscription: {
      toggle: string
      savingsLabel: string
      frequency: string
      weekly: string
      biweekly: string
      monthly: string
    }
    addToCart: {
      button: string
      loading: string
      error: string
    }
  }
}

export default function CollectionContent({ collection, translations: t }: CollectionContentProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [isSubscription, setIsSubscription] = useState(true)
  const [frequency, setFrequency] = useState<'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('MONTHLY')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = () => {
    if (!collection) return
    setIsLoading(true)
    try {
      collection.products.forEach(({ product, quantity }) => {
        addItem(
          product,
          quantity,
          isSubscription,
          isSubscription ? frequency : undefined,
          collection.id
        )
      })
      router.push('/cart')
    } catch (error) {
      console.error(t.addToCart.error, error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Collection Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={collection.image || '/images/hero-bg.png'}
              alt={collection.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Collection Info */}
          <div className="space-y-8">
            <div>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-4xl font-bold text-stone-100 mb-4 font-norse"
              >
                {collection.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-stone-400"
              >
                {collection.description}
              </motion.p>
            </div>

            {/* Products in Collection */}
            <div>
              <h2 className="text-xl font-semibold text-stone-100 mb-4">{t.includedProducts}</h2>
              <div className="space-y-4">
                {collection.products.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-4 bg-stone-800/50 p-4 rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-stone-100 font-medium">{product.name}</h3>
                      <p className="text-stone-400 text-sm">
                        {t.quantity}: {quantity}
                      </p>
                    </div>
                    <div className="text-amber-500 font-medium">
                      ${Number(product.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Options */}
            <div className="bg-stone-800/50 rounded-lg p-6 border border-stone-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-semibold text-amber-500">
                    ${Number(collection.price).toFixed(2)}
                  </span>
                  <span className="text-stone-400 ml-2">{t.perDelivery}</span>
                </div>

                {isSubscription && (
                  <span className="bg-amber-900/30 text-amber-500 px-3 py-1 rounded-full">
                    {t.subscription.savingsLabel}
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Subscription Toggle */}
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-medium">{t.subscription.toggle}</label>
                  <button
                    onClick={() => setIsSubscription(!isSubscription)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isSubscription ? 'bg-amber-600' : 'bg-stone-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isSubscription ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Frequency Selector */}
                {isSubscription && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm text-stone-400">{t.subscription.frequency}</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY')}
                      className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-stone-100 
                        focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="WEEKLY">{t.subscription.weekly}</option>
                      <option value="BIWEEKLY">{t.subscription.biweekly}</option>
                      <option value="MONTHLY">{t.subscription.monthly}</option>
                    </select>
                  </motion.div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
                    hover:to-amber-600 text-white py-3 rounded-lg font-medium transition-colors 
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {t.addToCart.loading}
                    </span>
                  ) : (
                    t.addToCart.button
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 