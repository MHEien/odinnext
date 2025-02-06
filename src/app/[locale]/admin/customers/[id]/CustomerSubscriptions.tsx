'use client';

import { Link } from '@/i18n/routing'
import type { User } from '@prisma/client';

type CustomerWithSubscriptions = User & {
  activeSubscriptions: number;
};

export function CustomerSubscriptions({
  customer,
}: {
  customer: CustomerWithSubscriptions;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-norse text-xl">Active Subscriptions</h2>
        {customer.activeSubscriptions > 0 && (
          <Link
            href={`/admin/subscriptions?customer=${customer.id}`}
            className="text-amber-600 hover:text-amber-700"
          >
            View all
          </Link>
        )}
      </div>

      {customer.activeSubscriptions === 0 ? (
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <h3 className="text-lg font-medium text-stone-900 mb-2">
            No active subscriptions
          </h3>
          <p className="text-stone-600">
            This customer doesn&apos;t have any active subscriptions.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-stone-600">
            Subscription management coming soon...
          </p>
        </div>
      )}
    </div>
  );
} 