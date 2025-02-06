import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ClientAdminLayout } from './ClientAdminLayout'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect('/auth/sign-in')
  }

  // Fetch complete user data including role
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/sign-in')
  }

  return <ClientAdminLayout user={user}>{children}</ClientAdminLayout>
} 