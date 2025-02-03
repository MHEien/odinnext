import { Product, ProductCategory, mockProducts as products } from './products';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeSubscriptions: number;
  newCustomers: number;
  topProducts: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
  recentActivity: {
    id: string;
    type: 'order' | 'subscription' | 'product' | 'user';
    action: string;
    details: string;
    timestamp: string;
  }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
}

// Mock admin user
const mockAdminUser: AdminUser = {
  id: 'admin_1',
  name: 'Odin Allfather',
  email: 'odin@valhalla.com',
  role: 'super_admin',
  avatar: '/images/admin-avatar.jpg',
};

// Mock admin stats
const mockStats: AdminStats = {
  totalRevenue: 158432.99,
  totalOrders: 1247,
  activeSubscriptions: 342,
  newCustomers: 89,
  topProducts: [
    {
      id: 'thor-thunder',
      name: "Thor's Thunder",
      sales: 456,
      revenue: 5923.44,
    },
    {
      id: 'freya-fusion',
      name: "Freya's Fusion",
      sales: 389,
      revenue: 5831.11,
    },
    {
      id: 'odin-wisdom',
      name: "Odin's Wisdom",
      sales: 367,
      revenue: 5133.33,
    },
  ],
  recentActivity: [
    {
      id: 'act_1',
      type: 'order',
      action: 'New Order',
      details: 'Order #1234 placed for $129.99',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    },
    {
      id: 'act_2',
      type: 'subscription',
      action: 'Subscription Paused',
      details: 'Customer paused Warrior\'s Chest subscription',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    },
    {
      id: 'act_3',
      type: 'product',
      action: 'Stock Update',
      details: 'Thor\'s Thunder inventory updated to 150 units',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 'act_4',
      type: 'user',
      action: 'New Customer',
      details: 'New customer registration: thor@asgard.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    },
  ],
};

export async function getAdminUser(): Promise<AdminUser | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockAdminUser;
}

export async function getAdminStats(): Promise<AdminStats> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockStats;
}

export function formatRevenue(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getActivityIcon(type: AdminStats['recentActivity'][0]['type']): string {
  switch (type) {
    case 'order':
      return 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z';
    case 'subscription':
      return 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15';
    case 'product':
      return 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4';
    case 'user':
      return 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z';
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  }
}

export function getActivityColor(type: AdminStats['recentActivity'][0]['type']): string {
  switch (type) {
    case 'order':
      return 'text-green-500 bg-green-100';
    case 'subscription':
      return 'text-purple-500 bg-purple-100';
    case 'product':
      return 'text-blue-500 bg-blue-100';
    case 'user':
      return 'text-yellow-500 bg-yellow-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}

// Product Management
export interface AdminProductUpdate {
  name?: string;
  description?: string;
  longDescription?: string;
  price?: number;
  category?: ProductCategory; // Remove 'assorted' from union type
  ingredients?: string[];
  allergens?: string[];
  weight?: number;
  inStock?: boolean;
  featured?: boolean;
  image?: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
  };
}

export async function updateProduct(
  productId: string,
  updates: AdminProductUpdate
): Promise<Product> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) throw new Error('Product not found');

  products[productIndex] = {
    ...products[productIndex],
    ...updates,
  };

  // Add to recent activity
  mockStats.recentActivity.unshift({
    id: `act_${Date.now()}`,
    type: 'product',
    action: 'Product Updated',
    details: `${products[productIndex].name} was updated`,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 activities
  mockStats.recentActivity = mockStats.recentActivity.slice(0, 50);

  return products[productIndex];
}

export async function createProduct(
  data: Omit<Product, 'id'>
): Promise<Product> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newProduct: Product = {
    id: `prod_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
  };

  products.push(newProduct);

  // Add to recent activity
  mockStats.recentActivity.unshift({
    id: `act_${Date.now()}`,
    type: 'product',
    action: 'Product Created',
    details: `New product "${newProduct.name}" was created`,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 activities
  mockStats.recentActivity = mockStats.recentActivity.slice(0, 50);

  return newProduct;
}

export async function deleteProduct(productId: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) throw new Error('Product not found');

  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);

  // Add to recent activity
  mockStats.recentActivity.unshift({
    id: `act_${Date.now()}`,
    type: 'product',
    action: 'Product Deleted',
    details: `${deletedProduct.name} was deleted`,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 activities
  mockStats.recentActivity = mockStats.recentActivity.slice(0, 50);
}

export async function updateProductStock(
  productId: string,
  inStock: boolean
): Promise<Product> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) throw new Error('Product not found');

  products[productIndex] = {
    ...products[productIndex],
    inStock,
  };

  // Add to recent activity
  mockStats.recentActivity.unshift({
    id: `act_${Date.now()}`,
    type: 'product',
    action: 'Stock Updated',
    details: `${products[productIndex].name} is now ${inStock ? 'in stock' : 'out of stock'}`,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 activities
  mockStats.recentActivity = mockStats.recentActivity.slice(0, 50);

  return products[productIndex];
}

export async function toggleProductFeatured(
  productId: string
): Promise<Product> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) throw new Error('Product not found');

  const newFeaturedState = !products[productIndex].featured;
  products[productIndex] = {
    ...products[productIndex],
    featured: newFeaturedState,
  };

  // Add to recent activity
  mockStats.recentActivity.unshift({
    id: `act_${Date.now()}`,
    type: 'product',
    action: 'Featured Status Updated',
    details: `${products[productIndex].name} is ${newFeaturedState ? 'now' : 'no longer'} featured`,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 activities
  mockStats.recentActivity = mockStats.recentActivity.slice(0, 50);

  return products[productIndex];
} 