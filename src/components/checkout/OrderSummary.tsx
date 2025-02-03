'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Cart } from '@/app/lib/mock/cart';
import { Product } from '@/app/lib/mock/products';
import { formatCartAmount, formatCartItemFrequency } from '@/app/lib/mock/cart';

interface OrderSummaryProps {
  cart: Cart;
  products: { [key: string]: Product };
}

export default function OrderSummary({ cart, products }: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="font-display text-xl text-stone-900 mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => {
          const product = products[item.productId];
          if (!product) return null;

          return (
            <div
              key={`${item.productId}-${item.isSubscription}-${item.frequency}`}
              className="flex gap-4"
            >
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-stone-100 flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-stone-900 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-stone-500">
                  {item.isSubscription
                    ? formatCartItemFrequency(item.frequency)
                    : 'One-time purchase'}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-sm text-stone-600">Qty: {item.quantity}</p>
                  <p className="font-medium text-stone-900">
                    {formatCartAmount(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-stone-200 pt-4 space-y-4">
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

        <div className="border-t border-stone-200 pt-4">
          <div className="flex items-center justify-between text-lg font-medium text-stone-900">
            <span>Total</span>
            <span>{formatCartAmount(cart.total)}</span>
          </div>
          {cart.discount > 0 && (
            <p className="mt-1 text-sm text-primary-600 text-right">
              You save {formatCartAmount(cart.discount)}!
            </p>
          )}
        </div>
      </div>

      {/* Subscription Benefits */}
      {cart.items.some((item) => item.isSubscription) && (
        <div className="mt-6 bg-primary-50 rounded-lg p-4">
          <h3 className="font-medium text-primary-900 mb-2">
            Subscription Benefits
          </h3>
          <ul className="text-sm text-primary-700 space-y-2">
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-primary-600"
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
                className="w-4 h-4 mr-2 text-primary-600"
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
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-primary-600"
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
              Priority shipping
            </li>
          </ul>
        </div>
      )}
    </motion.div>
  );
} 