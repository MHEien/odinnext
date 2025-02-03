import { SubscriptionFrequency } from './subscriptions';

export interface CartItem {
  productId: string;
  quantity: number;
  isSubscription: boolean;
  frequency?: SubscriptionFrequency;
  price: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// Mock cart data
let mockCart: Cart = {
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
};

// Helper function to calculate cart totals
function calculateCartTotals(items: CartItem[]): {
  subtotal: number;
  discount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = items.reduce((sum, item) => {
    if (item.isSubscription) {
      // 10% discount on subscription items
      return sum + (item.price * item.quantity * 0.1);
    }
    return sum;
  }, 0);

  return {
    subtotal,
    discount,
    total: subtotal - discount,
  };
}

// API functions
export async function getCart(): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCart;
}

export async function addToCart(item: Omit<CartItem, 'price'> & { price: number }): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const existingItemIndex = mockCart.items.findIndex(
    (cartItem) =>
      cartItem.productId === item.productId &&
      cartItem.isSubscription === item.isSubscription &&
      cartItem.frequency === item.frequency
  );

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    mockCart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    mockCart.items.push(item);
  }

  // Recalculate totals
  const totals = calculateCartTotals(mockCart.items);
  mockCart = {
    ...mockCart,
    ...totals,
  };

  return mockCart;
}

export async function updateCartItemQuantity(
  productId: string,
  quantity: number,
  isSubscription: boolean,
  frequency?: SubscriptionFrequency
): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const itemIndex = mockCart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.isSubscription === isSubscription &&
      item.frequency === frequency
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  if (quantity === 0) {
    // Remove item if quantity is 0
    mockCart.items.splice(itemIndex, 1);
  } else {
    // Update quantity
    mockCart.items[itemIndex].quantity = quantity;
  }

  // Recalculate totals
  const totals = calculateCartTotals(mockCart.items);
  mockCart = {
    ...mockCart,
    ...totals,
  };

  return mockCart;
}

export async function removeFromCart(
  productId: string,
  isSubscription: boolean,
  frequency?: SubscriptionFrequency
): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const itemIndex = mockCart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.isSubscription === isSubscription &&
      item.frequency === frequency
  );

  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }

  mockCart.items.splice(itemIndex, 1);

  // Recalculate totals
  const totals = calculateCartTotals(mockCart.items);
  mockCart = {
    ...mockCart,
    ...totals,
  };

  return mockCart;
}

export async function clearCart(): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  mockCart = {
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
  };

  return mockCart;
}

// Utility functions for formatting
export function formatCartItemFrequency(frequency?: SubscriptionFrequency): string {
  if (!frequency) return 'One-time purchase';
  
  switch (frequency) {
    case 'weekly':
      return 'Weekly delivery';
    case 'biweekly':
      return 'Delivery every 2 weeks';
    case 'monthly':
      return 'Monthly delivery';
  }
}

export function formatCartAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NOK',
  }).format(amount);
} 