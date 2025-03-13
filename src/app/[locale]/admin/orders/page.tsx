import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getOrders } from '@/lib/db/actions/orders'
import { OrderList } from '@/components/admin/orders/OrderList'
import { getTranslations } from 'next-intl/server'

export default async function AdminOrders() {
  const session = await auth()

  const t = await getTranslations('Admin')
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const orders = await getOrders()

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-norse text-4xl mb-2">{t('orders.order')}</h1>
          <p className="text-stone-600">{t('manageOrders')}</p>
        </div>

        <OrderList orders={orders} />
      </div>
    </div>
  )
} 