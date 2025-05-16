"use server"
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { User, Profile } from '@prisma/client'
import { hash } from 'bcryptjs'

export type UserWithProfile = User & {
  profile: Profile | null
}

export const isAdmin = async () => {
    const session = await auth();
    if (!session?.user) {
        return false;
    }
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });
    return user?.role === 'ADMIN';
}

export async function getUserById(id: string): Promise<UserWithProfile | null> {
    
    const admin = await isAdmin();
    if (!admin) {
        return null;
    }

    return prisma.user.findUnique({
        where: { id },
        include: { profile: true, orders: true, subscriptions: true, newsletterSubscriptions: true }
    })
}

export async function getUserByEmail(email: string): Promise<UserWithProfile | null> {
    const admin = await isAdmin();
    if (!admin) {
        return null;
    }
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })
}

export async function createUser(data: {
  email: string
  password: string
  name?: string
  image?: string
}): Promise<UserWithProfile | null> {
    const admin = await isAdmin();
    if (!admin) {
        return null;
    }
  const hashedPassword = await hash(data.password, 10)
  
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      image: data.image,
      profile: {
        create: {
          marketingConsent: true,
          notifications: true
        }
      }
    },
    include: { profile: true }
  })
}

export async function updateUserProfile(userId: string, data: Partial<Profile>): Promise<Profile | null> {
    const admin = await isAdmin();
    if (!admin) {
        return null;
    }
  return prisma.profile.update({
    where: { userId },
    data
  })
}

export async function updateUserEmail(userId: string, email: string): Promise<User | null> {
    const admin = await isAdmin();
    if (!admin) {
        return null;
    }
  return prisma.user.update({
    where: { id: userId },
    data: { email }
  })
}

export async function updateUserPassword(userId: string, password: string): Promise<User | null> {
    const admin = await isAdmin();
    if (!admin) {
        return null;
    }
  const hashedPassword = await hash(password, 10)
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })
} 