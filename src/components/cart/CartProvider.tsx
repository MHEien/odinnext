'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Cart, getCart, CartItem as MockCartItem } from '@/app/lib/mock/cart';
import { Product, getProductsByIds } from '@/app/lib/mock/products';
import { SubscriptionFrequency } from '@/app/lib/mock/subscriptions';

// Define the same local storage key that's used in the other CartContext
const CART_STORAGE_KEY = 'odinnext_cart';
// Define a custom event name for cart changes
const CART_UPDATED_EVENT = 'odinnext_cart_updated';

// Define interfaces to match the localStorage stored cart
interface StoredCartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  isSubscription: boolean;
  frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | string;
  name: string;
  image: string;
  collectionId?: string;
}

interface StoredCart {
  items: StoredCartItem[];
  total: number;
}

interface CartContextType {
  cart: Cart | null;
  products: { [key: string]: Product };
  isLoading: boolean;
  itemCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [itemCount, setItemCount] = useState(0);

  // Helper function to convert stored frequency to mock frequency
  const convertFrequency = (frequency?: string): SubscriptionFrequency | undefined => {
    if (!frequency) return undefined;
    
    // Convert uppercase to lowercase to match the expected format
    const lowerFreq = frequency.toLowerCase();
    if (lowerFreq === 'weekly' || lowerFreq === 'biweekly' || lowerFreq === 'monthly') {
      return lowerFreq as SubscriptionFrequency;
    }
    return undefined;
  };

  const refreshCart = async () => {
    try {
      // Get cart data from localStorage first
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as StoredCart;
        
        // Create a cart object compatible with our component
        const cartData: Cart = {
          items: parsedCart.items.map((item: StoredCartItem) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            isSubscription: item.isSubscription,
            frequency: convertFrequency(item.frequency)
          })),
          subtotal: parsedCart.total,
          discount: 0,
          total: parsedCart.total
        };
        
        setCart(cartData);
        
        // Get unique product IDs from cart items
        const productIds = Array.from(
          new Set(cartData.items.map((item: MockCartItem) => item.productId))
        );
        
        // Fetch product details
        const productData = await getProductsByIds(productIds);
        const productMap = productData.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {} as { [key: string]: Product });
        setProducts(productMap);
        
        // Update item count
        const count = cartData.items.reduce((sum: number, item: MockCartItem) => sum + item.quantity, 0);
        setItemCount(count);
      } else {
        // Fallback to original implementation if no localStorage data
        const cartData = await getCart();
        setCart(cartData);

        // Get unique product IDs from cart items
        const productIds = Array.from(
          new Set(cartData.items.map((item) => item.productId))
        );

        // Fetch product details
        const productData = await getProductsByIds(productIds);
        const productMap = productData.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {} as { [key: string]: Product });
        setProducts(productMap);

        // Update item count
        const count = cartData.items.reduce((sum, item) => sum + item.quantity, 0);
        setItemCount(count);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY) {
        refreshCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Listen for custom events (for changes in the same window)
  useEffect(() => {
    const handleCartUpdated = () => {
      refreshCart();
    };

    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const value = {
    cart,
    products,
    isLoading,
    itemCount,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 