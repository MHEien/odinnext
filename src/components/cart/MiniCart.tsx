'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  CartItem,
  updateCartItemQuantity,
  removeFromCart,
  formatCartItemFrequency,
  formatCartAmount,
} from '@/app/lib/mock/cart';
import { useCart } from './CartProvider';
import { useToast } from '@/lib/hooks/useToast';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cartVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 250,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { cart, products, isLoading, refreshCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const showToast = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = async (
    item: CartItem,
    newQuantity: number
  ) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      await updateCartItemQuantity(
        item.productId,
        newQuantity,
        item.isSubscription,
        item.frequency
      );
      await refreshCart();
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
      await removeFromCart(
        item.productId,
        item.isSubscription,
        item.frequency
      );
      await refreshCart();
      showToast.success('Item removed');
    } catch (err) {
      console.error('Error removing item:', err);
      showToast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/30 z-40"
            onClick={onClose}
          />

          {/* Cart Panel */}
          <motion.div
            ref={cartRef}
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-50 shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-stone-900">
                    Your Cart
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <svg
                      className="w-6 h-6"
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
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : !cart || cart.items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <svg
                      className="w-16 h-16 text-stone-400 mb-6"
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
                    <p className="text-stone-600 mb-6">
                      Your cart awaits the taste of Valhalla
                    </p>
                    <Link
                      href="/products"
                      onClick={onClose}
                      className="px-6 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                    >
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {cart.items.map((item: CartItem) => {
                      const product = products[item.productId];
                      if (!product) return null;

                      return (
                        <motion.div
                          key={`${item.productId}-${item.isSubscription}-${item.frequency}`}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="bg-white rounded-lg shadow-sm p-4"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-stone-100">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-medium text-stone-900 truncate">
                                    {product.name}
                                  </h3>
                                  <p className="mt-1 text-sm text-stone-500 line-clamp-2">
                                    {product.description}
                                  </p>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-stone-100 text-stone-600 rounded-full">
                                      {product.weight}
                                    </span>
                                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-stone-100 text-stone-600 rounded-full capitalize">
                                      {product.category}
                                    </span>
                                    {item.isSubscription && (
                                      <>
                                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-600 rounded-full">
                                          10% off
                                        </span>
                                        <span className="inline-block px-2 py-0.5 text-xs font-medium bg-stone-100 text-stone-600 rounded-full">
                                          {formatCartItemFrequency(item.frequency)}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveItem(item)}
                                  disabled={isUpdating}
                                  className="text-stone-400 hover:text-red-600 disabled:opacity-50"
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
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(item, item.quantity - 1)
                                    }
                                    disabled={isUpdating || item.quantity <= 1}
                                    className="p-1 rounded text-stone-600 hover:bg-stone-100 disabled:opacity-50"
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
                                  <span className="text-sm font-medium text-stone-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(item, item.quantity + 1)
                                    }
                                    disabled={isUpdating || item.quantity >= 10}
                                    className="p-1 rounded text-stone-600 hover:bg-stone-100 disabled:opacity-50"
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
                                <div className="text-right">
                                  <p className="font-medium text-stone-900">
                                    {formatCartAmount(item.price * item.quantity)}
                                  </p>
                                  {item.isSubscription && (
                                    <p className="text-xs text-primary-600">
                                      Save {formatCartAmount(item.price * item.quantity * 0.1)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart && cart.items.length > 0 && (
                <div className="p-6 bg-white shadow-sm-top">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span>{formatCartAmount(cart.subtotal)}</span>
                    </div>
                    {cart.discount > 0 && (
                      <div className="flex items-center justify-between text-primary-600">
                        <span>Subscription Discount</span>
                        <span>-{formatCartAmount(cart.discount)}</span>
                      </div>
                    )}
                    <div className="pt-4 border-t border-stone-200">
                      <div className="flex items-center justify-between text-lg font-medium text-stone-900">
                        <span>Total</span>
                        <span>{formatCartAmount(cart.total)}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Link
                        href="/cart"
                        onClick={onClose}
                        className="px-6 py-3 rounded-lg bg-stone-100 text-stone-900 text-center font-medium hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 transition-colors"
                      >
                        View Cart
                      </Link>
                      <Link
                        href="/checkout"
                        onClick={onClose}
                        className="px-6 py-3 rounded-lg bg-primary-600 text-white text-center font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 