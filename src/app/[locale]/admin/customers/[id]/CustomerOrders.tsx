'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Order } from '@prisma/client';

interface CustomerOrdersProps {
  orders: Order[];
}

export function CustomerOrders({ orders }: CustomerOrdersProps) {
  const t = useTranslations('Admin.Customers.details.orders');

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
        <h2 className="text-xl font-semibold mb-4">{t('title')}</h2>
        <p className="text-stone-500">{t('noOrders')}</p>
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
                {t('table.orderNumber')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500">
                {t('table.date')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500">
                {t('table.status')}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-stone-500">
                {t('table.total')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-4 text-sm">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    #{order.id}
                  </Link>
                </td>
                <td className="px-4 py-4 text-sm text-stone-500">
                  {new Intl.DateTimeFormat('no-NO').format(new Date(order.createdAt))}
                </td>
                <td className="px-4 py-4 text-sm">
                  <span className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-600 rounded-full">
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm">
                  {new Intl.NumberFormat('no-NO', {
                    style: 'currency',
                    currency: 'NOK'
                  }).format(Number(order.total))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 