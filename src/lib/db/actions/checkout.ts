"use server"

import { prisma } from '@/lib/db'
import { Order } from '@prisma/client'
import { auth } from '@/auth'
import { createOrder } from './orders'
import { CheckoutData } from '@/types'

export async function processCheckout(data: CheckoutData): Promise<Order> {
  const session = await auth()
  
  // Create the order with proper models
  let order: Order;
  
  if (session?.user?.email) {
    // Logged in user flow
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { profile: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Create the order with user ID
    order = await createOrder({
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
  } else {
    // Guest user flow
    order = await createOrder({
      // No userId for guest orders
      items: data.items,
      shippingAddress: data.shippingAddress,
      billingAddress: data.billingAddress,
      paymentMethod: data.paymentMethod
    })
  }

  return order
}
