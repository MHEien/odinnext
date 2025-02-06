import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import AccountDashboard from './AccountDashboard'

export default async function AccountPage() {
  const session = await auth()
  const t = await getTranslations('Account')
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AccountDashboard 
          profile={{
            ...profile,
            name: profile.user.name ?? 'Unknown',
            email: profile.user.email ?? ''
          }}
          translations={{
            welcome: {
              title: t('welcome.title'),
              greeting: t('welcome.greeting', { name: profile.user.name })
            },
            profile: {
              title: t('profile.title'),
              edit: t('profile.edit'),
              name: t('profile.name'),
              email: t('profile.email'),
              phone: t('profile.phone'),
              shippingAddress: t('profile.shippingAddress')
            },
            orders: {
              title: t('orders.title'),
              viewAll: t('orders.viewAll'),
              noOrders: t('orders.noOrders'),
              startShopping: t('orders.startShopping')
            },
            subscriptions: {
              title: t('subscriptions.title'),
              manage: t('subscriptions.manage'),
              noSubscriptions: t('subscriptions.noSubscriptions'),
              explorePlans: t('subscriptions.explorePlans')
            },
            preferences: {
              title: t('preferences.title'),
              marketingEmails: t('preferences.marketingEmails'),
              orderNotifications: t('preferences.orderNotifications'),
              on: t('preferences.on'),
              off: t('preferences.off')
            }
          }}
        />
      </div>
    </div>
  )
} 