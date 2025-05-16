'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Order, OrderItem, Product } from '@prisma/client';
import { useSearchParams } from 'next/navigation';

type ExtendedOrder = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const t = useTranslations('Orders.success');
  const [order, setOrder] = useState<ExtendedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForOrder, setIsWaitingForOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource;
    let retryCount = 0;
    const maxRetries = 5;
    const retryDelay = 2000; // 2 seconds

    const connectEventSource = () => {
      eventSource = new EventSource(`/orders/${id}/status`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'waiting_for_order') {
          setIsWaitingForOrder(true);
        } else if (data.type === 'order_update') {
          setOrder(data.data);
          setIsLoading(false);
          setIsWaitingForOrder(false);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        if (retryCount < maxRetries) {
          setTimeout(() => {
            retryCount++;
            connectEventSource();
          }, retryDelay);
        } else {
          setError('Could not connect to order status updates');
          setIsLoading(false);
        }
      };
    };

    connectEventSource();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [id]);

  if (isLoading || isWaitingForOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Norse-themed loading animation */}
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                className="absolute inset-0 border-4 border-amber-500 rounded-full"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute inset-4 border-4 border-amber-400 rounded-full"
                animate={{
                  rotate: -360,
                  scale: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              {/* Norse rune symbol in the center */}
              <div className="absolute inset-0 flex items-center justify-center text-amber-500 text-4xl font-norse">
                ᚬ
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-100 font-norse">
              {isWaitingForOrder ? t('processing.title') : t('loading.title')}
            </h2>
            <p className="text-stone-400">
              {isWaitingForOrder ? t('processing.message') : t('loading.message')}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-stone-100 font-norse">
              {t('error.title')}
            </h2>
            <p className="text-stone-400">
              {error || t('error.message')}
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 
                hover:from-amber-500 hover:to-amber-600 text-white px-8 py-3 
                rounded-lg font-medium transition-colors"
            >
              {t('actions.continueShopping')}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatePresence>
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <svg
                className="w-24 h-24 text-amber-500 mx-auto mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-stone-100 mb-4 font-norse"
            >
              {t('title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-stone-400 mb-8"
            >
              {t('message')}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-stone-800/50 rounded-lg border border-stone-700 p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-stone-100 mb-6 font-norse">
              {t('details.title')}
            </h2>
            <div className="grid grid-cols-2 gap-6 text-left mb-8">
              <div>
                <h3 className="text-sm font-medium text-stone-400 mb-2">
                  {t('details.orderNumber')}
                </h3>
                <p className="text-stone-100">{order.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-400 mb-2">
                  {t('details.orderDate')}
                </h3>
                <p className="text-stone-100">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-400 mb-2">
                  {t('details.totalAmount')}
                </h3>
                <p className="text-stone-100">
                  ${Number(order.total).toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-400 mb-2">
                  {t('details.status')}
                </h3>
                <p className="text-stone-100 capitalize">
                  {order.status.toLowerCase()}
                </p>
              </div>
            </div>

            {order.items && (
              <>
                <h3 className="text-xl font-bold text-stone-100 mb-4 font-norse">
                  {t('details.items')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex space-x-4"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-stone-100 font-medium">
                          {item.product.name}
                        </h4>
                        <p className="text-stone-400">
                          {t('details.quantity')}: {item.quantity}
                        </p>
                        <p className="text-stone-400">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center space-x-4"
          >
            <Link
              href="/orders"
              className="inline-block bg-stone-700 hover:bg-stone-600 text-white px-8 py-3 
                rounded-lg font-medium transition-colors"
            >
              {t('actions.viewOrders')}
            </Link>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 
                hover:from-amber-500 hover:to-amber-600 text-white px-8 py-3 
                rounded-lg font-medium transition-colors"
            >
              {t('actions.continueShopping')}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 