import { Suspense } from 'react';
import { getCustomer } from '@/lib/db/actions/customers';
import { getOrdersByUserId } from '@/lib/db/actions/orders';
import { CustomerHeader } from './CustomerHeader';
import { CustomerStats } from './CustomerStats';
import { CustomerOrders } from './CustomerOrders';
import { CustomerSubscriptions } from './CustomerSubscriptions';
import { CustomerSidebar } from './CustomerSidebar';

export default async function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [customer, orders] = await Promise.all([
    getCustomer(params.id),
    getOrdersByUserId(params.id),
  ]);

  if (!customer) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="space-y-8">
        <Suspense fallback={<div className="h-20 bg-stone-100 animate-pulse rounded-lg" />}>
          <CustomerHeader customer={customer} />
        </Suspense>

        <Suspense fallback={<div className="h-32 bg-stone-100 animate-pulse rounded-lg" />}>
          <CustomerStats customer={customer} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Suspense fallback={<div className="h-64 bg-stone-100 animate-pulse rounded-lg" />}>
              <CustomerOrders orders={orders} />
            </Suspense>

            <Suspense fallback={<div className="h-64 bg-stone-100 animate-pulse rounded-lg" />}>
              <CustomerSubscriptions customer={customer} />
            </Suspense>
          </div>

          <Suspense fallback={<div className="h-96 bg-stone-100 animate-pulse rounded-lg" />}>
            <CustomerSidebar customer={customer} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 