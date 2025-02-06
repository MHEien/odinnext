'use server'

import { prisma } from '@/lib/db'
import { auth } from '../../../auth'
import { revalidatePath } from 'next/cache'
import type { User } from '@prisma/client'

export type CustomerWithStats = User & {
  totalOrders: number
  totalSpent: number
  activeSubscriptions: number
  profile: {
    id: string
    userId: string
    phone: string | null
    shippingStreet: string | null
    shippingCity: string | null
    shippingState: string | null
    shippingPostalCode: string | null
    shippingCountry: string | null
    billingStreet: string | null
    billingCity: string | null
    billingState: string | null
    billingPostalCode: string | null
    billingCountry: string | null
    marketingConsent: boolean
    notifications: boolean
  } | null
}

export async function getCustomers(): Promise<CustomerWithStats[]> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const users = await prisma.user.findMany({
    include: {
      profile: true
    }
  })
  const [orders, subscriptions] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: {
          in: users.map(u => u.id)
        },
        status: {
          not: 'CANCELLED'
        }
      }
    }),
    prisma.subscription.findMany({
      where: {
        userId: {
          in: users.map(u => u.id)
        },
        status: 'ACTIVE'
      }
    })
  ])

  return users.map(user => {
    const userOrders = orders.filter(order => order.userId === user.id)
    const userSubscriptions = subscriptions.filter(sub => sub.userId === user.id)
    
    return {
      ...user,
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, order) => sum + Number(order.total), 0),
      activeSubscriptions: userSubscriptions.length
    }
  })
}

export async function getCustomer(id: string): Promise<CustomerWithStats | null> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true
    }
  })

  if (!user) {
    return null
  }

  const [orders, subscriptions] = await Promise.all([
    prisma.order.findMany({
      where: {
        userId: id,
        status: {
          not: 'CANCELLED'
        }
      }
    }),
    prisma.subscription.findMany({
      where: {
        userId: id,
        status: 'ACTIVE'
      }
    })
  ])

  return {
    ...user,
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + Number(order.total), 0),
    activeSubscriptions: subscriptions.length
  }
}

export async function deleteCustomer(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  await prisma.user.delete({
    where: { id }
  })

  revalidatePath('/admin/customers')
} 