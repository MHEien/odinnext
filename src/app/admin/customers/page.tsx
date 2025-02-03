'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  UserProfile,
  UserFilters,
  getFilteredUsers,
  formatUserDate,
  formatUserAmount,
} from '@/lib/mock/users';
import { useToast } from '@/lib/hooks/useToast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'orders', label: 'Total Orders' },
  { value: 'spent', label: 'Total Spent' },
  { value: 'joined', label: 'Join Date' },
] as const;

export default function CustomersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    sortBy: 'joined',
    sortOrder: 'desc',
  });
  const showToast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getFilteredUsers(filters);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        showToast.error('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [filters, showToast]);

  const handleFilterChange = (
    name: keyof UserFilters,
    value: string | boolean | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="font-display text-3xl">Customers</h1>
          <p className="text-stone-600">Manage your customer accounts</p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Search
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search customers..."
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'sortBy',
                    e.target.value as UserFilters['sortBy']
                  )
                }
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) =>
                  handleFilterChange(
                    'sortOrder',
                    e.target.value as UserFilters['sortOrder']
                  )
                }
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Filter
              </label>
              <select
                value={filters.hasSubscription === undefined ? '' : filters.hasSubscription.toString()}
                onChange={(e) =>
                  handleFilterChange(
                    'hasSubscription',
                    e.target.value === ''
                      ? undefined
                      : e.target.value === 'true'
                  )
                }
                className="w-full rounded-lg border border-stone-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">All Customers</option>
                <option value="true">With Subscription</option>
                <option value="false">Without Subscription</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Users Grid */}
        <motion.div variants={itemVariants}>
          {users.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-stone-900 mb-2">
                No customers found
              </h3>
              <p className="text-stone-600">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/customers/${user.id}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-100">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <svg
                            className="w-full h-full text-stone-400 p-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-stone-500">{user.email}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-stone-500">Total Orders</p>
                          <p className="font-medium">{user.stats.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-sm text-stone-500">Total Spent</p>
                          <p className="font-medium">
                            {formatUserAmount(user.stats.totalSpent)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      {user.stats.activeSubscriptions > 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">
                          Active Subscription
                        </span>
                      )}
                      <span className="text-xs text-stone-400">
                        Joined {formatUserDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
} 