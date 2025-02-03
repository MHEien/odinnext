import { Cart } from './cart';

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id?: string;
  type: 'card';
  cardBrand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault?: boolean;
}

export interface CheckoutData {
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  sameAsShipping: boolean;
  saveInfo: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  isSubscription: boolean;
  frequency?: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockOrders: Order[] = [];

// API functions
export async function createOrder(
  cart: Cart,
  checkoutData: CheckoutData
): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const order: Order = {
    id: `ord_${Math.random().toString(36).substr(2, 9)}`,
    items: cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      isSubscription: item.isSubscription,
      frequency: item.frequency,
    })),
    subtotal: cart.subtotal,
    discount: cart.discount,
    total: cart.total,
    shippingAddress: {
      ...checkoutData.shippingAddress,
      id: `addr_${Math.random().toString(36).substr(2, 9)}`,
    },
    billingAddress: checkoutData.sameAsShipping
      ? { ...checkoutData.shippingAddress }
      : { ...(checkoutData.billingAddress as Address) },
    paymentMethod: {
      ...checkoutData.paymentMethod,
      id: `pm_${Math.random().toString(36).substr(2, 9)}`,
    },
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockOrders.push(order);
  return order;
}

export async function getOrderById(id: string): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockOrders.find((order) => order.id === id) || null;
}

// Validation functions
export function validateAddress(address: Partial<Address>): string[] {
  const errors: string[] = [];

  if (!address.firstName?.trim()) errors.push('First name is required');
  if (!address.lastName?.trim()) errors.push('Last name is required');
  if (!address.email?.trim()) errors.push('Email is required');
  if (!address.phone?.trim()) errors.push('Phone is required');
  if (!address.street?.trim()) errors.push('Street address is required');
  if (!address.city?.trim()) errors.push('City is required');
  if (!address.state?.trim()) errors.push('State is required');
  if (!address.postalCode?.trim()) errors.push('Postal code is required');
  if (!address.country?.trim()) errors.push('Country is required');

  // Email validation
  if (
    address.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(address.email)
  ) {
    errors.push('Invalid email address');
  }

  // Phone validation (basic)
  if (address.phone && !/^\+?[\d\s-]{8,}$/.test(address.phone)) {
    errors.push('Invalid phone number');
  }

  return errors;
}

export function validatePaymentMethod(
  payment: Partial<PaymentMethod>
): string[] {
  const errors: string[] = [];

  if (!payment.cardBrand?.trim()) errors.push('Card brand is required');
  if (!payment.last4?.trim()) errors.push('Card number is required');
  if (!payment.expiryMonth) errors.push('Expiry month is required');
  if (!payment.expiryYear) errors.push('Expiry year is required');

  // Basic validations
  if (payment.expiryMonth && (payment.expiryMonth < 1 || payment.expiryMonth > 12)) {
    errors.push('Invalid expiry month');
  }

  const currentYear = new Date().getFullYear();
  if (payment.expiryYear && (payment.expiryYear < currentYear || payment.expiryYear > currentYear + 20)) {
    errors.push('Invalid expiry year');
  }

  return errors;
}

// Utility functions
export function formatOrderId(id: string): string {
  return id.toUpperCase().replace('ord_', '#');
}

export function formatOrderDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatOrderStatus(
  status: Order['status']
): { label: string; color: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'yellow' };
    case 'processing':
      return { label: 'Processing', color: 'blue' };
    case 'completed':
      return { label: 'Completed', color: 'green' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'red' };
    default:
      return { label: status, color: 'gray' };
  }
} 