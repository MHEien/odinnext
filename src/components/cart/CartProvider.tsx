'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Cart, getCart } from '@/app/lib/mock/cart';
import { Product, getProductsByIds } from '@/app/lib/mock/products';

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

  const refreshCart = async () => {
    try {
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
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

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