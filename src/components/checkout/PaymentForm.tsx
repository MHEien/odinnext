'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { PaymentMethod } from '@/lib/db/actions';

interface PaymentFormProps {
  initialData: PaymentMethod;
  onSubmit: (data: PaymentMethod) => void;
  onBack: () => void;
}

export default function PaymentForm({ initialData, onSubmit, onBack }: PaymentFormProps) {
  const [formData, setFormData] = useState(initialData);
  const t = useTranslations('Checkout.payment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-norse text-2xl text-stone-100 mb-6">{t('title')}</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-stone-300 mb-2">
            {t('cardNumber')}
          </label>
          <input
            type="text"
            id="cardNumber"
            required
            pattern="[0-9]{16}"
            placeholder="1234 5678 9012 3456"
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-stone-300 mb-2">
            {t('cardName')}
          </label>
          <input
            type="text"
            id="cardName"
            required
            className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
              focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-stone-300 mb-2">
              {t('expiry')}
            </label>
            <input
              type="text"
              id="expiry"
              required
              pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
              placeholder="MM/YY"
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
                focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-stone-300 mb-2">
              {t('cvc')}
            </label>
            <input
              type="text"
              id="cvc"
              required
              pattern="[0-9]{3,4}"
              placeholder="123"
              className="w-full bg-stone-700 border border-stone-600 rounded-lg px-4 py-2 text-stone-100 
                focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 rounded-lg bg-stone-700 text-stone-100 font-medium 
            hover:bg-stone-600 transition-colors"
        >
          {t('back')}
        </button>
        <button
          type="submit"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 
            hover:from-amber-500 hover:to-amber-600 text-white font-medium transition-colors"
        >
          {t('continue')}
        </button>
      </div>
    </form>
  );
} 