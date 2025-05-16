import { prisma } from '@/lib/db'
import type { Collection, CollectionProduct, Product } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { serializeModel } from '@/lib/utils/prisma-helpers'


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

  // Serialize Decimal values to numbers
  return serializeModel(collections)
}

export async function getCollectionById(id: string): Promise<CollectionWithProducts | null> {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  })
  
  // Serialize Decimal values to numbers
  return collection ? serializeModel(collection) : null
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
  const collection = await prisma.collection.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
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
  
  // Serialize Decimal values to numbers
  return serializeModel(collection)
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
  
  // Convert price to Prisma.Decimal if it exists
  const updateData = {
    ...rest,
    ...(rest.price !== undefined ? { price: new Prisma.Decimal(rest.price) } : {})
  }

  // First update the collection details
  await prisma.collection.update({
    where: { id },
    data: updateData
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

  const updatedCollection = await getCollectionById(id)
  
  // Serialize Decimal values to numbers (although getCollectionById already does this)
  return updatedCollection
}

export async function deleteCollection(id: string) {
  return prisma.collection.delete({
    where: { id }
  })
} 