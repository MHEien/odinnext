export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface SubscriptionItem {
  productId: string;
  quantity: number;
}

export interface Subscription {
  id: string;
  userId: string;
  items: SubscriptionItem[];
  frequency: SubscriptionFrequency;
  status: SubscriptionStatus;
  nextDeliveryDate: string;
  lastDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
  pausedAt?: string;
  cancelledAt?: string;
  totalAmount: number;
  shippingAddressId: string;
  paymentMethodId: string;
}

export interface CreateSubscriptionData {
  userId: string;
  items: SubscriptionItem[];
  frequency: SubscriptionFrequency;
  shippingAddressId: string;
  paymentMethodId: string;
}

export interface UpdateSubscriptionData {
  items?: SubscriptionItem[];
  frequency?: SubscriptionFrequency;
  status?: SubscriptionStatus;
  nextDeliveryDate?: string;
  shippingAddressId?: string;
  paymentMethodId?: string;
}

export interface SubscriptionFilters {
  userId?: string;
  status?: SubscriptionStatus;
  frequency?: SubscriptionFrequency;
  sortBy?: 'created' | 'nextDelivery' | 'amount';
  sortOrder?: 'asc' | 'desc';
}

// Mock data
const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    userId: 'user_1',
    items: [
      { productId: 'prod_1', quantity: 2 },
      { productId: 'prod_2', quantity: 1 },
    ],
    frequency: 'monthly',
    status: 'active',
    nextDeliveryDate: '2024-04-15T00:00:00Z',
    lastDeliveryDate: '2024-03-15T00:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    totalAmount: 89.97,
    shippingAddressId: 'addr_1',
    paymentMethodId: 'pm_1',
  },
  {
    id: 'sub_2',
    userId: 'user_3',
    items: [
      { productId: 'prod_3', quantity: 1 },
    ],
    frequency: 'weekly',
    status: 'active',
    nextDeliveryDate: '2024-03-22T00:00:00Z',
    lastDeliveryDate: '2024-03-15T00:00:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    totalAmount: 24.99,
    shippingAddressId: 'addr_3',
    paymentMethodId: 'pm_2',
  },
  {
    id: 'sub_3',
    userId: 'user_1',
    items: [
      { productId: 'prod_4', quantity: 1 },
      { productId: 'prod_5', quantity: 1 },
    ],
    frequency: 'biweekly',
    status: 'paused',
    nextDeliveryDate: '2024-04-01T00:00:00Z',
    lastDeliveryDate: '2024-03-01T00:00:00Z',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    pausedAt: '2024-03-10T00:00:00Z',
    totalAmount: 54.98,
    shippingAddressId: 'addr_1',
    paymentMethodId: 'pm_1',
  },
];

// API functions
export async function getAllSubscriptions(): Promise<Subscription[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockSubscriptions;
}

export async function getSubscriptionById(id: string): Promise<Subscription | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSubscriptions.find((sub) => sub.id === id) || null;
}

export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockSubscriptions.filter((sub) => sub.userId === userId);
}

export async function getFilteredSubscriptions(
  filters: SubscriptionFilters
): Promise<Subscription[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filteredSubs = [...mockSubscriptions];

  // Apply filters
  if (filters.userId) {
    filteredSubs = filteredSubs.filter((sub) => sub.userId === filters.userId);
  }

  if (filters.status) {
    filteredSubs = filteredSubs.filter((sub) => sub.status === filters.status);
  }

  if (filters.frequency) {
    filteredSubs = filteredSubs.filter(
      (sub) => sub.frequency === filters.frequency
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    filteredSubs.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'nextDelivery':
          comparison = new Date(a.nextDeliveryDate).getTime() - new Date(b.nextDeliveryDate).getTime();
          break;
        case 'amount':
          comparison = a.totalAmount - b.totalAmount;
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filteredSubs;
}

export async function createSubscription(
  data: CreateSubscriptionData
): Promise<Subscription> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newSubscription: Subscription = {
    id: `sub_${Math.random().toString(36).substr(2, 9)}`,
    ...data,
    status: 'active',
    nextDeliveryDate: getNextDeliveryDate(data.frequency),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalAmount: calculateSubscriptionTotal(data.items),
  };

  mockSubscriptions.push(newSubscription);
  return newSubscription;
}

export async function updateSubscription(
  id: string,
  data: UpdateSubscriptionData
): Promise<Subscription> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const subscriptionIndex = mockSubscriptions.findIndex((sub) => sub.id === id);
  if (subscriptionIndex === -1) throw new Error('Subscription not found');

  const updatedSubscription = {
    ...mockSubscriptions[subscriptionIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.status === 'paused' && !updatedSubscription.pausedAt) {
    updatedSubscription.pausedAt = new Date().toISOString();
  } else if (data.status === 'cancelled' && !updatedSubscription.cancelledAt) {
    updatedSubscription.cancelledAt = new Date().toISOString();
  }

  if (data.items) {
    updatedSubscription.totalAmount = calculateSubscriptionTotal(data.items);
  }

  mockSubscriptions[subscriptionIndex] = updatedSubscription;
  return updatedSubscription;
}

export async function deleteSubscription(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const subscriptionIndex = mockSubscriptions.findIndex((sub) => sub.id === id);
  if (subscriptionIndex === -1) throw new Error('Subscription not found');

  mockSubscriptions.splice(subscriptionIndex, 1);
}

// Helper functions
function getNextDeliveryDate(frequency: SubscriptionFrequency): string {
  const date = new Date();
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
  }
  return date.toISOString();
}

function calculateSubscriptionTotal(items: SubscriptionItem[]): number {
  // In a real app, this would fetch product prices from the database
  // For now, return a mock total
  return items.reduce((total, item) => total + (29.99 * item.quantity), 0);
}

// Utility functions for formatting
export function formatSubscriptionFrequency(frequency: SubscriptionFrequency): string {
  switch (frequency) {
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Every 2 Weeks';
    case 'monthly':
      return 'Monthly';
  }
}

export function formatSubscriptionStatus(status: SubscriptionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatSubscriptionDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatSubscriptionDateTime(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatSubscriptionAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NOK',
  }).format(amount);
} 