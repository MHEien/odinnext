"use server"

import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import type { Order, OrderItem, Address, PaymentMethod } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { serializeModel } from '@/lib/utils/prisma-helpers'

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: {
      name: string
      images: string[]
    }
  })[]
  shippingAddress?: Address | null
  billingAddress?: Address | null
  paymentMethod: PaymentMethod
}

export type OrderWithDetails = Order & {
  items: (OrderItem & {
    product: {
      name: string
      images: string[]
    }
  })[]
  user: {
    name: string | null
    email: string
  }
}

type AddressInput = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

type PaymentMethodInput = {
  type: string
  cardBrand: string
  last4: string
  expiryMonth: number
  expiryYear: number
}

interface OrderCreateInput {
  userId?: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  shippingAddress?: AddressInput
  billingAddress?: AddressInput
  paymentMethod: PaymentMethodInput
}

export async function createOrder(data: OrderCreateInput): Promise<Order> {
  const total = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return await prisma.$transaction(async (tx) => {
    let shippingAddressId: string | undefined = undefined;
    let billingAddressId: string | undefined = undefined;

    // Create shipping address if provided
    if (data.shippingAddress) {
      const shippingAddress = await tx.address.create({
        data: data.shippingAddress
      });
      shippingAddressId = shippingAddress.id;
    }

    // Create billing address if provided
    if (data.billingAddress) {
      const billingAddress = await tx.address.create({
        data: data.billingAddress
      });
      billingAddressId = billingAddress.id;
    }

    // Create payment method
    const paymentMethod = await tx.paymentMethod.create({
      data: data.paymentMethod
    })

    // Create the order data structure
    const orderData: Prisma.OrderCreateInput = {
      total: new Prisma.Decimal(total),
      paymentMethod: { connect: { id: paymentMethod.id } },
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: new Prisma.Decimal(item.price)
        }))
      }
    }

    // Add address relations if available
    if (shippingAddressId) {
      orderData.shippingAddress = { connect: { id: shippingAddressId } };
    }
    
    if (billingAddressId) {
      orderData.billingAddress = { connect: { id: billingAddressId } };
    }

    // Only add the user relation if userId is provided
    if (data.userId) {
      orderData.user = { connect: { id: data.userId } }
    }

    // Create order
    const order = await tx.order.create({
      data: orderData,
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                images: true
              }
            }
          }
        },
        shippingAddress: true,
        billingAddress: true,
        paymentMethod: true
      }
    })

    return order
  })
}

export async function getOrders(): Promise<OrderWithDetails[]> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Serialize Decimal values to numbers for client usage
  return serializeModel(orders) as OrderWithDetails[]
}

export async function getOrder(id: string): Promise<OrderWithDetails | null> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true
            }
          }
        }
      },
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  })

  // Serialize Decimal values to numbers for client usage
  return order ? serializeModel(order) as OrderWithDetails : null
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status }
  })

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${id}`)
  return order
}

export async function deleteOrder(id: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  await prisma.order.delete({
    where: { id }
  })

  revalidatePath('/admin/orders')
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true
            }
          }
        }
      },
      shippingAddress: true,
      billingAddress: true,
      paymentMethod: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  // Serialize Decimal values to numbers for client usage
  return serializeModel(orders) as OrderWithItems[]
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true
            }
          }
        }
      },
      shippingAddress: true,
      billingAddress: true,
      paymentMethod: true
    }
  })
  
  // Serialize Decimal values to numbers for client usage
  return order ? serializeModel(order) as OrderWithItems : null
}

export async function cancelOrder(id: string): Promise<Order> {
  return prisma.order.update({
    where: { id },
    data: { status: 'CANCELLED' }
  })
}