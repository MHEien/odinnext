'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { CartItem } from '@/lib/context/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  const t = useTranslations('Cart');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-stone-800/50 rounded-lg p-6 border border-stone-700 sticky top-4"
    >
      <h2 className="text-xl font-semibold text-stone-100 mb-6">
        {t('orderSummary')}
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-stone-100">
                {item.name}
              </h3>
              <p className="text-sm text-stone-400">
                {t('quantity')}: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-medium text-amber-500">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        <div className="border-t border-stone-700 pt-4 mt-4">
          <div className="flex justify-between text-stone-300">
            <span>{t('summary.subtotal')}</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-stone-300 mt-2">
            <span>{t('summary.shipping')}</span>
            <span>{t('summary.shippingMessage')}</span>
          </div>
          <div className="flex justify-between text-lg font-medium text-stone-100 mt-4">
            <span>{t('total')}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 