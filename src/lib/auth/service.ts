"use server"
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { AppLocale, defaultLocale } from '@/i18n/config'

export async function createUser(
  email: string, 
  password: string, 
  name: string, 
  options?: { 
    marketingConsent?: boolean,
    newsletterSubscription?: boolean,
    locale?: AppLocale 
  }
) {
  const hashedPassword = await hash(password, 10)
  const locale = options?.locale || defaultLocale
  const marketingConsent = options?.marketingConsent !== undefined ? options.marketingConsent : true
  const newsletterSubscription = options?.newsletterSubscription !== undefined ? options.newsletterSubscription : marketingConsent

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      profile: {
        create: {
          marketingConsent,
          notifications: true,
          locale,
        }
      },
      newsletterSubscriptions: newsletterSubscription ? {
        create: {
          email,
          locale,
          isActive: true
        }
      } : undefined
    },
  })

  return user
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { profile: true }
  })
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    phone?: string
    shippingStreet?: string
    shippingCity?: string
    shippingState?: string
    shippingPostalCode?: string
    shippingCountry?: string
    billingStreet?: string
    billingCity?: string
    billingState?: string
    billingPostalCode?: string
    billingCountry?: string
    marketingConsent?: boolean
    notifications?: boolean
    locale?: string
  }
) {
  const { name, ...profileData } = data

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name,
      profile: {
        update: profileData
      }
    }
  })
} 