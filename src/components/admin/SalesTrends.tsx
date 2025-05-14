'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface SalesTrend {
  date: string
  revenue: number
  orders: number
}

interface SalesTrendsProps {
  data: SalesTrend[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

export function SalesTrends({ data }: SalesTrendsProps) {

  const t = useTranslations('Admin')
  const tCommon = useTranslations('Common')

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg shadow-sm p-6 border border-stone-200"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-norse text-2xl">{t('salesTrends')}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-600" />
            <span className="text-sm text-stone-600">{tCommon('revenue')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-stone-600">{tCommon('orders')}</span>
          </div>
        </div>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tickFormatter={(value) => new Date(value).toLocaleDateString('no-NO', { 
                month: 'short', 
                day: 'numeric' 
              })}
            />
            <YAxis 
              yAxisId="revenue"
              stroke="#6b7280"
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="orders"
              orientation="right"
              stroke="#6b7280"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
              }}
              formatter={(value: number, name: string) => [
                name === 'revenue' 
                  ? new Intl.NumberFormat('no-NO', { 
                      style: 'currency', 
                      currency: 'NOK' 
                    }).format(value)
                  : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
              labelFormatter={(label) => new Date(label).toLocaleDateString('no-NO', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#9333ea"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
} 