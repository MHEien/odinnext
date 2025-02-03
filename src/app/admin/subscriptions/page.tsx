'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Subscription,
  SubscriptionFilters,
  getFilteredSubscriptions,
  formatSubscriptionFrequency,
  formatSubscriptionStatus,
  formatSubscriptionDate,
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

const sortOptions = [
  { value: 'created', label: 'Created Date' },
  { value: 'nextDelivery', label: 'Next Delivery' },
  { value: 'amount', label: 'Amount' },
] as const;

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SubscriptionFilters>({
    sortBy: 'nextDelivery',
    sortOrder: 'asc',
  });
  const showToast = useToast();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const data = await getFilteredSubscriptions(filters);
        setSubscriptions(data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        showToast.error('Failed to load subscriptions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [filters]);

  const handleFilterChange = (
    name: keyof SubscriptionFilters,
    value: string | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
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
          <h1 className="font-display text-3xl">Subscriptions</h1>
          <p className="text-stone-600">Manage recurring chocolate deliveries</p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Frequency
              </label>
              <select
                value={filters.frequency || ''}
                onChange={(e) => handleFilterChange('frequency', e.target.value || undefined)}
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Frequencies</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every 2 Weeks</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) => handleFilterChange('sortBy', e.target.value as SubscriptionFilters['sortBy'])}
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder || 'asc'}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as SubscriptionFilters['sortOrder'])}
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Subscriptions Grid */}
        <motion.div variants={itemVariants}>
          {subscriptions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
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
                No subscriptions found
              </h3>
              <p className="text-stone-600">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => (
                <Link
                  key={subscription.id}
                  href={`/admin/subscriptions/${subscription.id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          subscription.status === 'active'
                            ? 'bg-green-50 text-green-600'
                            : subscription.status === 'paused'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {formatSubscriptionStatus(subscription.status)}
                      </span>
                      <span className="text-sm text-stone-500">
                        {subscription.items.length} items
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-stone-500">Next Delivery</p>
                        <p className="font-medium">
                          {formatSubscriptionDate(subscription.nextDeliveryDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-stone-500">Frequency</p>
                        <p className="font-medium">
                          {formatSubscriptionFrequency(subscription.frequency)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-stone-500">Amount</p>
                        <p className="font-medium">
                          {formatSubscriptionAmount(subscription.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <p className="text-sm text-stone-400">
                        Created {formatSubscriptionDate(subscription.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
} 