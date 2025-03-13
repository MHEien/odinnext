'use client';

import { useTranslations } from 'next-intl';
import type { CustomerWithStats } from '@/lib/db/actions/customers';

interface CustomerSidebarProps {
  customer: CustomerWithStats;
}

export function CustomerSidebar({ customer }: CustomerSidebarProps) {
  const t = useTranslations('Admin.Customers.details.sidebar');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
      <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">{t('contactInfo')}</h3>
          <div className="space-y-2">
            <p>
              <span className="text-sm text-stone-500">{t('email')}:</span>
              <br />
              {customer.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 