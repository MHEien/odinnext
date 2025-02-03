'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Order,
  OrderStatus,
  getAllOrders,
  updateOrderStatus,
  updateTrackingNumber,
  getStatusColor,
  formatStatus,
  formatDate,
  formatPrice,
} from '@/lib/mock/orders';

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

const statuses: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [editingTracking, setEditingTracking] = useState<{
    orderId: string;
    value: string;
  } | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      setIsUpdating(orderId);
      const updatedOrder = await updateOrderStatus(orderId, status);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleTrackingUpdate = async (orderId: string) => {
    if (!editingTracking || editingTracking.orderId !== orderId) return;

    try {
      setIsUpdating(orderId);
      const updatedOrder = await updateTrackingNumber(orderId, editingTracking.value);
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
      setEditingTracking(null);
    } catch (error) {
      console.error('Error updating tracking number:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders
    .filter((order) =>
      selectedStatus === 'all' ? true : order.status === selectedStatus
    )
    .filter((order) =>
      searchQuery
        ? order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.shippingAddress.street
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.shippingAddress.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true
    );

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
          <h1 className="font-display text-3xl">Orders</h1>
          <p className="text-stone-600">Manage customer orders and shipments.</p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStatus === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                    Tracking
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-stone-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-stone-900">
                          {order.shippingAddress.street}
                        </p>
                        <p className="text-stone-500">
                          {order.shippingAddress.city},{' '}
                          {order.shippingAddress.state}{' '}
                          {order.shippingAddress.postalCode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        {order.items.map((item) => (
                          <div key={item.product.id}>
                            {item.quantity}x {item.product.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <p className="font-medium">
                          ${formatPrice(order.total)}
                        </p>
                        <p className="text-stone-500">
                          ${formatPrice(order.subtotal)} + ${formatPrice(order.tax)}{' '}
                          tax
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        disabled={isUpdating === order.id}
                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                          order.status
                        )} border-0 focus:ring-2 focus:ring-primary-600`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {editingTracking?.orderId === order.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingTracking.value}
                            onChange={(e) =>
                              setEditingTracking({
                                orderId: order.id,
                                value: e.target.value,
                              })
                            }
                            className="input-field text-sm py-1"
                            placeholder="Enter tracking number"
                          />
                          <button
                            onClick={() => handleTrackingUpdate(order.id)}
                            disabled={isUpdating === order.id}
                            className="p-1 text-primary-600 hover:text-primary-700"
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditingTracking(null)}
                            className="p-1 text-stone-600 hover:text-stone-700"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setEditingTracking({
                              orderId: order.id,
                              value: order.trackingNumber || '',
                            })
                          }
                          className="text-sm text-stone-600 hover:text-primary-600"
                        >
                          {order.trackingNumber || 'Add tracking'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <p>{formatDate(order.createdAt)}</p>
                        {order.shippedAt && (
                          <p className="text-stone-500">
                            Shipped: {formatDate(order.shippedAt)}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-12 bg-white rounded-xl"
          >
            <p className="text-stone-600">
              No orders found. Try adjusting your filters.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 