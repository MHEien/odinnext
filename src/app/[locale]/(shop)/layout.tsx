import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { auth } from '@/auth';
import { prisma } from '@/lib/db';

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await auth();
  let userData;
  if (user) {
    userData = await prisma.user.findUnique({
      where: {
        id: user?.user.id,
    },
    select: {
        role: true,
      },
    });
  }

  return (
    <CartProvider>
    <div className="flex min-h-screen flex-col">
      <Header isAdmin={userData?.role === 'ADMIN'} />
      <main className="flex-grow pt-6">{children}</main>
      <Footer />
    </div>
    </CartProvider>
  );
} 