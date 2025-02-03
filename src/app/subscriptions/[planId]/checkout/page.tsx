'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import {
  SubscriptionPlan,
  getPlanById,
  createSubscription,
  getFrequencyLabel,
  formatPrice,
} from '@/lib/mock/subscriptions';

interface CheckoutFormData {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

const steps = ['Shipping', 'Payment', 'Confirmation'];

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

export default function CheckoutPage({
  params,
}: {
  params: { planId: string };
}) {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      street: profile?.addresses?.shipping?.street || '',
      city: profile?.addresses?.shipping?.city || '',
      state: profile?.addresses?.shipping?.state || '',
      postalCode: profile?.addresses?.shipping?.postalCode || '',
      country: profile?.addresses?.shipping?.country || '',
    },
    paymentMethod: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    },
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in');
      return;
    }

    const fetchPlan = async () => {
      try {
        const planData = await getPlanById(params.planId);
        if (!planData) {
          router.push('/subscriptions');
          return;
        }
        setPlan(planData);
      } catch (error) {
        console.error('Error fetching plan:', error);
        router.push('/subscriptions');
      } finally {
        setIsLoadingPlan(false);
      }
    };

    fetchPlan();
  }, [isLoading, user, router, params.planId, profile]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      handleNext();
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      if (!user) throw new Error('Not authenticated');
      if (!plan) throw new Error('Plan not found');

      // In a real app, we would process the payment here
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate payment processing

      const subscription = await createSubscription({
        userId: user.$id,
        planId: plan.id,
        shippingAddress: formData.shippingAddress,
      });

      console.log('Subscription created:', subscription);

      // Show success animation and redirect
      setCurrentStep(steps.length - 1);
      setTimeout(() => {
        router.push('/account/subscriptions');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during checkout');
      }
      setIsProcessing(false);
    }
  };

  if (isLoading || isLoadingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || !plan) {
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
            <h1 className="font-display text-4xl mb-2">Subscribe to {plan.name}</h1>
            <p className="text-stone-600">
              {getFrequencyLabel(plan.frequency)} delivery at ${formatPrice(plan.pricePerDelivery)}
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-center items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 ${
                      index <= currentStep ? 'text-primary-600' : 'text-stone-600'
                    }`}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-0.5 mx-2 bg-stone-200" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Checkout Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="card space-y-6"
                  >
                    <h2 className="font-display text-2xl mb-4">Shipping Address</h2>
                    <div>
                      <label
                        htmlFor="street"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        Street Address
                      </label>
                      <input
                        id="street"
                        type="text"
                        required
                        value={formData.shippingAddress.street}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: {
                              ...formData.shippingAddress,
                              street: e.target.value,
                            },
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          required
                          value={formData.shippingAddress.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingAddress: {
                                ...formData.shippingAddress,
                                city: e.target.value,
                              },
                            })
                          }
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          State/Province
                        </label>
                        <input
                          id="state"
                          type="text"
                          required
                          value={formData.shippingAddress.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingAddress: {
                                ...formData.shippingAddress,
                                state: e.target.value,
                              },
                            })
                          }
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="postalCode"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          Postal Code
                        </label>
                        <input
                          id="postalCode"
                          type="text"
                          required
                          value={formData.shippingAddress.postalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingAddress: {
                                ...formData.shippingAddress,
                                postalCode: e.target.value,
                              },
                            })
                          }
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          required
                          value={formData.shippingAddress.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingAddress: {
                                ...formData.shippingAddress,
                                country: e.target.value,
                              },
                            })
                          }
                          className="input-field"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="card space-y-6"
                  >
                    <h2 className="font-display text-2xl mb-4">Payment Method</h2>
                    <div>
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-stone-700 mb-1"
                      >
                        Card Number
                      </label>
                      <input
                        id="cardNumber"
                        type="text"
                        required
                        value={formData.paymentMethod.cardNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMethod: {
                              ...formData.paymentMethod,
                              cardNumber: e.target.value,
                            },
                          })
                        }
                        className="input-field"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          Expiry Date
                        </label>
                        <input
                          id="expiryDate"
                          type="text"
                          required
                          value={formData.paymentMethod.expiryDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: {
                                ...formData.paymentMethod,
                                expiryDate: e.target.value,
                              },
                            })
                          }
                          className="input-field"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-stone-700 mb-1"
                        >
                          CVV
                        </label>
                        <input
                          id="cvv"
                          type="text"
                          required
                          value={formData.paymentMethod.cvv}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: {
                                ...formData.paymentMethod,
                                cvv: e.target.value,
                              },
                            })
                          }
                          className="input-field"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="card space-y-6"
                  >
                    <h2 className="font-display text-2xl mb-4">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600">Plan</span>
                        <span className="font-medium">{plan.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600">Frequency</span>
                        <span className="font-medium">
                          {getFrequencyLabel(plan.frequency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600">Price per Delivery</span>
                        <span className="font-medium">
                          ${formatPrice(plan.pricePerDelivery)}
                        </span>
                      </div>
                      <div className="pt-4 border-t border-stone-200">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total per Delivery</span>
                          <span className="text-xl font-bold text-primary-600">
                            ${formatPrice(plan.pricePerDelivery)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex justify-between">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/subscriptions')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`btn-primary ${
                    isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing
                    ? 'Processing...'
                    : currentStep === steps.length - 1
                    ? 'Confirm Subscription'
                    : 'Continue'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 