'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Order,
  getUserOrders,
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

export default function OrdersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in');
      return;
    }

    const fetchOrders = async () => {
      if (user) {
        try {
          const userOrders = await getUserOrders(user.$id);
          setOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    fetchOrders();
  }, [isLoading, user, router]);

  if (isLoading || isLoadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="font-display text-4xl mb-2">Your Orders</h1>
            <p className="text-stone-600">
              Track your chocolate feasts and their journey to your realm
            </p>
          </motion.div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 card"
            >
              <h2 className="font-display text-2xl mb-4">No Orders Yet</h2>
              <p className="text-stone-600 mb-6">
                Your order history is as empty as Odin&apos;s missing eye. Time to fill
                it with some divine chocolates!
              </p>
              <button
                onClick={() => router.push('/shop')}
                className="btn-primary"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-stone-200">
                    <div>
                      <p className="text-sm text-stone-600 mb-1">
                        Order placed on {formatDate(order.createdAt)}
                      </p>
                      <p className="font-medium">Order #{order.id}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {formatOrderStatus(order.status)}
                      </span>
                      <span className="font-medium">
                        Total: ${formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="flex items-center space-x-4"
                      >
                        <div className="relative h-20 w-20 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-stone-600">
                            Quantity: {item.quantity} × ${formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  {order.trackingNumber && (
                    <div className="mt-6 pt-4 border-t border-stone-200">
                      <p className="text-sm text-stone-600">
                        <span className="font-medium">Tracking Number:</span>{' '}
                        {order.trackingNumber}
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-sm text-stone-600">
                          <span className="font-medium">
                            Estimated Delivery:
                          </span>{' '}
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => router.push(`/account/orders/${order.id}`)}
                      className="btn-secondary"
                    >
                      View Details
                    </button>
                    {order.status === 'delivered' && (
                      <button className="btn-primary">Buy Again</button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 