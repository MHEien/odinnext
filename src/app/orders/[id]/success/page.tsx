'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Order, getOrder } from '@/app/lib/mock/checkout';

export default function OrderSuccessPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrder(params.id as string);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      }
    };

    fetchOrder();
  }, [params.id]);

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
            {error}
          </div>
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-stone-200 rounded mx-auto" />
            <div className="h-4 w-48 bg-stone-200 rounded mx-auto" />
            <div className="h-32 w-full bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-primary-600"
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
          </div>
          <h1 className="font-display text-3xl text-stone-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-stone-600 mb-8">
            Thank you for your order. We&apos;ll send you shipping updates via email.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="border-b border-stone-200 pb-4 mb-4">
            <h2 className="font-display text-xl text-stone-900 mb-2">
              Order #{order.id}
            </h2>
            <p className="text-stone-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-6">
            {/* Shipping Address */}
            <div>
              <h3 className="font-medium text-stone-900 mb-2">
                Shipping Address
              </h3>
              <div className="text-stone-600">
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="font-medium text-stone-900 mb-2">Payment Method</h3>
              <div className="text-stone-600">
                <p className="capitalize">{order.paymentMethod.cardBrand}</p>
                <p>•••• •••• •••• {order.paymentMethod.last4}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="font-medium text-stone-900 mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-primary-600">
                    <span>Subscription Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-medium text-stone-900 pt-4 border-t border-stone-200">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center">
          <Link
            href="/products"
            className="inline-block px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 