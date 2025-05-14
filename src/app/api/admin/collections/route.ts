import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().optional().nullable(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive('Quantity must be a positive integer')
    })
  ).min(1, 'At least one product is required')
})

export async function GET() {
  const session = await auth()
  
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id
    },
    select: {
      role: true
    }
  })

  if (!session?.user || user?.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const collections = await prisma.collection.findMany({
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id
    },
    select: {
      role: true
    }
  })

  if (!session?.user || user?.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const validatedData = collectionSchema.parse(body)
    
    // Create the collection and its product relationships in a transaction
    const collection = await prisma.$transaction(async (tx) => {
      // Create collection
      const collection = await tx.collection.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          image: validatedData.image,
          price: validatedData.price,
          featured: validatedData.featured,
          active: validatedData.active,
        }
      })
      
      // Create collection-product relationships
      for (const product of validatedData.products) {
        await tx.collectionProduct.create({
          data: {
            collectionId: collection.id,
            productId: product.productId,
            quantity: product.quantity
          }
        })
      }
      
      return collection
    })
    
    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    console.error('Error creating collection:', error)
    
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
      return NextResponse.json({ error: 'Validation error', details: errors }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id
    },
    select: {
      role: true
    }
  })

  if (!session?.user || user?.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Collection ID is required' }, { status: 400 })
    }
    
    await prisma.collection.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
} 
