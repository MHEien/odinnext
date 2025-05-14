import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Convert Decimal price to Number before returning
    const serializedProduct = {
      ...product,
      price: Number(product.price),
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        longDescription: body.longDescription,
        price: body.price,
        categoryId: body.categoryId,
        ingredients: body.ingredients,
        allergens: body.allergens,
        weight: body.weight,
        images: body.images,
        inStock: body.inStock,
        featured: body.featured,
        nutritionalInfo: body.nutritionalInfo,
        stock: body.stock ?? 0,
      }
    })

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)

    // Convert Decimal price to Number before returning
    const serializedProduct = {
      ...product,
      price: Number(product.price),
    }

    return NextResponse.json(serializedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id }
    })

    revalidatePath('/admin/products')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 