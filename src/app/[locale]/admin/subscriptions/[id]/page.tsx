import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { getSubscriptionById } from '@/lib/db/actions/subscriptions'
import { SubscriptionDetail } from '@/components/admin/subscriptions/SubscriptionDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminSubscriptionDetailPage({ params }: Props) {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const { id } = await params
  const subscription = await getSubscriptionById(id)
  
  if (!subscription) {
    redirect('/admin/subscriptions')
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <SubscriptionDetail subscription={subscription} />
      </div>
    </div>
  )
} 