'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ProductPerformanceProps {
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    activeSubscriptions: number;
  };
}

export default function ProductPerformance({ metrics }: ProductPerformanceProps) {
  const t = useTranslations('Admin.Products');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <h2 className="text-xl font-display mb-6">{t('details.performance')}</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Orders */}
        <div className="p-4 bg-stone-50 rounded-lg">
          <p className="text-sm text-stone-500">{t('details.totalOrders')}</p>
          <p className="text-2xl font-medium mt-1">{metrics.totalOrders}</p>
        </div>

        {/* Total Revenue */}
        <div className="p-4 bg-stone-50 rounded-lg">
          <p className="text-sm text-stone-500">{t('details.totalRevenue')}</p>
          <p className="text-2xl font-medium mt-1">
            {formatCurrency(metrics.totalRevenue)}
          </p>
        </div>

        {/* Average Order Value */}
        <div className="p-4 bg-stone-50 rounded-lg">
          <p className="text-sm text-stone-500">{t('details.averageOrderValue')}</p>
          <p className="text-2xl font-medium mt-1">
            {formatCurrency(metrics.averageOrderValue)}
          </p>
        </div>

        {/* Active Subscriptions */}
        <div className="p-4 bg-stone-50 rounded-lg">
          <p className="text-sm text-stone-500">{t('details.subscriptionCount')}</p>
          <p className="text-2xl font-medium mt-1">{metrics.activeSubscriptions}</p>
        </div>
      </div>

      {/* TODO: Add charts for sales trend and stock history */}
      <div className="mt-8 p-8 bg-stone-50 rounded-lg flex items-center justify-center">
        <p className="text-stone-500">Charts coming soon</p>
      </div>
    </motion.div>
  );
} 