import { redirect } from 'next/navigation'
import { getOrderById } from '@/lib/db/actions/orders'
import { auth } from '@/auth'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'

export default async function OrderSuccessPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user?.email) {
    redirect('/auth/sign-in')
  }

  const order = await getOrderById(params.id)
  if (!order) {
    redirect('/orders')
  }

  const t = await getTranslations('Orders.success')

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              <h3 className="text-sm font-medium text-stone-400 mb-2">{t('details.orderNumber')}</h3>
              <p className="text-stone-100">{order.id}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-stone-400 mb-2">{t('details.orderDate')}</h3>
              <p className="text-stone-100">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-400 mb-2">{t('details.totalAmount')}</h3>
              <p className="text-stone-100">${Number(order.total).toFixed(2)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-400 mb-2">{t('details.status')}</h3>
              <p className="text-stone-100 capitalize">{order.status.toLowerCase()}</p>
            </div>
          </div>

          <div className="border-t border-stone-700 pt-6">
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-x-4"
        >
          <Link
            href="/orders"
            className="inline-block bg-stone-700 hover:bg-stone-600 text-white px-8 py-3 rounded-lg 
              font-medium transition-colors"
          >
            {t('actions.viewOrders')}
          </Link>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
              hover:to-amber-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {t('actions.continueShopping')}
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 