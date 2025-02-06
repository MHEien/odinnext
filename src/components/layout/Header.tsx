'use client';

import { Link } from '@/i18n/routing'
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/lib/context/AuthContext";
import { formatCartAmount } from "@/app/lib/mock/cart";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const { cart, products, itemCount } = useCart();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <motion.header 
      className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display text-2xl text-primary-600">
              Odin Chocolate
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-stone-600 hover:text-primary-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart and Account */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Link
                href="/cart"
                className="text-stone-600 hover:text-primary-600 transition-colors duration-200 relative"
              >
                <span className="sr-only">Cart</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Flyout Cart */}
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-4 hidden group-hover:block">
                {cart && cart.items.length > 0 ? (
                  <>
                    <div className="px-4 mb-4">
                      <h3 className="font-medium text-stone-900">Your Cart</h3>
                    </div>
                    <div className="max-h-96 overflow-auto px-4">
                      {cart.items.map((item) => {
                        const product = products[item.productId];
                        if (!product) return null;
                        return (
                          <div
                            key={`${item.productId}-${item.isSubscription}-${item.frequency}`}
                            className="flex items-center py-4 border-b border-stone-200 last:border-0"
                          >
                            <div className="relative w-16 h-16 rounded overflow-hidden bg-stone-100 flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="font-medium text-stone-900 text-sm">
                                {product.name}
                              </h4>
                              <p className="text-stone-600 text-sm">
                                {item.isSubscription
                                  ? `Subscription (${item.frequency})`
                                  : 'One-time purchase'}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-stone-600">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-sm font-medium text-stone-900">
                                  {formatCartAmount(item.price * item.quantity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-stone-200 mt-4 px-4 pt-4">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium text-stone-900">Total</span>
                        <span className="font-medium text-stone-900">
                          {formatCartAmount(cart.total)}
                        </span>
                      </div>
                      <Link
                        href="/cart"
                        className="block w-full py-2 px-4 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        View Cart
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="px-4 text-center">
                    <p className="text-stone-600">Your cart is empty</p>
                  </div>
                )}
              </div>
            </div>

            {user ? (
              <div className="relative group">
                <button className="text-stone-600 hover:text-primary-600 transition-colors duration-200">
                  <span className="sr-only">Account menu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/sign-in"
                className="text-stone-600 hover:text-primary-600 transition-colors duration-200"
              >
                <span className="sr-only">Sign in</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
} 