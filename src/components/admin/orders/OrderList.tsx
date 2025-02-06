'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import type { OrderWithDetails } from '@/lib/db/actions/orders'
import { updateOrderStatus } from '@/lib/db/actions/orders'

interface OrderListProps {
  orders: OrderWithDetails[]
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

function getStatusColor(status: string) {
  switch (status) {
    case 'DELIVERED':
      return 'bg-green-100 text-green-800'
    case 'PROCESSING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-stone-100 text-stone-800'
  }
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg shadow-sm border border-stone-200"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Order</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Items</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Total</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {orders.map((order) => (
              <motion.tr
                key={order.id}
                variants={itemVariants}
                className="group hover:bg-stone-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="font-medium">{order.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-stone-900">{order.user.name || order.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded overflow-hidden">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>
                          {item.quantity}x {item.product.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {new Intl.NumberFormat('no-NO', {
                      style: 'currency',
                      currency: 'NOK'
                    }).format(Number(order.total))}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={async (e) => {
                      await updateOrderStatus(order.id, e.target.value as OrderWithDetails['status'])
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)} border-0 focus:ring-2 focus:ring-amber-500`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {new Date(order.createdAt).toLocaleDateString('no-NO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-sm font-medium text-amber-600 hover:text-amber-700"
                  >
                    View Details →
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
} 