'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Order,
  getOrderById,
  getStatusColor,
  formatOrderStatus,
  formatDate,
  formatPrice,
} from '@/lib/mock/orders';

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

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in');
      return;
    }

    const fetchOrder = async () => {
      if (user) {
        try {
          const orderData = await getOrderById(params.id);
          if (!orderData || orderData.userId !== user.$id) {
            router.push('/account/orders');
            return;
          }
          setOrder(orderData);
        } catch (error) {
          console.error('Error fetching order:', error);
          router.push('/account/orders');
        } finally {
          setIsLoadingOrder(false);
        }
      }
    };

    fetchOrder();
  }, [isLoading, user, router, params.id]);

  if (isLoading || isLoadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || !order) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="font-display text-4xl mb-2">Order Details</h1>
            <p className="text-stone-600">Order #{order.id}</p>
          </motion.div>

          {/* Order Status */}
          <motion.div variants={itemVariants} className="card">
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div>
                <p className="text-sm text-stone-600 mb-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {formatOrderStatus(order.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-stone-600 mb-1">Total Amount</p>
                <p className="text-2xl font-medium">${formatPrice(order.total)}</p>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="mb-6 p-4 bg-stone-50 rounded-lg">
                <h2 className="font-display text-xl mb-3">Tracking</h2>
                <p className="text-stone-600 mb-2">
                  <span className="font-medium">Tracking Number:</span>{' '}
                  {order.trackingNumber}
                </p>
                {order.estimatedDelivery && (
                  <p className="text-stone-600">
                    <span className="font-medium">Estimated Delivery:</span>{' '}
                    {formatDate(order.estimatedDelivery)}
                  </p>
                )}
              </div>
            )}

            {/* Shipping Address */}
            <div className="mb-6">
              <h2 className="font-display text-xl mb-3">Shipping Address</h2>
              <div className="text-stone-600">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </motion.div>

          {/* Order Items */}
          <motion.div variants={itemVariants} className="card">
            <h2 className="font-display text-2xl mb-6">Order Items</h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div
                  key={`${order.id}-${item.productId}`}
                  className="flex items-center space-x-4 py-4 border-b border-stone-200 last:border-0"
                >
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                    <p className="text-stone-600">
                      Quantity: {item.quantity} × ${formatPrice(item.price)}
                    </p>
                    <p className="text-stone-600">
                      Subtotal: ${formatPrice(item.quantity * item.price)}
                    </p>
                  </div>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => router.push(`/shop/${item.productId}`)}
                      className="btn-secondary whitespace-nowrap"
                    >
                      Buy Again
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex justify-between">
            <button
              onClick={() => router.push('/account/orders')}
              className="btn-secondary"
            >
              Back to Orders
            </button>
            {order.status === 'delivered' && (
              <button className="btn-primary">Buy All Again</button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 