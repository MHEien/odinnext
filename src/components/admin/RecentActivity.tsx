'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/routing'
import type { User } from '@prisma/client'
import { formatRevenue } from '@/lib/utils/shared-format'
import { useTranslations } from 'next-intl'

interface ActivityItem {
  type: 'order' | 'subscription'
  id: string
  user: User
  amount?: number
  status: string
  date: Date
}

interface ActivityType {
  icon: string
  color: string
}

interface RecentActivityProps {
  activity: ActivityItem[]
  activityTypes: Record<'order' | 'subscription', ActivityType>
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

export function RecentActivity({ activity, activityTypes }: RecentActivityProps) {
  const t = useTranslations('Admin')
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg shadow-sm p-6 border border-stone-200"
    >
      <h2 className="font-norse text-2xl mb-6">{t('recentActivity')}</h2>
      <div className="space-y-4">
        {activity.map((item) => (
          <motion.div
            key={`${item.type}-${item.id}`}
            variants={itemVariants}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activityTypes[item.type].color}`}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={activityTypes[item.type].icon}
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <Link
                  href={`/admin/${item.type}s/${item.id}`}
                  className="font-medium hover:text-amber-600"
                >
                  New {item.type}
                </Link>
                <span className="text-sm text-stone-500">
                  {item.amount && formatRevenue(item.amount)}
                </span>
              </div>
              <p className="text-sm text-stone-600">
                by {item.user.name || item.user.email}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-stone-500">
                  {new Date(item.date).toLocaleString('no-NO', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'ACTIVE' || item.status === 'DELIVERED'
                    ? 'bg-green-100 text-green-800'
                    : item.status === 'PAUSED' || item.status === 'PROCESSING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
} 