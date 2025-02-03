'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import {
  Subscription,
  SubscriptionPlan,
  getUserSubscriptions,
  getPlanById,
  getStatusColor,
  formatStatus,
  formatDate,
  formatPrice,
  getFrequencyLabel,
} from '@/lib/mock/subscriptions';

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

interface SubscriptionWithPlan extends Subscription {
  plan: SubscriptionPlan;
}

export default function SubscriptionsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithPlan[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in');
      return;
    }

    const fetchSubscriptions = async () => {
      if (user) {
        try {
          const userSubs = await getUserSubscriptions(user.$id);
          const subsWithPlans = await Promise.all(
            userSubs.map(async (sub) => {
              const plan = await getPlanById(sub.planId);
              if (!plan) throw new Error(`Plan not found: ${sub.planId}`);
              return { ...sub, plan };
            })
          );
          setSubscriptions(subsWithPlans);
        } catch (error) {
          console.error('Error fetching subscriptions:', error);
        } finally {
          setIsLoadingSubscriptions(false);
        }
      }
    };

    fetchSubscriptions();
  }, [isLoading, user, router]);

  if (isLoading || isLoadingSubscriptions) {
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
            <h1 className="font-display text-4xl mb-2">Your Subscriptions</h1>
            <p className="text-stone-600">
              Manage your divine chocolate deliveries
            </p>
          </motion.div>

          {/* Subscriptions List */}
          {subscriptions.length === 0 ? (
            <motion.div
              variants={itemVariants}
              className="text-center py-12 card"
            >
              <h2 className="font-display text-2xl mb-4">No Active Subscriptions</h2>
              <p className="text-stone-600 mb-6">
                Join our subscription plans to receive regular deliveries of
                premium Norse-themed chocolates.
              </p>
              <button
                onClick={() => router.push('/subscriptions')}
                className="btn-primary"
              >
                Explore Subscription Plans
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
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
                        {subscription.plan.name}
                      </h2>
                      <p className="text-stone-600">
                        {getFrequencyLabel(subscription.plan.frequency)} Delivery
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          subscription.status
                        )}`}
                      >
                        {formatStatus(subscription.status)}
                      </span>
                      <span className="font-medium">
                        ${formatPrice(subscription.plan.pricePerDelivery)}/delivery
                      </span>
                    </div>
                  </div>

                  {/* Subscription Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Next Delivery</h3>
                      <p className="text-stone-600">
                        {subscription.status === 'active'
                          ? formatDate(subscription.nextDeliveryDate)
                          : 'No upcoming delivery'}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Shipping Address</h3>
                      <div className="text-stone-600">
                        <p>{subscription.shippingAddress.street}</p>
                        <p>
                          {subscription.shippingAddress.city},{' '}
                          {subscription.shippingAddress.state}{' '}
                          {subscription.shippingAddress.postalCode}
                        </p>
                        <p>{subscription.shippingAddress.country}</p>
                      </div>
                    </div>

                    {subscription.status === 'paused' && subscription.pausedUntil && (
                      <div>
                        <h3 className="font-medium mb-2">Paused Until</h3>
                        <p className="text-stone-600">
                          {formatDate(subscription.pausedUntil)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-4">
                    {subscription.status === 'active' && (
                      <>
                        <button className="btn-secondary">Change Plan</button>
                        <button className="btn-secondary">Update Address</button>
                        <button className="btn-secondary">Pause Deliveries</button>
                        <button className="btn-secondary text-red-600 hover:text-red-700">
                          Cancel Subscription
                        </button>
                      </>
                    )}
                    {subscription.status === 'paused' && (
                      <>
                        <button className="btn-primary">Resume Deliveries</button>
                        <button className="btn-secondary text-red-600 hover:text-red-700">
                          Cancel Subscription
                        </button>
                      </>
                    )}
                    {subscription.status === 'cancelled' && (
                      <button className="btn-primary">Reactivate</button>
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