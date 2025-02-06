'use client';

import { redirect } from 'next/navigation'
import { getOrdersByUserId, type OrderWithItems } from '@/lib/db/actions/orders'
import { auth } from '@/auth'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { prisma } from '@/lib/db'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export default function OrdersPage() {
  const t = useTranslations('Orders')
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const session = await auth()
        if (!session?.user?.email) {
          redirect('/auth/sign-in')
          return
        }

        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        })

        if (!user) {
          redirect('/auth/sign-in')
          return
        }

        const userOrders = await getOrdersByUserId(user.id)
        setOrders(userOrders)
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-stone-100 mb-8 font-norse">
            {t('empty.title')}
          </h1>
          <p className="text-stone-400 mb-8">
            {t('empty.message')}
          </p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 
              hover:to-amber-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {t('empty.action')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-stone-100 mb-8 font-norse">
          {t('title')}
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-stone-800/50 rounded-lg border border-stone-700 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-medium text-stone-100">
                    {t('details.orderNumber', { id: order.id })}
                  </h2>
                  <p className="text-stone-400">
                    {t('details.date', { date: new Date(order.createdAt).toLocaleDateString() })}
                  </p>
                  <p className="text-stone-400">
                    {t('details.status')}: <span className="capitalize">{order.status.toLowerCase()}</span>
                  </p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <p className="text-xl font-medium text-stone-100">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex space-x-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-stone-100 font-medium">
                          {item.product.name}
                        </h3>
                        <p className="text-stone-400">
                          {t('details.quantity')}: {item.quantity}
                        </p>
                        <p className="text-stone-400">
                          {t('details.priceEach', { price: Number(item.price).toFixed(2) })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 