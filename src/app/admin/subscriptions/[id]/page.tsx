'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Subscription,
  getSubscriptionById,
  updateSubscription,
  formatSubscriptionFrequency,
  formatSubscriptionStatus,
  formatSubscriptionDate,
  formatSubscriptionDateTime,
  formatSubscriptionAmount,
} from '@/app/lib/mock/subscriptions';
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

export default function SubscriptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getSubscriptionById(params.id);
        if (!data) {
          showToast.error('Subscription not found');
          return;
        }
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        showToast.error('Failed to load subscription');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [params.id]);

  const handleStatusChange = async (newStatus: 'active' | 'paused' | 'cancelled') => {
    if (!subscription || isUpdating) return;

    try {
      setIsUpdating(true);
      const updated = await updateSubscription(subscription.id, {
        status: newStatus,
      });
      setSubscription(updated);
      showToast.success(`Subscription ${newStatus}`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      showToast.error('Failed to update subscription');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFrequencyChange = async (
    newFrequency: 'weekly' | 'biweekly' | 'monthly'
  ) => {
    if (!subscription || isUpdating) return;

    try {
      setIsUpdating(true);
      const updated = await updateSubscription(subscription.id, {
        frequency: newFrequency,
      });
      setSubscription(updated);
      showToast.success('Frequency updated');
    } catch (error) {
      console.error('Error updating subscription:', error);
      showToast.error('Failed to update frequency');
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

  if (!subscription) {
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
            ← Back to Subscriptions
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl">Subscription Details</h1>
              <p className="text-stone-600">
                {subscription.items.length} items •{' '}
                {formatSubscriptionFrequency(subscription.frequency)}
              </p>
            </div>
            <Link
              href={`/admin/customers/${subscription.userId}`}
              className="text-primary-600 hover:text-primary-700"
            >
              View Customer
            </Link>
          </div>
        </motion.div>

        {/* Status & Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl mb-1">Subscription Status</h2>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  subscription.status === 'active'
                    ? 'bg-green-50 text-green-600'
                    : subscription.status === 'paused'
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {formatSubscriptionStatus(subscription.status)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {subscription.status === 'active' && (
                <>
                  <button
                    onClick={() => handleStatusChange('paused')}
                    disabled={isUpdating}
                    className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 disabled:opacity-50"
                  >
                    Pause
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    disabled={isUpdating}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </>
              )}
              {subscription.status === 'paused' && (
                <button
                  onClick={() => handleStatusChange('active')}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  Resume
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Delivery Schedule */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-display text-xl mb-6">Delivery Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-stone-500 mb-2">
                Delivery Frequency
              </h3>
              <select
                value={subscription.frequency}
                onChange={(e) =>
                  handleFrequencyChange(
                    e.target.value as 'weekly' | 'biweekly' | 'monthly'
                  )
                }
                disabled={isUpdating || subscription.status !== 'active'}
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every 2 Weeks</option>
                <option value="monthly">Monthly</option>
              </select>
              {subscription.status === 'active' && (
                <p className="text-sm text-stone-500 mt-2">
                  Next delivery on{' '}
                  {formatSubscriptionDate(subscription.nextDeliveryDate)}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-stone-500 mb-2">
                Last Delivery
              </h3>
              {subscription.lastDeliveryDate ? (
                <p>{formatSubscriptionDate(subscription.lastDeliveryDate)}</p>
              ) : (
                <p className="text-stone-500">No deliveries yet</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Subscription Items */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl">Items</h2>
            <p className="text-stone-500">
              Total: {formatSubscriptionAmount(subscription.totalAmount)}
            </p>
          </div>
          <div className="space-y-4">
            {subscription.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between p-4 rounded-lg bg-stone-50"
              >
                <div>
                  <p className="font-medium">Product ID: {item.productId}</p>
                  <p className="text-sm text-stone-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <Link
                  href={`/admin/products/${item.productId}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Subscription History */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-display text-xl mb-6">History</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Created</p>
                <p className="text-sm text-stone-500">
                  {formatSubscriptionDateTime(subscription.createdAt)}
                </p>
              </div>
            </div>

            {subscription.pausedAt && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Paused</p>
                  <p className="text-sm text-stone-500">
                    {formatSubscriptionDateTime(subscription.pausedAt)}
                  </p>
                </div>
              </div>
            )}

            {subscription.cancelledAt && (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cancelled</p>
                  <p className="text-sm text-stone-500">
                    {formatSubscriptionDateTime(subscription.cancelledAt)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-sm text-stone-500">
                  {formatSubscriptionDateTime(subscription.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 