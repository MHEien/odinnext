'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Address, validateAddress } from '@/app/lib/mock/checkout';

interface ShippingFormProps {
  initialData: Address;
  onSubmit: (data: Address) => void;
}

export default function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState<Address>(initialData);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAddress(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    setErrors([]);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-stone-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-stone-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-stone-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-stone-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="street"
            className="block text-sm font-medium text-stone-700"
          >
            Street Address
          </label>
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-stone-700"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-stone-700"
          >
            State / Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-stone-700"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-stone-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          Continue to Billing
        </button>
      </div>
    </motion.form>
  );
} 