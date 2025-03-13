"use server"

import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import type { Product, Prisma } from '@prisma/client'

export type ProductWithStats = Omit<Product, 'price'> & {
  price: number
  totalOrders: number
  totalRevenue: number
}

export interface NutritionalInfo {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
}

export async function getPublicProducts(): Promise<Product[]> {


  const products = await prisma.product.findMany()

  return products
}

export async function getProducts(): Promise<ProductWithStats[]> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const products = await prisma.product.findMany()
  const orderItems = await prisma.orderItem.findMany({
    where: {
      productId: {
        in: products.map(p => p.id)
      },
      order: {
        status: {
          not: 'CANCELLED'
        }
      }
    },
    include: {
      order: true
    }
  })

  return products.map(product => {
    const items = orderItems.filter(item => item.productId === product.id)
    return {
      ...product,
      price: Number(product.price),
      totalOrders: items.length,
      totalRevenue: items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
    }
  })
}

export async function getProduct(id: string): Promise<ProductWithStats | null> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  })

  if (!product) {
    return null
  }

  const orderItems = await prisma.orderItem.findMany({
    where: {
      productId: id,
      order: {
        status: {
          not: 'CANCELLED'
        }
      }
    },
    include: {
      order: true
    }
  })

  return {
    ...product,
    price: Number(product.price),
    totalOrders: orderItems.length,
    totalRevenue: orderItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  }
}

export async function createProduct(data: Prisma.ProductCreateInput) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      nutritionalInfo: data.nutritionalInfo as Prisma.InputJsonValue
    }
  })

  revalidatePath('/admin/products')
  return product
}

export async function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...data,
      nutritionalInfo: data.nutritionalInfo as Prisma.InputJsonValue
    }
  })

  revalidatePath('/admin/products')
  revalidatePath(`/admin/products/${id}`)
  return product
}

export async function deleteProduct(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  await prisma.product.delete({
    where: { id }
  })

  revalidatePath('/admin/products')
}

export async function updateStock(id: string, quantity: number): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: {
      stock: {
        increment: quantity
      }
    }
  })
}

export async function searchProducts(query: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }
  })
}

export async function getCategories() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  return prisma.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })
} 