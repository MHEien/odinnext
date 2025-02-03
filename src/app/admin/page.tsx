'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  DashboardMetrics,
  SalesTrend,
  ActivityItem,
  getDashboardMetrics,
  getSalesTrends,
  getRecentActivity,
  formatLargeNumber,
  formatRevenue,
  formatDate,
  getActivityIcon,
  getActivityColor,
} from '@/lib/mock/analytics';
import SalesChart from '@/components/admin/SalesChart';

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

const metrics = [
  {
    name: 'Total Revenue',
    key: 'totalRevenue' as const,
    format: formatRevenue,
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
    name: 'Total Orders',
    key: 'totalOrders' as const,
    format: formatLargeNumber,
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
    name: 'Average Order',
    key: 'averageOrderValue' as const,
    format: (value: number) => `${formatLargeNumber(value)} kr`,
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
    name: 'Active Subscriptions',
    key: 'activeSubscriptions' as const,
    format: formatLargeNumber,
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
];

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(
    null
  );
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metrics, trends, activity] = await Promise.all([
          getDashboardMetrics(),
          getSalesTrends(),
          getRecentActivity(),
        ]);

        setDashboardData(metrics);
        setSalesTrends(trends);
        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading || !dashboardData) {
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
          <h1 className="font-display text-3xl">Dashboard</h1>
          <p className="text-stone-600">Overview of your store&apos;s performance</p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}
                >
                  {metric.icon}
                </div>
                <span className="text-sm font-medium text-stone-500">
                  {metric.name}
                </span>
              </div>
              <div className="mt-4 text-2xl font-bold">
                {metric.format(dashboardData[metric.key])}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Sales Chart */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl">Sales Trends</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <span className="text-sm text-stone-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-stone-600">Orders</span>
              </div>
            </div>
          </div>
          <SalesChart data={salesTrends} />
        </motion.div>

        {/* Top Products & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-xl mb-6">Top Products</h2>
            <div className="space-y-4">
              {dashboardData.topSellingProducts.map((product) => (
                <Link
                  key={product.product.id}
                  href={`/admin/products/${product.product.id}`}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <Image
                        src={product.product.image}
                        alt={product.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{product.product.name}</h3>
                      <p className="text-sm text-stone-500">
                        {formatLargeNumber(product.totalSales)} sales
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-primary-600">
                    {formatRevenue(product.revenue)}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-display text-xl mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${getActivityColor(
                      activity.type
                    )}`}
                  >
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
                        d={getActivityIcon(activity.type)}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{activity.action}</h3>
                    <p className="text-sm text-stone-500">{activity.details}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 