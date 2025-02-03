export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  pricePerDelivery: number;
  featuredProducts: string[];
  benefits: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'paused' | 'cancelled';
  nextDeliveryDate: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
  pausedUntil?: string;
  cancelledAt?: string;
}

export interface CreateSubscriptionData {
  userId: string;
  planId: string;
  shippingAddress: Subscription['shippingAddress'];
}

// Mock subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'yggdrasil-selection',
    name: "Yggdrasil's Selection",
    description: 'A curated selection of our finest dark chocolates, delivered weekly.',
    frequency: 'weekly',
    pricePerDelivery: 49.99,
    featuredProducts: ['thor-thunder', 'freya-fusion', 'odin-wisdom'],
    benefits: [
      'Weekly delivery of premium chocolates',
      'First access to seasonal specials',
      'Free shipping on all deliveries',
      'Exclusive Valkyrie member tastings',
    ],
  },
  {
    id: 'warriors-chest',
    name: "Warrior's Chest",
    description: 'A generous biweekly feast of our most popular chocolate varieties.',
    frequency: 'biweekly',
    pricePerDelivery: 79.99,
    featuredProducts: ['thor-thunder', 'freya-fusion', 'odin-wisdom', 'loki-crunch'],
    benefits: [
      'Biweekly delivery of premium chocolates',
      'Exclusive flavors not sold separately',
      'Free shipping on all deliveries',
      'Monthly chocolate crafting workshops',
    ],
  },
  {
    id: 'odins-treasury',
    name: "Odin's Treasury",
    description: 'A monthly treasure chest of our entire chocolate collection.',
    frequency: 'monthly',
    pricePerDelivery: 129.99,
    featuredProducts: ['thor-thunder', 'freya-fusion', 'odin-wisdom', 'loki-crunch', 'heimdall-harvest'],
    benefits: [
      'Monthly delivery of our complete collection',
      'Limited edition seasonal creations',
      'Free shipping on all deliveries',
      'Priority access to special events',
      'Personalized tasting notes',
    ],
  },
];

// Mock user subscriptions
const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    userId: 'current_user',
    planId: 'warriors-chest',
    status: 'active',
    nextDeliveryDate: '2024-03-15T00:00:00Z',
    shippingAddress: {
      street: '123 Valhalla Lane',
      city: 'Asgard',
      state: 'Midgard',
      postalCode: '12345',
      country: 'Norway',
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-01T15:30:00Z',
  },
];

export async function getUserSubscriptions(userId: string): Promise<Subscription[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockSubscriptions.filter((sub) => sub.userId === userId);
}

export async function getSubscriptionById(subId: string): Promise<Subscription | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockSubscriptions.find((sub) => sub.id === subId) || null;
}

export async function getPlanById(planId: string): Promise<SubscriptionPlan | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return subscriptionPlans.find((plan) => plan.id === planId) || null;
}

export async function createSubscription(data: CreateSubscriptionData): Promise<Subscription> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const plan = await getPlanById(data.planId);
  if (!plan) throw new Error('Plan not found');

  const nextDeliveryDate = new Date();
  nextDeliveryDate.setDate(nextDeliveryDate.getDate() + 7); // Start in a week

  const subscription: Subscription = {
    id: `sub_${Math.random().toString(36).substr(2, 9)}`,
    userId: data.userId,
    planId: data.planId,
    status: 'active',
    nextDeliveryDate: nextDeliveryDate.toISOString(),
    shippingAddress: data.shippingAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockSubscriptions.push(subscription);
  return subscription;
}

export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: Subscription['status'],
  pausedUntil?: string
): Promise<Subscription> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const subscription = mockSubscriptions.find((sub) => sub.id === subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  subscription.status = status;
  subscription.updatedAt = new Date().toISOString();

  if (status === 'paused' && pausedUntil) {
    subscription.pausedUntil = pausedUntil;
  } else if (status === 'cancelled') {
    subscription.cancelledAt = new Date().toISOString();
  }

  return subscription;
}

export async function updateSubscriptionAddress(
  subscriptionId: string,
  address: Subscription['shippingAddress']
): Promise<Subscription> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const subscription = mockSubscriptions.find((sub) => sub.id === subscriptionId);
  if (!subscription) throw new Error('Subscription not found');

  subscription.shippingAddress = address;
  subscription.updatedAt = new Date().toISOString();

  return subscription;
}

export function getFrequencyLabel(frequency: SubscriptionPlan['frequency']): string {
  switch (frequency) {
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Every 2 Weeks';
    case 'monthly':
      return 'Monthly';
    default:
      return frequency;
  }
}

export function getStatusColor(status: Subscription['status']): string {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50';
    case 'paused':
      return 'text-yellow-600 bg-yellow-50';
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-stone-600 bg-stone-50';
  }
}

export function formatStatus(status: Subscription['status']): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
} 