'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Cart,
  CartItem,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  formatCartItemFrequency,
  formatCartAmount,
} from '@/app/lib/mock/cart';
import { useToast } from '@/lib/hooks/useToast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (err) {
        console.error('Error fetching cart:', err);
        showToast.error('Failed to load cart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [showToast]);

  const handleQuantityChange = async (
    item: CartItem,
    newQuantity: number
  ) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const updatedCart = await updateCartItemQuantity(
        item.productId,
        newQuantity,
        item.isSubscription,
        item.frequency
      );
      setCart(updatedCart);
      showToast.success('Cart updated');
    } catch (err) {
      console.error('Error updating quantity:', err);
      showToast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (item: CartItem) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      const updatedCart = await removeFromCart(
        item.productId,
        item.isSubscription,
        item.frequency
      );
      setCart(updatedCart);
      showToast.success('Item removed');
    } catch (err) {
      console.error('Error removing item:', err);
      showToast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <svg
              className="w-16 h-16 text-stone-400 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="font-display text-3xl text-stone-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-stone-600">
              Time to discover some legendary chocolate!
            </p>
            <Link
              href="/products"
              className="mt-8 inline-block px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <h1 className="font-display text-3xl text-stone-900">Shopping Cart</h1>
            <p className="mt-2 text-stone-600">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in
              your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-8 space-y-6"
            >
              {cart.items.map((item) => (
                <div
                  key={`${item.productId}-${item.isSubscription}-${item.frequency}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-stone-100">
                        <Image
                          src="/products/chocolate-1.jpg"
                          alt="Product"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-stone-900 truncate">
                              Thor&apos;s Thunder Chocolate
                            </h3>
                            <p className="mt-1 text-sm text-stone-500">
                              {formatCartItemFrequency(item.frequency)}
                            </p>
                            {item.isSubscription && (
                              <span className="mt-2 inline-block px-2 py-1 text-xs font-medium bg-primary-50 text-primary-600 rounded-full">
                                10% subscription discount
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item)}
                            disabled={isUpdating}
                            className="text-stone-400 hover:text-red-600 disabled:opacity-50"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity - 1)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                              className="p-2 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                            >
                              <svg
                                className="w-4 h-4"
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
                            <span className="text-stone-900 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item, item.quantity + 1)
                              }
                              disabled={isUpdating || item.quantity >= 10}
                              className="p-2 rounded-lg bg-stone-50 text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                            >
                              <svg
                                className="w-4 h-4"
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
                          <p className="font-medium text-stone-900">
                            {formatCartAmount(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-4 space-y-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-display text-xl text-stone-900">
                  Order Summary
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-stone-600">Subtotal</p>
                    <p className="font-medium text-stone-900">
                      {formatCartAmount(cart.subtotal)}
                    </p>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex items-center justify-between text-primary-600">
                      <p>Subscription Discount</p>
                      <p>-{formatCartAmount(cart.discount)}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-stone-900">Total</p>
                      <p className="text-lg font-medium text-stone-900">
                        {formatCartAmount(cart.total)}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="mt-8 block w-full px-8 py-3 rounded-lg bg-primary-600 text-center text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>

              <div className="bg-stone-100 rounded-xl p-6">
                <h3 className="font-medium text-stone-900">
                  Subscription Benefits
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-stone-600">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save 10% on every delivery
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Flexible delivery schedule
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-primary-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Pause or cancel anytime
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 