'use client';

import { Link } from '@/i18n/routing'
import type { Order } from '@prisma/client';

export function CustomerOrders({
  orders,
  customerId,
}: {
  orders: Order[];
  customerId: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-norse text-xl">Recent Orders</h2>
        {orders.length > 0 && (
          <Link
            href={`/admin/orders?customer=${customerId}`}
            className="text-amber-600 hover:text-amber-700"
          >
            View all
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 text-stone-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            No orders yet
          </h3>
          <p className="text-stone-600">
            This customer hasn&apos;t placed any orders.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block p-4 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-stone-500">
                    {new Date(order.createdAt).toLocaleString('no-NO')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {new Intl.NumberFormat('no-NO', {
                      style: 'currency',
                      currency: 'NOK',
                    }).format(Number(order.total))}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'PROCESSING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-stone-100 text-stone-800'
                    }`}
                  >
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 