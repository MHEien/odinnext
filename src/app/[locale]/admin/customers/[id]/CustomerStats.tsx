'use client';

import { useTranslations } from 'next-intl';
import type { CustomerWithStats } from '@/lib/db/actions/customers';

interface CustomerStatsProps {
  customer: CustomerWithStats;
}

export function CustomerStats({ customer }: CustomerStatsProps) {
  const t = useTranslations('Admin.Customers.details.stats');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
      <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-stone-500">{t('totalOrders')}</p>
          <p className="text-2xl font-semibold">{customer.totalOrders}</p>
        </div>
        <div>
          <p className="text-sm text-stone-500">{t('totalSpent')}</p>
          <p className="text-2xl font-semibold">
            {new Intl.NumberFormat('no-NO', {
              style: 'currency',
              currency: 'NOK'
            }).format(customer.totalSpent)}
          </p>
        </div>
        <div>
          <p className="text-sm text-stone-500">{t('averageOrderValue')}</p>
          <p className="text-2xl font-semibold">
            {new Intl.NumberFormat('no-NO', {
              style: 'currency',
              currency: 'NOK'
            }).format(customer.totalOrders ? customer.totalSpent / customer.totalOrders : 0)}
          </p>
        </div>
        <div>
          <p className="text-sm text-stone-500">{t('activeSubscriptions')}</p>
          <p className="text-2xl font-semibold">{customer.activeSubscriptions}</p>
        </div>
      </div>
    </div>
  );
} 