import Image from 'next/image';
import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion';
import type { Prisma } from '@prisma/client';
import { getOrderById } from '@/lib/db/actions/orders';
import { StatusSelect } from './StatusSelect';
import { getTranslations } from 'next-intl/server';

// Improved date validation and formatting
function formatDate(date: Date | null | undefined | object) {
  // Check if date is null, undefined, an empty object, or not a valid date
  if (!date || 
      (typeof date === 'object' && Object.keys(date).length === 0) || 
      (date instanceof Date && isNaN(date.getTime()))) {
    return 'N/A';
  }
  
  try {
    // Convert to Date if it's not already
    const dateObj = date instanceof Date ? date : new Date(date as unknown as string);
    
    // Validate the date is valid before formatting
    if (isNaN(dateObj.getTime())) {
      return 'N/A';
    }
    
    return dateObj.toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'N/A';
  }
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

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({
  params,
}: Props) {
  const { id } = await params
  const order = await getOrderById(id);
  const t = await getTranslations('Admin')
  
  if (!order) {
    return <div className="p-8">Order not found</div>;
  }

  // Handle cases where items or product might be undefined
  const orderItems = order.items || [];
  
  // Safely create status timeline with fallback dates
  // Create a default date for statuses if the order doesn't have valid timestamps
  const defaultDate = new Date(); // Use current date as fallback
  
  // Get valid dates or use fallbacks
  const createdAt = (order.createdAt && 
                    !(typeof order.createdAt === 'object' && Object.keys(order.createdAt).length === 0)) 
                    ? order.createdAt : defaultDate;
                    
  const updatedAt = (order.updatedAt && 
                    !(typeof order.updatedAt === 'object' && Object.keys(order.updatedAt).length === 0)) 
                    ? order.updatedAt : defaultDate;
  
  const statusTimeline = [
    { status: 'PENDING', date: createdAt },
    { status: 'PROCESSING', date: updatedAt },
    { status: 'SHIPPED', date: updatedAt },
    { status: 'DELIVERED', date: updatedAt },
    { status: 'CANCELLED', date: updatedAt },
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
            <Link
              href="/admin/orders"
              className="inline-block text-stone-600 hover:text-primary-600 mb-4"
            >
              ← {t('orders.backToOrders')}
            </Link>
            <h1 className="font-display text-3xl">{t('orders.orderTitle', { id: order.id })}</h1>
            <p className="text-stone-600">
              {t('orders.createdOn', { date: formatDate(createdAt) })}
            </p>
          </div>
          <div className="flex gap-4">
            {/* Only render StatusSelect if order is valid */}
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
              <h2 className="font-display text-xl mb-4">{t('orders.items')}</h2>
              <div className="space-y-4">
                {orderItems.map((item) => {
                  const productImage = item.product && item.product.images && item.product.images.length > 0 
                    ? item.product.images[0] 
                    : '/placeholder.png';
                  
                  const productName = item.product ? item.product.name : 'Product Not Available';
                  
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg"
                    >
                      <div className="relative w-16 h-16">
                        <Image
                          src={productImage}
                          alt={productName}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{productName}</h3>
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
                  );
                })}
                
                {orderItems.length === 0 && (
                  <div className="p-4 bg-stone-50 rounded-lg text-center">
                    No items found
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>{t('orders.total')}</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-display text-xl mb-4">{t('orders.timeline')}</h2>
              <div className="space-y-4">
                {statusTimeline.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-start gap-4"
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        order.status === item.status
                          ? 'bg-primary-600'
                          : 'bg-stone-400'
                      }`}
                    />
                    <div>
                      <p className="font-medium">
                        {t(`orders.status.${item.status.toLowerCase()}`)}
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
              <h2 className="font-display text-xl mb-4">{t('orders.customer')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-stone-600">
                    {t('orders.shippingAddress')}
                  </h3>
                  {order.shippingAddress ? (
                    <>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </>
                  ) : (
                    <p>No shipping address provided</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-600">
                    {t('orders.paymentMethod')}
                  </h3>
                  {order.paymentMethod ? (
                    <p>
                      {order.paymentMethod.type === 'card' && order.paymentMethod.cardBrand && order.paymentMethod.last4
                        ? t('orders.cardEnding', { 
                            brand: order.paymentMethod.cardBrand,
                            last4: order.paymentMethod.last4 
                          })
                        : order.paymentMethod.type}
                    </p>
                  ) : (
                    <p>No payment method provided</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}