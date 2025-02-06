import { prisma } from '@/lib/db'
import type { Collection, CollectionProduct, Product } from '@prisma/client'


interface GetCollectionsOptions {
  featured?: boolean
  active?: boolean
}

type CollectionWithProducts = Collection & {
  products: (CollectionProduct & {
    product: Product
  })[]
}

export async function getCollections(options: GetCollectionsOptions = {}): Promise<CollectionWithProducts[]> {
  const { featured, active = true } = options

  const collections = await prisma.collection.findMany({
    where: {
      featured: featured === undefined ? undefined : featured,
      active: active === undefined ? undefined : active,
    },
    include: {
      products: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return collections
}

export async function getCollectionById(id: string): Promise<CollectionWithProducts | null> {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  })
}

export async function createCollection(data: {
  name: string
  description: string
  image?: string
  price: number
  featured?: boolean
  active?: boolean
  products: { productId: string; quantity: number }[]
}) {
  return prisma.collection.create({
    data: {
      ...data,
      products: {
        create: data.products.map(p => ({
          quantity: p.quantity,
          product: {
            connect: { id: p.productId }
          }
        }))
      }
    },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  })
}

export async function updateCollection(
  id: string,
  data: {
    name?: string
    description?: string
    image?: string
    price?: number
    featured?: boolean
    active?: boolean
    products?: { productId: string; quantity: number }[]
  }
) {
  const { products, ...rest } = data

  // First update the collection details
  await prisma.collection.update({
    where: { id },
    data: rest
  })

  // If products are provided, update them
  if (products) {
    // Delete existing products
    await prisma.collectionProduct.deleteMany({
      where: { collectionId: id }
    })

    // Add new products
    await prisma.collection.update({
      where: { id },
      data: {
        products: {
          create: products.map(p => ({
            quantity: p.quantity,
            product: {
              connect: { id: p.productId }
            }
          }))
        }
      }
    })
  }

  return getCollectionById(id)
}

export async function deleteCollection(id: string) {
  return prisma.collection.delete({
    where: { id }
  })
} 