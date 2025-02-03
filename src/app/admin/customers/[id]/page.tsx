'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  UserProfile,
  getUserById,
  getUserOrders,
  formatUserDate,
  formatUserDateTime,
  formatUserAmount,
} from '@/lib/mock/users';
import { Order } from '@/lib/mock/orders';
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

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, ordersData] = await Promise.all([
          getUserById(params.id),
          getUserOrders(params.id),
        ]);

        if (!userData) {
          showToast.error('Customer not found');
          return;
        }

        setUser(userData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        showToast.error('Failed to load customer data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
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
    <div className="p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => window.history.back()}
            className="text-stone-600 hover:text-primary-600 mb-4"
          >
            ← Back to Customers
          </button>
          <div className="flex items-start gap-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-stone-100">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <svg
                  className="w-full h-full text-stone-400 p-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl">{user.name}</h1>
              <p className="text-stone-600">{user.email}</p>
              {user.phone && (
                <p className="text-stone-500 mt-1">{user.phone}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Customer Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-stone-500">Total Orders</h3>
            <p className="text-2xl font-display mt-1">
              {user.stats.totalOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-stone-500">Total Spent</h3>
            <p className="text-2xl font-display mt-1">
              {formatUserAmount(user.stats.totalSpent)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-stone-500">
              Active Subscriptions
            </h3>
            <p className="text-2xl font-display mt-1">
              {user.stats.activeSubscriptions}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm font-medium text-stone-500">Customer Since</h3>
            <p className="text-2xl font-display mt-1">
              {formatUserDate(user.createdAt)}
            </p>
          </div>
        </motion.div>

        {/* Customer Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl">Recent Orders</h2>
                {orders.length > 0 && (
                  <Link
                    href={`/admin/orders?customer=${user.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </Link>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 text-stone-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-stone-900 mb-2">
                    No orders yet
                  </h3>
                  <p className="text-stone-600">
                    This customer hasn&apos;t placed any orders.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="block p-4 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-stone-500">
                            {formatUserDateTime(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatUserAmount(order.total)}
                          </p>
                          <p className="text-sm text-stone-500">
                            {order.items.length} items
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Active Subscriptions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl">Active Subscriptions</h2>
                {user.stats.activeSubscriptions > 0 && (
                  <Link
                    href={`/admin/subscriptions?customer=${user.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View all
                  </Link>
                )}
              </div>

              {user.stats.activeSubscriptions === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 text-stone-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-stone-900 mb-2">
                    No active subscriptions
                  </h3>
                  <p className="text-stone-600">
                    This customer doesn&apos;t have any active subscriptions.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-stone-600">
                    Subscription management coming soon...
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-stone-500">Email</h3>
                  <p className="mt-1">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-stone-500">Phone</h3>
                    <p className="mt-1">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Addresses */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-6">Shipping Addresses</h2>
              <div className="space-y-4">
                {user.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 rounded-lg bg-stone-50"
                  >
                    {address.isDefault && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-50 text-primary-600 rounded-full mb-2">
                        Default Address
                      </span>
                    )}
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-6">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">
                    Marketing Emails
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.preferences.marketingEmails
                        ? 'bg-green-50 text-green-600'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {user.preferences.marketingEmails ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">
                    Order Notifications
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.preferences.orderNotifications
                        ? 'bg-green-50 text-green-600'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {user.preferences.orderNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-stone-600">
                    Subscription Reminders
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.preferences.subscriptionReminders
                        ? 'bg-green-50 text-green-600'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {user.preferences.subscriptionReminders
                      ? 'Enabled'
                      : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 