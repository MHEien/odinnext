'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { Address } from '@prisma/client';

interface ShippingFormProps {
  initialData: Address;
  onSubmit: (data: Address) => void;
}

export default function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const t = useTranslations('Checkout.shipping');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <h2 className="font-norse text-2xl text-stone-100 mb-6">{t('title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-stone-300 mb-2">
            {t('firstName')}
          </label>
          <input
            type="text"
            id="firstName"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-stone-300 mb-2">
            {t('lastName')}
          </label>
          <input
            type="text"
            id="lastName"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-stone-300 mb-2">
            {t('phone')}
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="street" className="block text-sm font-medium text-stone-300 mb-2">
          {t('street')}
        </label>
        <input
          type="text"
          id="street"
          required
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
            focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-stone-300 mb-2">
            {t('city')}
          </label>
          <input
            type="text"
            id="city"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-stone-300 mb-2">
            {t('state')}
          </label>
          <input
            type="text"
            id="state"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-stone-300 mb-2">
            {t('postalCode')}
          </label>
          <input
            type="text"
            id="postalCode"
            required
            value={formData.postalCode}
            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-stone-300 mb-2">
          {t('country')}
        </label>
        <input
          type="text"
          id="country"
          required
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
            focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sameAsBilling"
            checked={sameAsBilling}
            onChange={(e) => setSameAsBilling(e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-600 rounded"
          />
          <label htmlFor="sameAsBilling" className="ml-2 text-sm text-stone-300">
            {t('sameAsBilling')}
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="saveInfo"
            checked={saveInfo}
            onChange={(e) => setSaveInfo(e.target.checked)}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-600 rounded"
          />
          <label htmlFor="saveInfo" className="ml-2 text-sm text-stone-300">
            {t('saveInfo')}
          </label>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
            hover:to-amber-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {t('continue')}
        </button>
      </div>
    </motion.form>
  );
} 