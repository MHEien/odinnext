import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import SubscriptionList from './SubscriptionList'

export default async function SubscriptionsPage() {
  const session = await auth()
  const t = await getTranslations('Subscriptions')
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    include: {
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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl mb-2">{t('title')}</h1>
          <p className="text-stone-600">
            {t('subtitle')}
          </p>
        </div>

        <SubscriptionList 
          subscriptions={subscriptions} 
        />
      </div>
    </div>
  )
} 