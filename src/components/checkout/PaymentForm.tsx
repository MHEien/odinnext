'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PaymentMethod, validatePaymentMethod } from '@/app/lib/mock/checkout';

interface PaymentFormProps {
  initialData: PaymentMethod;
  onSubmit: (data: PaymentMethod) => void;
  onBack: () => void;
}

export default function PaymentForm({
  initialData,
  onSubmit,
  onBack,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentMethod>(initialData);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validatePaymentMethod(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'expiryMonth' || name === 'expiryYear'
        ? parseInt(value, 10)
        : value,
    }));
    setErrors([]);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {errors.length > 0 && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label
            htmlFor="cardBrand"
            className="block text-sm font-medium text-stone-700"
          >
            Card Type
          </label>
          <select
            id="cardBrand"
            name="cardBrand"
            value={formData.cardBrand}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">Select card type</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
            <option value="amex">American Express</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="last4"
            className="block text-sm font-medium text-stone-700"
          >
            Card Number
          </label>
          <input
            type="text"
            id="last4"
            name="last4"
            value={formData.last4}
            onChange={handleChange}
            placeholder="•••• •••• •••• ••••"
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="expiryMonth"
              className="block text-sm font-medium text-stone-700"
            >
              Expiry Month
            </label>
            <select
              id="expiryMonth"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month.toString().padStart(2, '0')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="expiryYear"
              className="block text-sm font-medium text-stone-700"
            >
              Expiry Year
            </label>
            <select
              id="expiryYear"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="cvv"
            className="block text-sm font-medium text-stone-700"
          >
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            placeholder="•••"
            maxLength={4}
            className="mt-1 w-32 rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 rounded-lg bg-stone-100 text-stone-900 font-medium hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Review Order
        </button>
      </div>
    </motion.form>
  );
} 