'use client';

import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing'
import { useCart } from '@/lib/context/CartContext';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const { state: { items, total }, removeItem, updateQuantity, updateSubscription } = useCart();
  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState<'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'>('MONTHLY');
  const t = useTranslations('Cart');

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleSubscriptionChange = (newIsSubscription: boolean) => {
    setIsSubscription(newIsSubscription);
    items.forEach(item => {
      updateSubscription(item.id, newIsSubscription, newIsSubscription ? frequency : undefined);
    });
  };

  const handleFrequencyChange = (newFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY') => {
    setFrequency(newFrequency);
    if (isSubscription) {
      items.forEach(item => {
        updateSubscription(item.id, true, newFrequency);
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const body = {
        products: items.map(item => ({
          id: item.productId,
          price: item.price,
          quantity: item.quantity
        })),
        isSubscription,
        frequency: isSubscription ? frequency : undefined,
      }
      console.log("Sending checkout request with body:", body);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        throw new Error('Checkout request failed');
      }
      
      const data = await response.json();
      console.log("Checkout response:", data);
      
      // Handle various response formats from Vipps API
      if (data.data?.checkoutFrontendUrl) {
        // Format: { data: { checkoutFrontendUrl, token } }
        const redirectUrl = data.data.token 
          ? `${data.data.checkoutFrontendUrl}?token=${data.data.token}`
          : data.data.checkoutFrontendUrl;
        window.location.href = redirectUrl;
        return;
      } else if (data.checkoutFrontendUrl) {
        // Format: { checkoutFrontendUrl, token }
        const redirectUrl = data.token 
          ? `${data.checkoutFrontendUrl}?token=${data.token}`
          : data.checkoutFrontendUrl;
        window.location.href = redirectUrl;
        return;
      } else if (data.url) {
        // Legacy format with direct URL
        window.location.href = data.url;
        return;
      } else if (data.redirectUrl) {
        // Another possible format
        window.location.href = data.redirectUrl;
        return;
      }
      
      console.error('Unknown checkout response format:', data);
      throw new Error('Invalid checkout response format');
    } catch (error) {
      console.error('Checkout error:', error);
      alert(t('checkoutError'));
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-stone-100 mb-8 font-norse"
          >
            {t('empty')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-400 mb-8"
          >
            {t('emptyMessage')}
          </motion.p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 
              text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {t('exploreProducts')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-stone-100 mb-12 font-norse"
        >
          {t('title')}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-8"
          >
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={itemVariant}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-stone-800/50 rounded-lg p-4 mb-4 border border-stone-700"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-medium text-stone-100">
                        {item.name}
                      </h3>
                      <p className="text-amber-500 font-medium">
                        {item.price.toFixed(2)}  kr
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-amber-500 
                            transition-colors bg-stone-800 rounded-md"
                        >
                          -
                        </button>
                        <span className="text-stone-100 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-amber-500 
                            transition-colors bg-stone-800 rounded-md"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-stone-800/50 rounded-lg p-6 border border-stone-700 sticky top-4">
              <h2 className="text-xl font-semibold text-stone-100 mb-4">
                {t('orderSummary')}
              </h2>

              {/* Subscription Toggle */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-medium">{t('subscription.toggle')}</label>
                  <button
                    onClick={() => handleSubscriptionChange(!isSubscription)}
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
                    <label className="block text-sm text-stone-400">{t('subscription.frequency')}</label>
                    <select
                      value={frequency}
                      onChange={(e) => handleFrequencyChange(e.target.value as 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY')}
                      className="w-full bg-stone-700 border border-stone-600 rounded-lg px-3 py-2 text-stone-100 
                        focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="WEEKLY">{t('subscription.weekly')}</option>
                      <option value="BIWEEKLY">{t('subscription.biweekly')}</option>
                      <option value="MONTHLY">{t('subscription.monthly')}</option>
                    </select>
                  </motion.div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-stone-300">
                  <span>{t('summary.subtotal')}</span>
                  <span>{(total / (isSubscription ? 0.9 : 1)).toFixed(2)}  kr</span>
                </div>
                {isSubscription && (
                  <div className="flex justify-between text-amber-500">
                    <span>{t('summary.discount')}</span>
                    <span>-{((total / 0.9) * 0.1).toFixed(2)}  kr</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-300">
                  <span>{t('summary.shipping')}</span>
                  <span>{t('summary.shippingMessage')}</span>
                </div>
                <div className="border-t border-stone-700 pt-4">
                  <div className="flex justify-between text-lg font-medium text-stone-100">
                    <span>{t('total')}</span>
                    <span>{total.toFixed(2)}  kr</span>
                  </div>
                  {isSubscription && (
                    <p className="text-sm text-amber-500 mt-1">
                      {t('subscription.savings', { amount: ((total / 0.9) * 0.1).toFixed(2) })}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCheckout}
                  className="block w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
                    hover:to-amber-600 text-white py-3 rounded-lg font-medium text-center transition-colors"
                >
                  {t('checkout')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 