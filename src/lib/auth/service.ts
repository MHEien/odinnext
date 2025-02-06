import { hash } from 'bcrypt'
import { prisma } from '@/lib/db'

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      profile: {
        create: {
          marketingConsent: true,
          notifications: true,
        }
      }
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