import { Order } from './orders';
import { Product } from './products';

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeSubscriptions: number;
  totalCustomers: number;
  newCustomersThisMonth: number;
  topSellingProducts: Array<{
    product: Product;
    totalSales: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}

export interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
}

export interface ActivityItem {
  id: string;
  type: 'order' | 'subscription' | 'product' | 'customer';
  action: string;
  details: string;
  timestamp: string;
  metadata?: {
    orderId?: string;
    productId?: string;
    customerId?: string;
    subscriptionId?: string;
    amount?: number;
  };
}

// Mock data generation helpers
function generateSalesTrends(): SalesTrend[] {
  const trends: SalesTrend[] = [];
  const now = new Date();
  
  // Generate daily trends for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate some realistic-looking data with weekly patterns
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseRevenue = isWeekend ? 800 : 1200;
    const baseOrders = isWeekend ? 15 : 25;
    
    trends.push({
      date: date.toISOString().split('T')[0],
      revenue: baseRevenue + Math.random() * 500,
      orders: Math.floor(baseOrders + Math.random() * 10),
    });
  }
  
  return trends;
}

function generateRecentActivity(): ActivityItem[] {
  return [
    {
      id: 'act_1',
      type: 'order',
      action: 'New Order',
      details: 'New order #ORD-123 for $156.99',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      metadata: {
        orderId: 'ORD-123',
        amount: 156.99,
      },
    },
    {
      id: 'act_2',
      type: 'subscription',
      action: 'Subscription Updated',
      details: 'Customer modified delivery frequency',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      metadata: {
        subscriptionId: 'SUB-456',
        customerId: 'CUS-789',
      },
    },
    {
      id: 'act_3',
      type: 'product',
      action: 'Stock Alert',
      details: "Thor's Thunder is running low on stock",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      metadata: {
        productId: 'thor-thunder',
      },
    },
    {
      id: 'act_4',
      type: 'customer',
      action: 'New Customer',
      details: 'New customer registration',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      metadata: {
        customerId: 'CUS-101',
      },
    },
    {
      id: 'act_5',
      type: 'order',
      action: 'Order Shipped',
      details: 'Order #ORD-122 has been shipped',
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
      metadata: {
        orderId: 'ORD-122',
      },
    },
  ];
}

// API functions
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalRevenue: 45678.90,
    totalOrders: 789,
    averageOrderValue: 57.89,
    activeSubscriptions: 234,
    totalCustomers: 567,
    newCustomersThisMonth: 45,
    topSellingProducts: [
      {
        product: {
          id: 'thor-thunder',
          name: "Thor's Thunder",
          description: 'Dark chocolate with sea salt and popping candy.',
          longDescription: 'Experience the power of Thor in every bite with this premium dark chocolate bar. The combination of crunchy sea salt and explosive popping candy creates a thunderous sensation that would make the God of Thunder himself proud.',
          price: 12.99,
          image: '/images/thor-thunder.jpg',
          category: 'dark',
          ingredients: ['Dark Chocolate', 'Sea Salt', 'Popping Candy'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: true,
          inStock: true,
          nutritionalInfo: {
            calories: 500,
            protein: 10,
            carbohydrates: 50,
            fat: 30,
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        totalSales: 156,
        revenue: 2025.44,
      },
      {
        product: {
          id: 'freya-delight',
          name: "Freya's Delight",
          description: 'Milk chocolate with honey and lavender.',
          longDescription: 'A delicate blend inspired by the Norse goddess of love and beauty. This milk chocolate bar is infused with sweet honey and calming lavender, creating a harmonious balance that would please Freya herself.',
          price: 14.99,
          image: '/images/freya-delight.jpg',
          category: 'milk',
          ingredients: ['Milk Chocolate', 'Honey', 'Lavender'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: false,
          inStock: true,
          nutritionalInfo: {
            calories: 520,
            protein: 8,
            carbohydrates: 55,
            fat: 32,
          },
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
        totalSales: 134,
        revenue: 2008.66,
      },
    ],
    recentOrders: [],
  };
}

export async function getSalesTrends(): Promise<SalesTrend[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateSalesTrends();
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateRecentActivity();
}

// Utility functions
export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatRevenue(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NOK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.floor(
      (new Date(date).getTime() - new Date().getTime()) / (1000 * 60)
    ),
    'minutes'
  );
}

export function getActivityIcon(type: ActivityItem['type']): string {
  switch (type) {
    case 'order':
      return 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z';
    case 'subscription':
      return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
    case 'product':
      return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
    case 'customer':
      return 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z';
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
}

export function getActivityColor(type: ActivityItem['type']): string {
  switch (type) {
    case 'order':
      return 'bg-blue-100 text-blue-600';
    case 'subscription':
      return 'bg-purple-100 text-purple-600';
    case 'product':
      return 'bg-yellow-100 text-yellow-600';
    case 'customer':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-stone-100 text-stone-600';
  }
} 