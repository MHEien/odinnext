'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useToast } from '@/lib/hooks/useToast';
import { SubscriptionFrequency } from '@/app/lib/mock/subscriptions';
import { addToCart } from '@/app/lib/mock/cart';

type PurchaseMode = 'one-time' | 'subscription';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [quantity, setQuantity] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('one-time');
  const [frequency, setFrequency] = useState<SubscriptionFrequency>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToast();

  // Mock product data - in real app, fetch from API
  const product = {
    id: params.id,
    name: "Thor's Thunder Chocolate",
    description: 'A powerful dark chocolate infused with sea salt and popping candy.',
    longDescription: `Experience the might of Thor in every bite with this premium dark chocolate bar. 
    The combination of crunchy sea salt and explosive popping candy creates a thunderous sensation that 
    would make the God of Thunder himself proud. Made with 70% cocoa sourced from the finest beans.`,
    price: 29.99,
    image: '/products/chocolate-1.jpg',
    ingredients: ['Dark Chocolate', 'Sea Salt', 'Popping Candy'],
    allergens: ['May contain milk', 'Contains soy'],
    weight: '100g',
    nutritionalInfo: {
      servingSize: '25g',
      calories: 135,
      fat: 9,
      carbs: 12,
      protein: 2,
    },
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart({
        productId: product.id,
        quantity,
        price: product.price,
        isSubscription: purchaseMode === 'subscription',
        ...(purchaseMode === 'subscription' && { frequency }),
      });
      
      if (purchaseMode === 'subscription') {
        showToast.success('Subscription added to cart');
      } else {
        showToast.success('Added to cart');
      }
    } catch (err: unknown) {
      console.error('Failed to add to cart:', err);
      showToast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = () => {
    let basePrice = product.price * quantity;
    if (purchaseMode === 'subscription') {
      // 10% discount for subscriptions
      basePrice = basePrice * 0.9;
    }
    return basePrice.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h1 className="font-display text-4xl text-stone-900">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-stone-600">
                {product.description}
              </p>
            </div>

            {/* Purchase Options */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-stone-900">
                  Purchase Options
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPurchaseMode('one-time')}
                    className={`px-4 py-3 rounded-lg text-center font-medium transition-colors ${
                      purchaseMode === 'one-time'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    One-time Purchase
                  </button>
                  <button
                    onClick={() => setPurchaseMode('subscription')}
                    className={`px-4 py-3 rounded-lg text-center font-medium transition-colors ${
                      purchaseMode === 'subscription'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Subscribe & Save 10%
                  </button>
                </div>
              </div>

              {purchaseMode === 'subscription' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700">
                    Delivery Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) =>
                      setFrequency(e.target.value as SubscriptionFrequency)
                    }
                    className="mt-2 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Every 2 Weeks</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700">
                  Quantity
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 rounded-lg bg-white text-stone-600 hover:bg-stone-50"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="text-lg font-medium text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 rounded-lg bg-white text-stone-600 hover:bg-stone-50"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-2xl font-medium text-stone-900">
                    ${calculatePrice()}
                  </p>
                  {purchaseMode === 'subscription' && (
                    <p className="text-sm text-stone-500">
                      10% subscription discount applied
                    </p>
                  )}
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5"
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
                      <span>Adding...</span>
                    </span>
                  ) : purchaseMode === 'subscription' ? (
                    'Subscribe Now'
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-stone-200 pt-8 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-stone-900">Description</h2>
                <p className="mt-4 text-stone-600">{product.longDescription}</p>
              </div>

              <div>
                <h2 className="text-lg font-medium text-stone-900">Ingredients</h2>
                <ul className="mt-4 list-disc list-inside text-stone-600">
                  {product.ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-medium text-stone-900">Allergens</h2>
                <ul className="mt-4 list-disc list-inside text-stone-600">
                  {product.allergens.map((allergen) => (
                    <li key={allergen}>{allergen}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-medium text-stone-900">
                  Nutritional Information
                </h2>
                <div className="mt-4 bg-white rounded-lg p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-stone-600">
                      Serving Size: {product.nutritionalInfo.servingSize}
                    </p>
                    <p className="text-sm text-stone-600">
                      Calories: {product.nutritionalInfo.calories}
                    </p>
                    <p className="text-sm text-stone-600">
                      Fat: {product.nutritionalInfo.fat}g
                    </p>
                    <p className="text-sm text-stone-600">
                      Carbohydrates: {product.nutritionalInfo.carbs}g
                    </p>
                    <p className="text-sm text-stone-600">
                      Protein: {product.nutritionalInfo.protein}g
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 