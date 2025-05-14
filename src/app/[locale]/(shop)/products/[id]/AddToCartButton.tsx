'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useCart } from '@/lib/context/CartContext'
import { getProduct } from '@/lib/db/actions/products'
import { Product } from '@prisma/client'

interface Props {
  productId: string
  stock: number
}

export default function AddToCartButton({ productId, stock }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addItem } = useCart()
  const t = useTranslations('Products')

  const handleAddToCart = async () => {
    if (isAdding) return

    setIsAdding(true)
    try {
      const product = await getProduct(productId)
      if (!product) throw new Error('Product not found')
      
      // Convert the ProductWithStats to expected Product type
      const productForCart = {
        ...product,
        price: product.price // price is already a number in ProductWithStats
      }
      
      addItem(productForCart as unknown as Product, quantity)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  if (stock === 0) {
    return (
      <button
        disabled
        className="w-full bg-stone-800 text-stone-400 py-4 rounded-lg font-medium cursor-not-allowed"
      >
        {t('outOfStock')}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between bg-stone-800/50 rounded-lg p-2">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-amber-500 transition-colors"
          aria-label={t('decreaseQuantity')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        </button>
        <motion.span
          key={quantity}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-medium text-stone-100"
        >
          {quantity}
        </motion.span>
        <button
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-amber-500 transition-colors"
          aria-label={t('increaseQuantity')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Add to Cart Button */}
      <div className="relative">
        <motion.button
          onClick={handleAddToCart}
          disabled={isAdding}
          whileTap={{ scale: 0.95 }}
          className={`w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 
            text-white py-4 rounded-lg font-medium transition-colors relative overflow-hidden
            ${isAdding ? 'cursor-not-allowed opacity-80' : ''}`}
        >
          <AnimatePresence>
            {isAdding ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.span
                key="text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {t('addToCart')}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-x-0 -bottom-12 flex justify-center"
            >
              <span className="text-green-500 bg-green-900/20 px-4 py-2 rounded-lg">
                {t('addToCartSuccess')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 