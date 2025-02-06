import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import type { User } from "next-auth"
import type { User as PrismaUser, Profile } from "@prisma/client"
import type { Adapter } from "next-auth/adapters"

interface ExtendedPrismaUser extends PrismaUser {
  profile?: Profile | null
}

interface Credentials {
  email: string
  password: string
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        const { email, password } = credentials as Credentials

        if (!email || !password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { profile: true }
        }) as ExtendedPrismaUser | null

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await compare(
          password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          shippingStreet: user.profile?.shippingStreet ?? null,
          shippingCity: user.profile?.shippingCity ?? null,
          shippingState: user.profile?.shippingState ?? null,
          shippingPostalCode: user.profile?.shippingPostalCode ?? null,
          shippingCountry: user.profile?.shippingCountry ?? null,
          marketingConsent: user.profile?.marketingConsent ?? false,
          notifications: user.profile?.notifications ?? false,
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.shippingStreet = user.shippingStreet
        token.shippingCity = user.shippingCity
        token.shippingState = user.shippingState
        token.shippingPostalCode = user.shippingPostalCode
        token.shippingCountry = user.shippingCountry
        token.marketingConsent = user.marketingConsent
        token.notifications = user.notifications
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.shippingStreet = (token.shippingStreet as string | null) ?? null
        session.user.shippingCity = (token.shippingCity as string | null) ?? null
        session.user.shippingState = (token.shippingState as string | null) ?? null
        session.user.shippingPostalCode = (token.shippingPostalCode as string | null) ?? null
        session.user.shippingCountry = (token.shippingCountry as string | null) ?? null
        session.user.marketingConsent = (token.marketingConsent as boolean) ?? false
        session.user.notifications = (token.notifications as boolean) ?? false
      }
      return session
    }
  }
}) 