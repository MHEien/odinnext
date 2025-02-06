'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Order, OrderItem } from '@prisma/client';

interface ProductOrdersProps {
  orders: (OrderItem & {
    order: Order;
  })[];
}

export default function ProductOrders({ orders }: ProductOrdersProps) {
  const t = useTranslations('Admin.Products');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('no-NO', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h2 className="text-xl font-display mb-6">{t('details.recentOrders')}</h2>
        <p className="text-stone-500">{t('details.noOrders')}</p>
      </motion.div>
    );
  }

  // Sort orders by date, most recent first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime()
  );

  // Take only the 5 most recent orders
  const recentOrders = sortedOrders.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-display">{t('details.recentOrders')}</h2>
        {orders.length > 5 && (
          <a
            href="#"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {t('details.viewAllOrders')}
          </a>
        )}
      </div>

      <div className="space-y-4">
        {recentOrders.map((orderItem) => (
          <motion.div
            key={orderItem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-stone-50 rounded-lg"
          >
            {/* Order Info */}
            <div>
              <p className="font-medium">
                {t('Orders.details.orderNumber', { id: orderItem.orderId })}
              </p>
              <p className="text-sm text-stone-500">
                {new Date(orderItem.order.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Order Details */}
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(Number(orderItem.price) * orderItem.quantity)}
              </p>
              <p className="text-sm text-stone-500">
                {t('Orders.details.quantity')}: {orderItem.quantity}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 