'use client';

import { useTranslations } from 'next-intl';
import type { CustomerWithStats } from '@/lib/db/actions/customers';

interface CustomerSubscriptionsProps {
  customer: CustomerWithStats;
}

export function CustomerSubscriptions({ customer }: CustomerSubscriptionsProps) {
  const t = useTranslations('Admin.Customers.details.subscriptions');

  if (customer.activeSubscriptions === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
        <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
        <p className="text-stone-500">{t('noSubscriptions')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
      <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500">
                {t('table.plan')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500">
                {t('table.status')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500">
                {t('table.nextDelivery')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500">
                {t('table.amount')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {/* Subscription data would be mapped here */}
          </tbody>
        </table>
      </div>
    </div>
  );
} 