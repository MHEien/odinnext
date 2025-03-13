import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { 
  getDashboardMetrics, 
  getSalesTrends, 
  getRecentActivity,
} from '@/lib/db/actions/analytics'
import {
  formatLargeNumber,
  formatRevenue,
} from '@/lib/utils/shared-format'
import { ACTIVITY_TYPES } from '@/lib/constants/ui'
import { DashboardMetrics } from '@/components/admin/DashboardMetrics'
import { SalesTrends } from '@/components/admin/SalesTrends'
import { RecentActivity } from '@/components/admin/RecentActivity'
import {getTranslations} from 'next-intl/server';




export default async function AdminDashboard() {
  const session = await auth()

  const t = await getTranslations('Admin');

  const metrics = [
    {
      name: t('Products.details.totalRevenue'),
      key: 'totalRevenue' as const,
      formatType: 'revenue' as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'text-green-600 bg-green-100',
    },
    {
      name: t('Products.details.totalOrders'),
      key: 'totalOrders' as const,
      formatType: 'number' as const,
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: t('Products.details.averageOrderValue'),
      key: 'averageOrderValue' as const,
      formatType: 'currency' as const,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      name: t('Products.details.averageOrderValue'),
      key: 'activeSubscriptions' as const,
      formatType: 'number' as const,
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: 'text-purple-600 bg-purple-100',
    },
  ]
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const [dashboardData, salesTrends, recentActivity] = await Promise.all([
    getDashboardMetrics(),
    getSalesTrends(),
    getRecentActivity()
  ])

  // Pre-format the dashboard data
  const formattedDashboardData = {
    totalRevenue: formatRevenue(dashboardData.totalRevenue),
    totalOrders: formatLargeNumber(dashboardData.totalOrders),
    averageOrderValue: formatRevenue(dashboardData.averageOrderValue),
    activeSubscriptions: formatLargeNumber(dashboardData.activeSubscriptions)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-norse text-4xl mb-2">{t('dashboard')}</h1>
          <p className="text-stone-600">{t('subTitle')}</p>
        </div>

        <DashboardMetrics metrics={metrics} data={formattedDashboardData} />
        <SalesTrends data={salesTrends} />
        <RecentActivity 
          activity={recentActivity} 
          activityTypes={ACTIVITY_TYPES}
        />
      </div>
    </div>
  )
} 