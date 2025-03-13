'use client';

import { useTranslations } from 'next-intl';
import type { CustomerWithStats } from '@/lib/db/actions/customers';

interface CustomerHeaderProps {
  customer: CustomerWithStats;
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  const t = useTranslations('Admin.Customers.details');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
      <h1 className="text-2xl font-bold">{t('title')}</h1>
      <p className="text-stone-600">{customer.name || customer.email}</p>
    </div>
  );
} 