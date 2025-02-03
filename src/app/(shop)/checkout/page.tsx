'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/components/cart/CartProvider';
import { useToast } from '@/lib/hooks/useToast';
import { Address, PaymentMethod, createOrder } from '@/app/lib/mock/checkout';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';

type CheckoutStep = 'shipping' | 'billing' | 'payment' | 'review';

export default function CheckoutPage() {
  const { cart, products, refreshCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
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
  const showToast = useToast();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <svg
            className="w-16 h-16 text-stone-400 mx-auto mb-6"
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
          <h1 className="font-display text-3xl text-stone-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-stone-600 mb-8">
            Add some legendary chocolate to your cart before proceeding to checkout.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            Browse Products
          </a>
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
    if (!cart) return;

    setIsProcessing(true);
    try {
      const order = await createOrder(cart, {
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.sameAsShipping
          ? formData.shippingAddress
          : formData.billingAddress,
        paymentMethod: formData.paymentMethod,
        sameAsShipping: formData.sameAsShipping,
        saveInfo: formData.saveInfo,
      });

      // Clear cart and redirect to success page
      await refreshCart();
      window.location.href = `/orders/${order.id}/success`;
    } catch (err) {
      console.error('Error placing order:', err);
      showToast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <h1 className="font-display text-3xl text-stone-900 mb-8">
              Checkout
            </h1>

            {/* Steps */}
            <div className="space-y-8">
              {/* Step indicators */}
              <div className="flex items-center justify-between">
                {['shipping', 'payment', 'review'].map((step) => (
                  <div
                    key={step}
                    className={`flex items-center ${
                      step === currentStep
                        ? 'text-primary-600'
                        : 'text-stone-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === currentStep
                          ? 'bg-primary-600 text-white'
                          : 'bg-stone-100'
                      }`}
                    >
                      {/* Step number */}
                      {['shipping', 'payment', 'review'].indexOf(step) + 1}
                    </div>
                    <span className="ml-2 font-medium capitalize">{step}</span>
                  </div>
                ))}
              </div>

              {/* Form steps */}
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Review content */}
                  <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    <div>
                      <h2 className="font-display text-xl text-stone-900 mb-4">
                        Shipping Address
                      </h2>
                      <div className="text-stone-600">
                        <p>{formData.shippingAddress.firstName} {formData.shippingAddress.lastName}</p>
                        <p>{formData.shippingAddress.street}</p>
                        <p>
                          {formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.postalCode}
                        </p>
                        <p>{formData.shippingAddress.country}</p>
                      </div>
                    </div>

                    <div>
                      <h2 className="font-display text-xl text-stone-900 mb-4">
                        Payment Method
                      </h2>
                      <div className="text-stone-600">
                        <p className="capitalize">{formData.paymentMethod.cardBrand}</p>
                        <p>•••• •••• •••• {formData.paymentMethod.last4}</p>
                        <p>
                          Expires {formData.paymentMethod.expiryMonth.toString().padStart(2, '0')}/
                          {formData.paymentMethod.expiryYear}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="px-8 py-3 rounded-lg bg-stone-100 text-stone-900 font-medium hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center space-x-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          <span>Processing...</span>
                        </span>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <OrderSummary cart={cart} products={products} />
          </div>
        </div>
      </div>
    </div>
  );
} 