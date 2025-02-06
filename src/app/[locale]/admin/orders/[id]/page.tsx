import Image from 'next/image';
import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion';
import type { Prisma } from '@prisma/client';
import { getOrderById } from '@/lib/db/actions/orders';
import { StatusSelect } from './StatusSelect';

// Utility functions
function formatDate(date: Date | null | undefined) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('no-NO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatPrice(amount: Prisma.Decimal | number | string | null | undefined) {
  if (!amount) return '0';
  const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: 'NOK',
  }).format(num);
}

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

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);

  if (!order) {
    return null;
  }

  const statusTimeline = [
    { status: 'PENDING', date: order.createdAt },
    { status: 'PROCESSING', date: order.updatedAt },
    { status: 'SHIPPED', date: order.updatedAt },
    { status: 'DELIVERED', date: order.updatedAt },
    { status: 'CANCELLED', date: order.updatedAt },
  ].filter((item) => item.date);

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
            <Link
              href="/admin/orders"
              className="inline-block text-stone-600 hover:text-primary-600 mb-4"
            >
              ← Back to Orders
            </Link>
            <h1 className="font-display text-3xl">Order {order.id}</h1>
            <p className="text-stone-600">
              Created on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex gap-4">
            <StatusSelect order={order} />
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
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg"
                  >
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.product.images[0] || '/placeholder.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                      <p className="text-sm text-stone-600">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
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
                        {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
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
                    {order.paymentMethod.type === 'card'
                      ? `${order.paymentMethod.cardBrand} ending in ${order.paymentMethod.last4}`
                      : order.paymentMethod.type}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 