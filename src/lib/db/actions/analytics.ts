'use server'

import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function getDashboardMetrics() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const [
    totalRevenue,
    totalOrders,
    activeSubscriptions,
    topProducts
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: {
        total: true
      }
    }),
    prisma.order.count(),
    prisma.subscription.count({
      where: {
        status: 'ACTIVE'
      }
    }),
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5,
      where: {
        order: {
          status: {
            not: 'CANCELLED'
          }
        }
      }
    }).then(async (items) => {
      const productIds = items.map(item => item.productId)
      const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      })
      return items.map(item => ({
        product: products.find(p => p.id === item.productId)!,
        totalSold: item._sum.quantity || 0
      }))
    })
  ])

  const averageOrderValue = totalRevenue._sum.total && totalOrders 
    ? Number(totalRevenue._sum.total) / totalOrders 
    : 0

  return {
    totalRevenue: Number(totalRevenue._sum.total || 0),
    totalOrders,
    averageOrderValue,
    activeSubscriptions,
    topSellingProducts: topProducts
  }
}

export async function getSalesTrends() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo
      }
    },
    select: {
      total: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  })

  // Group by date
  const dailyTrends = orders.reduce((acc, order) => {
    const date = order.createdAt.toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = {
        date,
        revenue: 0,
        orders: 0
      }
    }
    acc[date].revenue += Number(order.total)
    acc[date].orders += 1
    return acc
  }, {} as Record<string, { date: string; revenue: number; orders: number }>)

  // Fill in missing dates
  const trends = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    trends.push(dailyTrends[dateStr] || {
      date: dateStr,
      revenue: 0,
      orders: 0
    })
  }

  return trends
}

export async function getRecentActivity() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const [recentOrders, recentSubscriptions] = await Promise.all([
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    }),
    prisma.subscription.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    })
  ])

  const activity = [
    ...recentOrders.map(order => ({
      type: 'order' as const,
      id: order.id,
      user: order.user,
      amount: Number(order.total),
      status: order.status,
      date: order.createdAt
    })),
    ...recentSubscriptions.map(sub => ({
      type: 'subscription' as const,
      id: sub.id,
      user: sub.user,
      status: sub.status,
      date: sub.createdAt
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5)

  return activity
}
