'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  Order,
  OrderStatus,
  getOrderById,
  updateOrderStatus,
  updateTrackingNumber,
  getStatusColor,
  formatStatus,
  formatDate,
  formatPrice,
} from '@/lib/mock/orders';
import { useToast } from '@/lib/hooks/useToast';

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

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingTracking, setEditingTracking] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  const showToast = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(params.id);
        if (!data) {
          router.push('/admin/orders');
          return;
        }
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, router]);

  const handleStatusChange = async (status: OrderStatus) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      showToast.loading('Updating order status...');
      const updatedOrder = await updateOrderStatus(order.id, status);
      setOrder(updatedOrder);
      showToast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast.error('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTrackingUpdate = async () => {
    if (!order || !editingTracking) return;

    try {
      setIsUpdating(true);
      showToast.loading('Updating tracking number...');
      const updatedOrder = await updateTrackingNumber(order.id, editingTracking);
      setOrder(updatedOrder);
      setEditingTracking(null);
      showToast.success('Tracking number updated successfully');
    } catch (error) {
      console.error('Error updating tracking number:', error);
      showToast.error('Failed to update tracking number');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusTimeline = [
    { status: 'pending', date: order.createdAt },
    { status: 'processing', date: order.updatedAt },
    { status: 'shipped', date: order.shippedAt },
    { status: 'delivered', date: order.deliveredAt },
    { status: 'cancelled', date: order.cancelledAt },
    { status: 'refunded', date: order.refundedAt },
  ].filter((item) => item.date);

  const statuses: OrderStatus[] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ];

  return (
    <div className="p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-start">
          <div>
            <button
              onClick={() => router.push('/admin/orders')}
              className="text-stone-600 hover:text-primary-600 mb-4"
            >
              ← Back to Orders
            </button>
            <h1 className="font-display text-3xl">Order {order.id}</h1>
            <p className="text-stone-600">
              Created on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex gap-4">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg text-sm ${getStatusColor(
                order.status
              )} border-0 focus:ring-2 focus:ring-primary-600`}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Order Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-8"
          >
            {/* Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-stone-600">
                        {item.product.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-stone-600">
                        {item.quantity} × ${formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>${formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Tax</span>
                    <span>${formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span>${formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>${formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-4">Timeline</h2>
              <div className="space-y-4">
                {statusTimeline.map((item, index) => (
                  <div
                    key={item.status}
                    className="flex items-start gap-4"
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        index === statusTimeline.length - 1
                          ? 'bg-primary-600'
                          : 'bg-stone-400'
                      }`}
                    />
                    <div>
                      <p className="font-medium">
                        {formatStatus(item.status as OrderStatus)}
                      </p>
                      <p className="text-sm text-stone-600">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-4">Customer</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-stone-600">
                    Shipping Address
                  </h3>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-600">
                    Payment Method
                  </h3>
                  <p>
                    {order.paymentMethod.type === 'credit_card'
                      ? `Credit Card ending in ${order.paymentMethod.last4}`
                      : 'PayPal'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-4">Tracking</h2>
              {editingTracking !== null ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editingTracking}
                    onChange={(e) => setEditingTracking(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    placeholder="Enter tracking number"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleTrackingUpdate}
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTracking(null)}
                      className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() =>
                    setEditingTracking(order.trackingNumber || '')
                  }
                  className="w-full px-4 py-2 text-left text-stone-600 hover:text-primary-600"
                >
                  {order.trackingNumber || 'Add tracking number'}
                </button>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-4">Notes</h2>
              {editingNotes !== null ? (
                <div className="space-y-4">
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    rows={4}
                    placeholder="Add notes about this order"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        if (!order) return;
                        try {
                          setIsUpdating(true);
                          showToast.loading('Updating order notes...');
                          const updatedOrder = await updateOrderStatus(
                            order.id,
                            order.status,
                            editingNotes || undefined
                          );
                          setOrder(updatedOrder);
                          setEditingNotes(null);
                          showToast.success('Notes updated successfully');
                        } catch (error) {
                          console.error('Error updating notes:', error);
                          showToast.error('Failed to update notes');
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                      disabled={isUpdating}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingNotes(null)}
                      className="px-4 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingNotes(order.notes || '')}
                  className="w-full px-4 py-2 text-left text-stone-600 hover:text-primary-600"
                >
                  {order.notes || 'Add notes'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 