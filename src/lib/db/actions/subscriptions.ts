"use server"

import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { 
  SubscriptionStatus, 
  Frequency, 
  SubscriptionType 
} from '@prisma/client'

export async function getUserSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
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
}

export async function getSubscriptionById(id: string) {
  return prisma.subscription.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true
        }
      },
      collection: true,
      user: {
        include: {
          profile: true
        }
      }
    }
  })
}

export async function updateSubscriptionStatus(
  id: string, 
  status: SubscriptionStatus
) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const subscription = await prisma.subscription.update({
    where: { id },
    data: { status }
  })

  revalidatePath('/account/subscriptions')
  revalidatePath(`/admin/subscriptions/${id}`)
  return subscription
}

export async function createSubscription(data: {
  userId: string
  frequency: Frequency
  nextDelivery: Date
  type: SubscriptionType
  collectionId?: string
  items?: { productId: string; quantity: number }[]
}) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const subscription = await prisma.subscription.create({
    data: {
      userId: data.userId,
      frequency: data.frequency,
      nextDelivery: data.nextDelivery,
      type: data.type,
      status: 'ACTIVE',
      ...(data.collectionId ? { collectionId: data.collectionId } : {}),
      items: data.items ? {
        createMany: {
          data: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      } : undefined
    },
    include: {
      items: {
        include: {
          product: true
        }
      },
      collection: true
    }
  })

  revalidatePath('/account/subscriptions')
  return subscription
}

export function formatStatus(status: SubscriptionStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export function getFrequencyLabel(frequency: Frequency) {
  switch (frequency) {
    case 'WEEKLY': return 'Weekly'
    case 'BIWEEKLY': return 'Bi-weekly'
    case 'MONTHLY': return 'Monthly'
    default: return frequency
  }
} 