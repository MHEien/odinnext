import { Order } from './orders';

export interface UserAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  addresses: UserAddress[];
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences: {
    marketingEmails: boolean;
    orderNotifications: boolean;
    subscriptionReminders: boolean;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    activeSubscriptions: number;
    lastOrderDate?: string;
  };
}

export interface UserFilters {
  search?: string;
  hasSubscription?: boolean;
  minOrders?: number;
  minSpent?: number;
  sortBy?: 'name' | 'orders' | 'spent' | 'joined';
  sortOrder?: 'asc' | 'desc';
}

// Mock data
const mockUsers: UserProfile[] = [
  {
    id: 'user_1',
    email: 'thor@asgard.com',
    name: 'Thor Odinson',
    avatar: '/avatars/thor.jpg',
    phone: '+47 123 45 678',
    addresses: [
      {
        id: 'addr_1',
        street: '123 Valhalla Lane',
        city: 'Asgard',
        state: 'Midgard',
        postalCode: '12345',
        country: 'Norway',
        isDefault: true,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-10T14:30:00Z',
    lastLoginAt: '2024-03-11T09:15:00Z',
    preferences: {
      marketingEmails: true,
      orderNotifications: true,
      subscriptionReminders: true,
    },
    stats: {
      totalOrders: 12,
      totalSpent: 789.50,
      activeSubscriptions: 1,
      lastOrderDate: '2024-03-10T14:30:00Z',
    },
  },
  {
    id: 'user_2',
    email: 'freya@asgard.com',
    name: 'Freya Vanir',
    avatar: '/avatars/freya.jpg',
    phone: '+47 234 56 789',
    addresses: [
      {
        id: 'addr_2',
        street: '456 Bifrost Road',
        city: 'Oslo',
        state: 'Oslo',
        postalCode: '0123',
        country: 'Norway',
        isDefault: true,
      },
    ],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-09T16:45:00Z',
    lastLoginAt: '2024-03-11T10:20:00Z',
    preferences: {
      marketingEmails: true,
      orderNotifications: true,
      subscriptionReminders: false,
    },
    stats: {
      totalOrders: 8,
      totalSpent: 456.75,
      activeSubscriptions: 0,
      lastOrderDate: '2024-03-09T16:45:00Z',
    },
  },
  {
    id: 'user_3',
    email: 'loki@asgard.com',
    name: 'Loki Odinson',
    avatar: '/avatars/loki.jpg',
    phone: '+47 345 67 890',
    addresses: [
      {
        id: 'addr_3',
        street: '789 Yggdrasil Ave',
        city: 'Bergen',
        state: 'Vestland',
        postalCode: '5020',
        country: 'Norway',
        isDefault: true,
      },
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-08T11:30:00Z',
    lastLoginAt: '2024-03-11T08:45:00Z',
    preferences: {
      marketingEmails: false,
      orderNotifications: true,
      subscriptionReminders: true,
    },
    stats: {
      totalOrders: 5,
      totalSpent: 234.25,
      activeSubscriptions: 1,
      lastOrderDate: '2024-03-08T11:30:00Z',
    },
  },
];

// API functions
export async function getAllUsers(): Promise<UserProfile[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockUsers;
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUsers.find((user) => user.id === userId) || null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  // This would fetch from the orders service in a real app
  // For now, return an empty array filtered by userId
  return mockUsers.find((user) => user.id === userId)?.stats.totalOrders
    ? []
    : [];
}

export async function getFilteredUsers(filters: UserFilters): Promise<UserProfile[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filteredUsers = [...mockUsers];

  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  }

  if (filters.hasSubscription !== undefined) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        (user.stats.activeSubscriptions > 0) === filters.hasSubscription
    );
  }

  if (typeof filters.minOrders === 'number') {
    filteredUsers = filteredUsers.filter(
      (user) => user.stats.totalOrders >= filters.minOrders!
    );
  }

  if (typeof filters.minSpent === 'number') {
    filteredUsers = filteredUsers.filter(
      (user) => user.stats.totalSpent >= filters.minSpent!
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    filteredUsers.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'orders':
          comparison = a.stats.totalOrders - b.stats.totalOrders;
          break;
        case 'spent':
          comparison = a.stats.totalSpent - b.stats.totalSpent;
          break;
        case 'joined':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filteredUsers;
}

export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfile>
): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  const updatedUser = {
    ...mockUsers[userIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  mockUsers[userIndex] = updatedUser;
  return updatedUser;
}

export async function addUserAddress(
  userId: string,
  address: Omit<UserAddress, 'id'>
): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  const newAddress: UserAddress = {
    ...address,
    id: `addr_${Math.random().toString(36).substr(2, 9)}`,
  };

  if (address.isDefault) {
    mockUsers[userIndex].addresses = mockUsers[userIndex].addresses.map((addr) => ({
      ...addr,
      isDefault: false,
    }));
  }

  mockUsers[userIndex].addresses.push(newAddress);
  mockUsers[userIndex].updatedAt = new Date().toISOString();

  return mockUsers[userIndex];
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  data: Partial<UserAddress>
): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  const addressIndex = mockUsers[userIndex].addresses.findIndex(
    (addr) => addr.id === addressId
  );
  if (addressIndex === -1) throw new Error('Address not found');

  if (data.isDefault) {
    mockUsers[userIndex].addresses = mockUsers[userIndex].addresses.map((addr) => ({
      ...addr,
      isDefault: false,
    }));
  }

  mockUsers[userIndex].addresses[addressIndex] = {
    ...mockUsers[userIndex].addresses[addressIndex],
    ...data,
  };

  mockUsers[userIndex].updatedAt = new Date().toISOString();

  return mockUsers[userIndex];
}

export async function deleteUserAddress(
  userId: string,
  addressId: string
): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');

  const addressIndex = mockUsers[userIndex].addresses.findIndex(
    (addr) => addr.id === addressId
  );
  if (addressIndex === -1) throw new Error('Address not found');

  if (mockUsers[userIndex].addresses[addressIndex].isDefault) {
    throw new Error('Cannot delete default address');
  }

  mockUsers[userIndex].addresses.splice(addressIndex, 1);
  mockUsers[userIndex].updatedAt = new Date().toISOString();

  return mockUsers[userIndex];
}

// Utility functions
export function formatUserDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatUserDateTime(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatUserAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NOK',
  }).format(amount);
} 