'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import { useRouter} from '@/i18n/routing'
import type { Subscription, User, Product, Collection, Profile } from '@prisma/client'
import { updateSubscriptionStatus, formatStatus, getFrequencyLabel } from '@/lib/db/actions/subscriptions'

type ExtendedSubscription = Subscription & {
  user: User & {
    profile: Profile | null
  }
  items: {
    product: Product
    quantity: number
  }[]
  collection: Collection | null
}

interface SubscriptionDetailProps {
  subscription: ExtendedSubscription
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

export function SubscriptionDetail({ subscription: initialSubscription }: SubscriptionDetailProps) {
  const [subscription, setSubscription] = useState(initialSubscription)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleStatusUpdate = async (newStatus: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => {
    if (isUpdating) return

    try {
      setIsUpdating(true)
      const updated = await updateSubscriptionStatus(subscription.id, newStatus)
      setSubscription({ ...subscription, status: updated.status })
    } catch (error) {
      console.error('Error updating subscription:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="text-stone-600 hover:text-amber-600 mb-4 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Subscriptions
          </button>
          <h1 className="font-norse text-4xl mb-2">Subscription Details</h1>
          <p className="text-stone-600">
            {subscription.items.length} items • {getFrequencyLabel(subscription.frequency)}
          </p>
        </div>
        <Link
          href={`/admin/customers/${subscription.userId}`}
          className="text-amber-600 hover:text-amber-700"
        >
          View Customer
        </Link>
      </motion.div>

      {/* Status & Actions */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-norse text-2xl mb-2">Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription.status === 'ACTIVE'
                ? 'bg-green-100 text-green-800'
                : subscription.status === 'PAUSED'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {formatStatus(subscription.status)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {subscription.status === 'ACTIVE' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('PAUSED')}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 disabled:opacity-50"
                >
                  Pause
                </button>
                <button
                  onClick={() => handleStatusUpdate('CANCELLED')}
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}
            {subscription.status === 'PAUSED' && (
              <button
                onClick={() => handleStatusUpdate('ACTIVE')}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 disabled:opacity-50"
              >
                Resume
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Customer Details */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
        <h2 className="font-norse text-2xl mb-4">Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Contact Details</h3>
            <p className="text-lg font-medium">{subscription.user.name}</p>
            <p className="text-stone-600">{subscription.user.email}</p>
          </div>
          {subscription.user.profile && (
            <div>
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <p className="text-stone-600">
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
      </motion.div>

      {/* Subscription Items */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
        <h2 className="font-norse text-2xl mb-4">Items</h2>
        <div className="space-y-4">
          {subscription.items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between p-4 rounded-lg bg-stone-50"
            >
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-stone-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <Link
                href={`/admin/products/${item.product.id}`}
                className="text-amber-600 hover:text-amber-700"
              >
                View Product
              </Link>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subscription Details */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
        <h2 className="font-norse text-2xl mb-4">Delivery Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">Next Delivery</h3>
            <p className="text-lg">
              {new Date(subscription.nextDelivery).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Frequency</h3>
            <p className="text-lg">
              {getFrequencyLabel(subscription.frequency)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Subscription History */}
      <motion.div variants={itemVariants} className="bg-white rounded-lg shadow-sm p-6 border border-stone-200">
        <h2 className="font-norse text-2xl mb-4">History</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Created</h3>
            <p className="text-stone-600">
              {new Date(subscription.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Last Updated</h3>
            <p className="text-stone-600">
              {new Date(subscription.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 