'use client';

import { useRouter} from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Subscription, Product, Collection } from '@prisma/client';
import { useState } from 'react';

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

type SubscriptionWithDetails = Subscription & {
  items: {
    product: Product;
    quantity: number;
  }[];
  collection: Collection | null;
};

interface SubscriptionListProps {
  subscriptions: SubscriptionWithDetails[];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'PAUSED':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const t = useTranslations('Subscriptions');

  const handleUpdateStatus = async (subscriptionId: string, newStatus: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription status');
      }

      router.refresh();
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (subscriptions.length === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center py-12 card"
      >
        <h2 className="font-display text-2xl mb-4">{t('empty.title')}</h2>
        <p className="text-stone-600 mb-6">
          {t('empty.message')}
        </p>
        <button
          onClick={() => router.push('/shop')}
          className="btn-primary"
        >
          {t('empty.action')}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {subscriptions.map((subscription) => (
        <motion.div
          key={subscription.id}
          variants={itemVariants}
          className="card hover:shadow-lg transition-shadow duration-300"
        >
          {/* Subscription Header */}
          <div className="flex flex-wrap items-center justify-between mb-6 pb-4 border-b border-stone-200">
            <div>
              <h2 className="font-display text-2xl mb-1">
                {subscription.collection
                  ? subscription.collection.name
                  : t('details.customSubscription')}
              </h2>
              <p className="text-stone-600">
                {t('details.delivery', { frequency: t(`frequency.${subscription.frequency.toLowerCase()}`) })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  subscription.status
                )}`}
              >
                {t(`status.${subscription.status.toLowerCase()}`)}
              </span>
            </div>
          </div>

          {/* Subscription Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{t('details.nextDelivery')}</h3>
              <p className="text-stone-600">
                {subscription.status === 'ACTIVE'
                  ? formatDate(subscription.nextDelivery)
                  : t('details.noUpcomingDelivery')}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">{t('details.products')}</h3>
              <div className="space-y-2">
                {subscription.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-stone-600">
                    <span>{item.product.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            {subscription.status === 'ACTIVE' && (
              <>
                <button 
                  className="btn-secondary"
                  onClick={() => router.push(`/subscriptions/${subscription.id}/edit`)}
                  disabled={isUpdating}
                >
                  {t('actions.modifyProducts')}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleUpdateStatus(subscription.id, 'PAUSED')}
                  disabled={isUpdating}
                >
                  {t('actions.pauseDeliveries')}
                </button>
                <button 
                  className="btn-secondary text-red-600 hover:text-red-700"
                  onClick={() => handleUpdateStatus(subscription.id, 'CANCELLED')}
                  disabled={isUpdating}
                >
                  {t('actions.cancelSubscription')}
                </button>
              </>
            )}
            {subscription.status === 'PAUSED' && (
              <>
                <button 
                  className="btn-primary"
                  onClick={() => handleUpdateStatus(subscription.id, 'ACTIVE')}
                  disabled={isUpdating}
                >
                  {t('actions.resumeDeliveries')}
                </button>
                <button 
                  className="btn-secondary text-red-600 hover:text-red-700"
                  onClick={() => handleUpdateStatus(subscription.id, 'CANCELLED')}
                  disabled={isUpdating}
                >
                  {t('actions.cancelSubscription')}
                </button>
              </>
            )}
            {subscription.status === 'CANCELLED' && (
              <button 
                className="btn-primary"
                onClick={() => handleUpdateStatus(subscription.id, 'ACTIVE')}
                disabled={isUpdating}
              >
                {t('actions.reactivate')}
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 