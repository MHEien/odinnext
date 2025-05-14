import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import ProductOverview from './components/ProductOverview';
import ProductPerformance from './components/ProductPerformance';
import ProductCollections from './components/ProductCollections';
import ProductOrders from './components/ProductOrders';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Product, Category, OrderItem, Order, Collection, Subscription, SubscriptionItem } from '@prisma/client';
import { Link } from '@/i18n/routing';

type DbProduct = Product & {
  category: Category;
  orderItems: (OrderItem & {
    order: Order;
  })[];
  collectionProducts: {
    collection: Collection;
    quantity: number;
  }[];
  subscriptionItems: (SubscriptionItem & {
    subscription: Subscription | null;
  })[];
};

type ExtendedProduct = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  images: string[];
  stock: number;
  categoryId: string;
  ingredients: string[];
  allergens: string[];
  weight: number;
  featured: boolean;
  inStock: boolean;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  createdAt: Date;
  updatedAt: Date;
  category: Category;
  orderItems: (OrderItem & {
    order: Order;
  })[];
  collectionProducts: {
    collection: Collection;
    quantity: number;
  }[];
  subscriptionItems: (SubscriptionItem & {
    subscription: Subscription | null;
  })[];
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    activeSubscriptions: number;
  };
};

async function getProductDetails(id: string): Promise<ExtendedProduct | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      orderItems: {
        include: {
          order: true
        }
      },
      collectionProducts: {
        include: {
          collection: true
        }
      },
      subscriptionItems: {
        include: {
          subscription: true
        }
      }
    }
  }) as DbProduct | null;

  if (!product) {
    return null;
  }

  // Calculate performance metrics
  const totalOrders = product.orderItems.length;
  const totalRevenue = product.orderItems.reduce((sum: number, item) => sum + (Number(item.price) * item.quantity), 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const activeSubscriptions = product.subscriptionItems.filter(item => item.subscription?.status === 'ACTIVE').length;

  // Convert to ExtendedProduct with serialized price
  const extendedProduct: ExtendedProduct = {
    ...product,
    price: Number(product.price),
    nutritionalInfo: product.nutritionalInfo as {
      calories: number;
      protein: number;
      carbohydrates: number;
      fat: number;
    },
    metrics: {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      activeSubscriptions
    }
  };

  return extendedProduct;
}

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  

  const { id } = await params;

  const session = await auth();
  if (!session?.user) {
    return notFound();
  }

  const t = await getTranslations('Admin.Products');
  const product = await getProductDetails(id);

  if (!product) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display">{product.name}</h1>
        <div className="flex gap-4">
          <Link
            href={`/admin/products/${id}/edit`}
            className="btn-secondary"
          >
            {t('details.editProduct')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Overview */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProductOverview product={product} />
        </Suspense>

        {/* Performance Metrics */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProductPerformance metrics={product.metrics} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Collections */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProductCollections collections={product.collectionProducts} />
        </Suspense>

        {/* Recent Orders */}
        <Suspense fallback={<LoadingSpinner />}>
          <ProductOrders orders={product.orderItems} />
        </Suspense>
      </div>
    </div>
  );
} 