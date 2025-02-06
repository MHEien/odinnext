'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Metric {
  name: string
  key: 'totalRevenue' | 'totalOrders' | 'averageOrderValue' | 'activeSubscriptions'
  formatType: 'revenue' | 'number' | 'currency'
  icon: ReactNode
  color: string
}

interface DashboardMetricsProps {
  metrics: Metric[]
  data: Record<Metric['key'], string>
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

export function DashboardMetrics({ metrics, data }: DashboardMetricsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.key}
          variants={itemVariants}
          className="bg-white rounded-lg shadow-sm p-6 border border-stone-200"
        >
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 ${metric.color} rounded-lg flex items-center justify-center`}>
              {metric.icon}
            </div>
            <span className="text-sm font-medium text-stone-500">
              {metric.name}
            </span>
          </div>
          <div className="mt-4 text-2xl font-bold">
            {data[metric.key]}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
} 