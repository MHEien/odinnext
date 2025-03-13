'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import type { CustomerWithStats } from '@/lib/db/actions/customers'

interface CustomerListProps {
  customers: CustomerWithStats[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function CustomerList({ customers }: CustomerListProps) {
  const t = useTranslations('Admin.Customers.list')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {customers.map((customer) => (
        <motion.div
          key={customer.id}
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm p-6 border border-stone-200"
        >
          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-stone-100">
              {customer.image && (
                <Image
                  src={customer.image}
                  alt={customer.name || customer.email || ''}
                  fill
                  className="object-cover"
                />
              )}
              {!customer.image && (
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
            <div>
              <h3 className="font-medium">{customer.name || customer.email || t('anonymous')}</h3>
              {customer.name && customer.email && (
                <p className="text-sm text-stone-500">{customer.email}</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-stone-500">{t('totalOrders')}</p>
                <p className="font-medium">{customer.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">{t('totalSpent')}</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('no-NO', {
                    style: 'currency',
                    currency: 'NOK'
                  }).format(customer.totalSpent)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {customer.activeSubscriptions > 0 && (
                <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">
                  {customer.activeSubscriptions} {customer.activeSubscriptions > 1 
                    ? t('activeSubscriptionsPlural') 
                    : t('activeSubscriptions')}
                </span>
              )}
            </div>
            <Link
              href={`/admin/customers/${customer.id}`}
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              {t('viewDetails')} →
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 