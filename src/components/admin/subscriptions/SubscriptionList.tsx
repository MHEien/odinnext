'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import type { Subscription, User, Product, Collection } from '@prisma/client'
import { useTranslations } from 'next-intl'

type ExtendedSubscription = Subscription & {
  user: User & {
    profile: {
      shippingStreet: string | null
      shippingCity: string | null
      shippingState: string | null
      shippingPostalCode: string | null
      shippingCountry: string | null
    } | null
  }
  items: {
    product: Product
    quantity: number
  }[]
  collection: Collection | null
}

interface SubscriptionListProps {
  subscriptions: ExtendedSubscription[]
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

export function SubscriptionList({ subscriptions: initialSubscriptions }: SubscriptionListProps) {
  const [subscriptions] = useState(initialSubscriptions)
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'cancelled'>('all')

  const t = useTranslations('Admin.Subscriptions')

  const filteredSubscriptions = filter === 'all' 
    ? subscriptions 
    : subscriptions.filter(sub => sub.status.toLowerCase() === filter)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Filters */}
      <motion.div variants={itemVariants} className="flex gap-4 mb-6">
        {(['all', 'active', 'paused', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t(`Status.${status}`)}
          </button>
        ))}
      </motion.div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.map((subscription) => (
          <motion.div
            key={subscription.id}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-stone-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : subscription.status === 'PAUSED'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase()}
                </span>
                <Link
                  href={`/admin/subscriptions/${subscription.id}`}
                  className="text-sm text-amber-600 hover:text-amber-700"
                >
                  View Details
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">
                    {subscription.user.name || 'Unnamed User'}
                  </h3>
                  <p className="text-sm text-stone-500">
                    {subscription.user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-500">{t('nextDelivery')}</p>
                  <p className="font-medium">
                    {new Date(subscription.nextDelivery).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-500">{t('nextDelivery')}</p>
                  <p className="font-medium">
                    {subscription.frequency.charAt(0) + subscription.frequency.slice(1).toLowerCase()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-stone-500">Type</p>
                  <p className="font-medium">
                    {subscription.type === 'COLLECTION' 
                      ? `${t('Type.collection')} ${subscription.collection?.name}`
                      : t('Type.custom')}
                  </p>
                </div>

                {subscription.user.profile && (
                  <div>
                    <p className="text-sm text-stone-500">{t('shippingAddress')}</p>
                    <p className="text-sm">
                      {[
                        subscription.user.profile.shippingStreet,
                        subscription.user.profile.shippingCity,
                        subscription.user.profile.shippingState,
                        subscription.user.profile.shippingPostalCode,
                        subscription.user.profile.shippingCountry
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 