'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing'
import { useRouter} from '@/i18n/routing';
import { useCart } from '@/lib/context/CartContext';
import { processCheckout } from '@/lib/db/actions';
import { Address } from '@prisma/client';
import { PaymentMethod } from '@/types';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutPage() {
  const router = useRouter();
  const { state: { items, total }, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'card' | 'vipps'>('card');
  const t = useTranslations('Checkout');
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const [formData, setFormData] = useState({
    shippingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    } as Address,
    billingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    } as Address,
    paymentMethod: {
      type: 'card' as const,
      cardBrand: '',
      last4: '',
      expiryMonth: 0,
      expiryYear: 0,
    } as PaymentMethod,
    sameAsShipping: true,
    saveInfo: false,
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 pt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="w-16 h-16 text-stone-600 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h1 className="font-norse text-3xl text-stone-100 mb-4">
              {t('emptyCart.title')}
            </h1>
            <p className="text-stone-400 mb-8">
              {t('emptyCart.message')}
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
                hover:to-amber-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {t('emptyCart.action')}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (data: Address) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: data,
      billingAddress: prev.sameAsShipping ? data : prev.billingAddress,
    }));
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (data: PaymentMethod) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: data,
    }));
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const checkoutData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsShipping
          ? formData.shippingAddress
          : formData.billingAddress,
        paymentMethod: formData.paymentMethod,
      };

      // If using Vipps payment
      if (paymentOption === 'vipps') {
        const body = {
          products: items,
          isVipps: true,
          customer: {
            email: formData.shippingAddress.email,
            firstName: formData.shippingAddress.firstName,
            lastName: formData.shippingAddress.lastName,
            phoneNumber: formData.shippingAddress.phone
          }
        };

        // Use guest checkout API for both guests and logged-in users with Vipps
        const response = await fetch('/api/checkout/guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error('Vipps checkout failed');
        }

        const result = await response.json();
        
        // Handle Vipps response format
        if (result.ok && result.data) {
          // Handle new Vipps response structure
          if (result.data.token && result.data.checkoutFrontendUrl) {
            clearCart();
            window.location.href = `${result.data.checkoutFrontendUrl}?token=${result.data.token}`;
            return;
          }
        } else if (result.url) {
          // Handle legacy direct URL format
          clearCart();
          window.location.href = result.url;
          return;
        }
        
        throw new Error('Invalid Vipps response format');
      } 
      
      // Regular checkout
      let orderId;

      if (isLoggedIn) {
        // Use server action for logged-in users
        const order = await processCheckout(checkoutData);
        orderId = order.id;
      } else {
        // Use API endpoint for guests
        const response = await fetch('/api/checkout/guest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(checkoutData),
        });

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Checkout failed');
        }
        
        orderId = result.orderId;
      }

      clearCart();
      router.push(`/orders/${orderId}/success`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert(t('error.orderFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 pt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-norse text-4xl text-stone-100 mb-8"
            >
              {t('title')}
            </motion.h1>

            {/* Steps */}
            <div className="space-y-8">
              {/* Step indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between"
              >
                {['shipping', 'payment', 'review'].map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      step === currentStep
                        ? 'text-amber-500'
                        : 'text-stone-500'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step === currentStep
                          ? 'border-amber-500 text-amber-500'
                          : 'border-stone-700 text-stone-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="ml-2 font-medium capitalize">{t(`steps.${step}`)}</span>
                  </div>
                ))}
              </motion.div>

              {/* Form steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-stone-800/50 rounded-lg border border-stone-700 p-6"
              >
                {currentStep === 'shipping' && (
                  <ShippingForm
                    initialData={formData.shippingAddress}
                    onSubmit={handleShippingSubmit}
                  />
                )}

                {currentStep === 'payment' && (
                  <PaymentForm
                    initialData={formData.paymentMethod}
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setCurrentStep('shipping')}
                  />
                )}

                {currentStep === 'review' && (
                  <div className="space-y-8">
                    {/* Review content */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="font-norse text-xl text-stone-100 mb-4">
                          {t('review.shippingDetails')}
                        </h2>
                        <div className="text-stone-400">
                          <p>{formData.shippingAddress.firstName} {formData.shippingAddress.lastName}</p>
                          <p>{formData.shippingAddress.street}</p>
                          <p>
                            {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.postalCode}
                          </p>
                          <p>{formData.shippingAddress.country}</p>
                        </div>
                      </div>

                      <div>
                        <h2 className="font-norse text-xl text-stone-100 mb-4">
                          {t('review.paymentMethod')}
                        </h2>
                        <div className="text-stone-400">
                          <p className="capitalize">{formData.paymentMethod.cardBrand}</p>
                          <p>{t('review.cardEnding', { last4: formData.paymentMethod.last4 })}</p>
                          <p>
                            {t('review.expires', {
                              month: (formData.paymentMethod.expiryMonth).toString().padStart(2, '0'),
                              year: formData.paymentMethod.expiryYear
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Option Selection */}
                    <div className="mt-8">
                      <h3 className="font-norse text-xl text-stone-100 mb-4">
                        {t('review.paymentOptions')}
                      </h3>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => setPaymentOption('card')}
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            paymentOption === 'card'
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-700 text-stone-300'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          {t('review.cardPayment')}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPaymentOption('vipps')}
                          className={`px-4 py-2 rounded-lg flex items-center ${
                            paymentOption === 'vipps'
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-700 text-stone-300'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          {t('review.vippsPayment')}
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentStep('payment')}
                        className="px-8 py-3 rounded-lg bg-stone-700 text-stone-100 font-medium 
                          hover:bg-stone-600 transition-colors"
                      >
                        {t('review.back')}
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 
                          hover:from-amber-500 hover:to-amber-600 text-white font-medium transition-colors 
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? t('review.processing') : (
                          paymentOption === 'vipps' ? t('review.payWithVipps') : t('review.placeOrder')
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <OrderSummary items={items} total={total} />
          </div>
        </div>
      </div>
    </div>
  );
} 