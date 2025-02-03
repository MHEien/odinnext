import { Product } from './products';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number; // Price at time of purchase
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: {
    type: 'credit_card' | 'paypal';
    last4?: string;
  };
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  trackingNumber?: string;
  notes?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ord_1',
    userId: 'user_1',
    items: [
      {
        product: {
          id: 'thor-thunder',
          name: "Thor's Thunder",
          description: 'Dark chocolate with sea salt and popping candy.',
          price: 12.99,
          image: '/images/thor-thunder.jpg',
          category: 'dark',
          ingredients: ['Dark Chocolate', 'Sea Salt', 'Popping Candy'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: true,
          inStock: true,
          longDescription: '',
          nutritionalInfo: {
            calories: 500,
            protein: 10,
            carbohydrates: 50,
            fat: 30,
          },
        },
        quantity: 2,
        price: 12.99,
      },
    ],
    status: 'delivered',
    subtotal: 25.98,
    tax: 2.08,
    shipping: 5.00,
    total: 33.06,
    shippingAddress: {
      street: '123 Valhalla Lane',
      city: 'Asgard',
      state: 'Midgard',
      postalCode: '12345',
      country: 'Norway',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
    },
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-03T15:30:00Z',
    shippedAt: '2024-03-02T09:00:00Z',
    deliveredAt: '2024-03-03T14:00:00Z',
    trackingNumber: 'TRK123456789',
  },
  {
    id: 'ord_2',
    userId: 'user_2',
    items: [
      {
        product: {
          id: 'freya-delight',
          name: "Freya's Delight",
          description: 'Milk chocolate with honey and lavender.',
          price: 14.99,
          image: '/images/freya-delight.jpg',
          category: 'milk',
          ingredients: ['Milk Chocolate', 'Honey', 'Lavender'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: false,
          inStock: true,
          longDescription: '',
          nutritionalInfo: {
            calories: 520,
            protein: 8,
            carbohydrates: 55,
            fat: 32,
          },
        },
        quantity: 1,
        price: 14.99,
      }
    ],
    status: 'processing',
    subtotal: 14.99,
    tax: 1.20,
    shipping: 5.00,
    total: 21.19,
    shippingAddress: {
      street: '456 Bifrost Road',
      city: 'Oslo',
      state: 'Oslo',
      postalCode: '0123',
      country: 'Norway',
    },
    paymentMethod: {
      type: 'paypal',
    },
    createdAt: '2024-03-10T14:22:00Z',
    updatedAt: '2024-03-10T14:22:00Z',
  },
  {
    id: 'ord_3',
    userId: 'user_1',
    items: [
      {
        product: {
          id: 'loki-twist',
          name: "Loki's Twist",
          description: 'White chocolate with dark swirls and chili.',
          price: 13.99,
          image: '/images/loki-twist.jpg',
          category: 'white',
          ingredients: ['White Chocolate', 'Dark Chocolate', 'Chili'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: true,
          inStock: true,
          longDescription: '',
          nutritionalInfo: {
            calories: 530,
            protein: 7,
            carbohydrates: 58,
            fat: 31,
          },
        },
        quantity: 3,
        price: 13.99,
      }
    ],
    status: 'shipped',
    subtotal: 41.97,
    tax: 3.36,
    shipping: 5.00,
    total: 50.33,
    shippingAddress: {
      street: '123 Valhalla Lane',
      city: 'Asgard',
      state: 'Midgard',
      postalCode: '12345',
      country: 'Norway',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
    },
    createdAt: '2024-03-08T09:15:00Z',
    updatedAt: '2024-03-09T11:30:00Z',
    shippedAt: '2024-03-09T11:30:00Z',
    trackingNumber: 'TRK987654321',
  },
  {
    id: 'ord_4',
    userId: 'user_3',
    items: [
      {
        product: {
          id: 'thor-thunder',
          name: "Thor's Thunder",
          description: 'Dark chocolate with sea salt and popping candy.',
          price: 12.99,
          image: '/images/thor-thunder.jpg',
          category: 'dark',
          ingredients: ['Dark Chocolate', 'Sea Salt', 'Popping Candy'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: true,
          inStock: true,
          longDescription: '',
          nutritionalInfo: {
            calories: 500,
            protein: 10,
            carbohydrates: 50,
            fat: 30,
          },
        },
        quantity: 1,
        price: 12.99,
      },
      {
        product: {
          id: 'freya-delight',
          name: "Freya's Delight",
          description: 'Milk chocolate with honey and lavender.',
          price: 14.99,
          image: '/images/freya-delight.jpg',
          category: 'milk',
          ingredients: ['Milk Chocolate', 'Honey', 'Lavender'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: false,
          inStock: true,
          longDescription: '',
          nutritionalInfo: {
            calories: 520,
            protein: 8,
            carbohydrates: 55,
            fat: 32,
          },
        },
        quantity: 2,
        price: 14.99,
      }
    ],
    status: 'cancelled',
    subtotal: 42.97,
    tax: 3.44,
    shipping: 5.00,
    total: 51.41,
    shippingAddress: {
      street: '789 Yggdrasil Ave',
      city: 'Bergen',
      state: 'Vestland',
      postalCode: '5020',
      country: 'Norway',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '1234',
    },
    createdAt: '2024-03-05T16:45:00Z',
    updatedAt: '2024-03-06T10:20:00Z',
    cancelledAt: '2024-03-06T10:20:00Z',
    notes: 'Cancelled by customer due to change of mind.',
  },
  {
    id: 'ord_5',
    userId: 'user_2',
    items: [
      {
        product: {
          id: 'loki-twist',
          name: "Loki's Twist",
          description: 'White chocolate with dark swirls and chili.',
          price: 13.99,
          image: '/images/loki-twist.jpg',
          category: 'white',
          ingredients: ['White Chocolate', 'Dark Chocolate', 'Chili'],
          allergens: ['Milk', 'Soy'],
          weight: 100,
          featured: true,
          inStock: true,
          longDescription: '',
          nutritionalInfo: {
            calories: 530,
            protein: 7,
            carbohydrates: 58,
            fat: 31,
          },
        },
        quantity: 1,
        price: 13.99,
      }
    ],
    status: 'pending',
    subtotal: 13.99,
    tax: 1.12,
    shipping: 5.00,
    total: 20.11,
    shippingAddress: {
      street: '456 Bifrost Road',
      city: 'Oslo',
      state: 'Oslo',
      postalCode: '0123',
      country: 'Norway',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '5678',
    },
    createdAt: '2024-03-11T08:00:00Z',
    updatedAt: '2024-03-11T08:00:00Z',
  }
];

// Helper functions
export async function getAllOrders(): Promise<Order[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockOrders;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders.find((order) => order.id === orderId) || null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockOrders.filter((order) => order.userId === userId);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  notes?: string
): Promise<Order> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) throw new Error('Order not found');

  const now = new Date().toISOString();
  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    status,
    notes: notes ? `${mockOrders[orderIndex].notes || ''}\n${notes}` : mockOrders[orderIndex].notes,
    updatedAt: now,
    ...(status === 'shipped' && { shippedAt: now }),
    ...(status === 'delivered' && { deliveredAt: now }),
    ...(status === 'cancelled' && { cancelledAt: now }),
    ...(status === 'refunded' && { refundedAt: now }),
  };

  return mockOrders[orderIndex];
}

export async function updateTrackingNumber(
  orderId: string,
  trackingNumber: string
): Promise<Order> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) throw new Error('Order not found');

  mockOrders[orderIndex] = {
    ...mockOrders[orderIndex],
    trackingNumber,
    updatedAt: new Date().toISOString(),
  };

  return mockOrders[orderIndex];
}

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'processing':
      return 'text-blue-600 bg-blue-50';
    case 'shipped':
      return 'text-purple-600 bg-purple-50';
    case 'delivered':
      return 'text-green-600 bg-green-50';
    case 'cancelled':
      return 'text-red-600 bg-red-50';
    case 'refunded':
      return 'text-stone-600 bg-stone-50';
    default:
      return 'text-stone-600 bg-stone-50';
  }
}

export function formatStatus(status: OrderStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPrice(price: number): string {
  return price.toFixed(2);
} 