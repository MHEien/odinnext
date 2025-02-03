'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function AccountPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
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
          {/* Welcome Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="font-display text-4xl mb-2">Welcome to Valhalla</h1>
            <p className="text-stone-600">
              Greetings, {profile.name}! Your chocolate feast awaits.
            </p>
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <motion.div variants={itemVariants} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl">Profile</h2>
                <button
                  onClick={() => router.push('/account/profile')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-stone-600">
                  <span className="font-medium">Name:</span> {profile.name}
                </p>
                <p className="text-stone-600">
                  <span className="font-medium">Email:</span> {profile.email}
                </p>
                {profile.addresses?.shipping && (
                  <div className="text-stone-600">
                    <span className="font-medium">Shipping Address:</span>
                    <p className="mt-1">
                      {profile.addresses.shipping.street}
                      <br />
                      {profile.addresses.shipping.city},{' '}
                      {profile.addresses.shipping.state}{' '}
                      {profile.addresses.shipping.postalCode}
                      <br />
                      {profile.addresses.shipping.country}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div variants={itemVariants} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl">Recent Orders</h2>
                <button
                  onClick={() => router.push('/account/orders')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-stone-600">No orders yet.</p>
                <button
                  onClick={() => router.push('/shop')}
                  className="btn-primary w-full"
                >
                  Start Shopping
                </button>
              </div>
            </motion.div>

            {/* Active Subscriptions */}
            <motion.div variants={itemVariants} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl">Subscriptions</h2>
                <button
                  onClick={() => router.push('/account/subscriptions')}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Manage
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-stone-600">No active subscriptions.</p>
                <button
                  onClick={() => router.push('/subscriptions')}
                  className="btn-primary w-full"
                >
                  Explore Plans
                </button>
              </div>
            </motion.div>

            {/* Preferences */}
            <motion.div variants={itemVariants} className="card">
              <h2 className="font-display text-2xl mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Marketing emails</span>
                  <span className="text-primary-600">
                    {profile.preferences?.marketing ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Order notifications</span>
                  <span className="text-primary-600">
                    {profile.preferences?.notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 