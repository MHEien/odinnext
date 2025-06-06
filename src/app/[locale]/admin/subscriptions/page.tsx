import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SubscriptionList } from '@/components/admin/subscriptions/SubscriptionList'
import { getTranslations } from 'next-intl/server'

export default async function AdminSubscriptionsPage() {
  const session = await auth()

  const t = await getTranslations('Admin.Subscriptions')
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        include: {
          profile: true
        }
      },
      items: {
        include: {
          product: true
        }
      },
      collection: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-norse text-4xl mb-8">{t('title')}</h1>
        <SubscriptionList subscriptions={subscriptions} />
      </div>
    </div>
  )
} 