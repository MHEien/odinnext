"use server"

import { prisma } from '@/lib/db'
import { Order } from '@prisma/client'
import { auth } from '@/auth'
import { createOrder } from './orders'

export interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PaymentMethod {
  type: 'card'
  cardBrand: string
  last4: string
  expiryMonth: number
  expiryYear: number
}

export interface CheckoutData {
  items: {
    productId: string
    quantity: number
    price: number
  }[]
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
}

export async function processCheckout(data: CheckoutData): Promise<Order> {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error('User must be logged in to checkout')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Here you would typically:
  // 1. Validate stock levels
  // 2. Process payment with Stripe/payment provider
  // 3. Create order
  // 4. Update stock levels
  // 5. Clear cart
  // 6. Send confirmation email

  // Create the order with proper models
  const order = await createOrder({
    userId: user.id,
    items: data.items,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    paymentMethod: data.paymentMethod
  })

  // Update user profile with addresses if they don't exist
  if (!user.profile) {
    await prisma.profile.create({
      data: {
        userId: user.id,
        shippingStreet: data.shippingAddress.street,
        shippingCity: data.shippingAddress.city,
        shippingState: data.shippingAddress.state,
        shippingPostalCode: data.shippingAddress.postalCode,
        shippingCountry: data.shippingAddress.country,
        billingStreet: data.billingAddress.street,
        billingCity: data.billingAddress.city,
        billingState: data.billingAddress.state,
        billingPostalCode: data.billingAddress.postalCode,
        billingCountry: data.billingAddress.country
      }
    })
  } else {
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        shippingStreet: data.shippingAddress.street,
        shippingCity: data.shippingAddress.city,
        shippingState: data.shippingAddress.state,
        shippingPostalCode: data.shippingAddress.postalCode,
        shippingCountry: data.shippingAddress.country,
        billingStreet: data.billingAddress.street,
        billingCity: data.billingAddress.city,
        billingState: data.billingAddress.state,
        billingPostalCode: data.billingAddress.postalCode,
        billingCountry: data.billingAddress.country
      }
    })
  }

  return order
}

// Re-export everything
export * from './checkout' 