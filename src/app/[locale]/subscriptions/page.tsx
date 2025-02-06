'use client';

import { motion } from 'framer-motion';
import { useRouter} from '@/i18n/routing';
import { useAuth } from '@/lib/context/AuthContext';
import {
  subscriptionPlans,
  getFrequencyLabel,
  formatPrice,
} from '@/lib/mock/subscriptions';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

const benefitVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSubscribe = (planId: string) => {
    if (!user) {
      router.push('/auth/sign-in?redirect=/subscriptions');
      return;
    }
    router.push(`/subscriptions/${planId}/checkout`);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-5xl mb-4">Join the Feast of Gods</h1>
            <p className="text-xl text-stone-600">
              Subscribe to receive regular deliveries of divine chocolate, crafted with
              the finest ingredients and blessed by the Norse gods themselves.
            </p>
          </motion.div>

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                className="card hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Plan Header */}
                <div className="text-center p-6 bg-gradient-to-b from-primary-50 to-transparent rounded-t-2xl">
                  <h2 className="font-display text-3xl mb-2">{plan.name}</h2>
                  <p className="text-stone-600 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    ${formatPrice(plan.pricePerDelivery)}
                  </div>
                  <p className="text-stone-600">
                    per {getFrequencyLabel(plan.frequency).toLowerCase()} delivery
                  </p>
                </div>

                {/* Benefits */}
                <div className="p-6 flex-grow">
                  <h3 className="font-display text-xl mb-4">Plan Benefits</h3>
                  <ul className="space-y-3">
                    {plan.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        variants={benefitVariants}
                        className="flex items-start"
                      >
                        <svg
                          className="h-6 w-6 text-primary-600 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-stone-600">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Action */}
                <div className="p-6 bg-stone-50 rounded-b-2xl">
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className="btn-primary w-full"
                  >
                    {user ? 'Subscribe Now' : 'Sign In to Subscribe'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto mt-16">
            <h2 className="font-display text-3xl text-center mb-8">
              Common Questions
            </h2>
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-display text-xl mb-2">
                  Can I change my delivery frequency?
                </h3>
                <p className="text-stone-600">
                  Yes! You can adjust your delivery frequency or pause deliveries at
                  any time through your account dashboard.
                </p>
              </div>
              <div className="card">
                <h3 className="font-display text-xl mb-2">
                  What if I&apos;m not home for delivery?
                </h3>
                <p className="text-stone-600">
                  Our chocolates are packaged to stay fresh and protected. If
                  you&apos;re not home, the delivery service will follow your specified
                  delivery preferences.
                </p>
              </div>
              <div className="card">
                <h3 className="font-display text-xl mb-2">
                  Can I cancel my subscription?
                </h3>
                <p className="text-stone-600">
                  Absolutely! While we&apos;ll miss you in Valhalla, you can cancel your
                  subscription at any time with no penalties.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 