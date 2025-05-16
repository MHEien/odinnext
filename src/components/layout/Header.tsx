'use client';

import { Link } from '@/i18n/routing'
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";
import { useUIStore } from "@/lib/stores/uiStore";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from 'next-intl';
import LocaleSwitcher from '@/components/locale/LocaleSwitcher';
import MiniCart from '../cart/MiniCart';

const navigation = [
  { name: "Navigation.products", href: "/products" },
  { name: "Navigation.collections", href: "/collections" },
  { name: "Navigation.about", href: "/about" },
  { name: "Navigation.contactUs", href: "/contact" },
];

export default function Header({ isAdmin }: { isAdmin: boolean }) {
  const { user, signOut } = useAuth();
  const t = useTranslations();
  const { 
    isAccountMenuOpen, 
    toggleAccountMenu, 
    closeAccountMenu,
  } = useUIStore();
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      closeAccountMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current && 
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        closeAccountMenu();
      }
      if (
        languageMenuRef.current && 
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isAccountMenuOpen || isLanguageMenuOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen, isLanguageMenuOpen, isMobileMenuOpen, closeAccountMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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
            <span className="font-display text-xl sm:text-2xl text-primary-600">
              Odin Chocolate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-stone-600 hover:text-primary-600 transition-colors duration-200"
              >
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-stone-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t(isMobileMenuOpen ? 'Navigation.closeMenu' : 'Navigation.openMenu')}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>

          {/* Cart, Locale and Account */}
          <div className="flex items-center space-x-4">
            {/* Locale Switcher */}
            <LocaleSwitcher />


              <MiniCart  />
            </div>

            {user ? (
              <div className="relative" ref={accountMenuRef}>
                <button
                  className="text-stone-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                  onClick={toggleAccountMenu}
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="true"
                >
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

                <AnimatePresence>
                  {isAccountMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                    >
                      <div className="px-4 py-2 border-b border-stone-200">
                        <p className="text-stone-900 font-medium truncate">
                          {user.name || user.email}
                        </p>
                      </div>

                      <Link
                        href="/account/profile"
                        className="block px-4 py-2 text-stone-700 hover:bg-primary-50 hover:text-primary-600"
                        onClick={closeAccountMenu}
                      >
                        {t('Navigation.account.profile')}
                      </Link>

                      <Link
                        href="/account/subscriptions"
                        className="block px-4 py-2 text-stone-700 hover:bg-primary-50 hover:text-primary-600"
                        onClick={closeAccountMenu}
                      >
                        {t('Navigation.account.subscriptions')}
                      </Link>

                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-stone-700 hover:bg-primary-50 hover:text-primary-600"
                        onClick={closeAccountMenu}
                      >
                        {t('Navigation.account.orders')}
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-stone-700 hover:bg-primary-50 hover:text-primary-600 border-t border-stone-200 mt-1 pt-1"
                          onClick={closeAccountMenu}
                        >
                          {t('Navigation.account.admin')}
                        </Link>
                      )}

                      <button
                        className="block w-full text-left px-4 py-2 text-stone-700 hover:bg-primary-50 hover:text-primary-600 border-t border-stone-200 mt-1 pt-1"
                        onClick={handleSignOut}
                      >
                        {t('Navigation.account.signOut')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/sign-in"
                  className="text-stone-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  {t('Navigation.signIn')}
                </Link>
                <span className="text-stone-300">|</span>
                <Link
                  href="/auth/sign-up"
                  className="text-stone-600 hover:text-primary-600 transition-colors duration-200 text-sm"
                >
                  {t('Navigation.signUp')}
                </Link>
                <div className="hidden md:block ml-1 text-xs text-stone-400">
                  ({t('Navigation.orCheckoutAsGuest')})
                </div>
              </div>
            )}
          </div>
        </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            ref={mobileMenuRef}
            className="fixed inset-0 z-40 bg-white sm:hidden"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="h-full flex flex-col overflow-y-auto pt-20 pb-6 px-4">
              <nav className="space-y-6 flex-grow">
                {navigation.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block text-lg font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(item.name)}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Additional mobile-only links */}
                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/admin"
                      className="block text-lg font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  </motion.div>
                )}
                
                {user ? (
                  <motion.div
                    className="pt-6 border-t border-stone-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href="/account"
                      className="block py-2 text-lg font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('Account.profile.title')}
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block py-2 text-lg font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('Orders.title')}
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 text-lg font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200"
                    >
                      {t('Account.signOut')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    className="pt-6 border-t border-stone-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href="/auth/sign-in"
                      className="block py-2 text-lg font-medium text-stone-800 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('Account.signIn')}
                    </Link>
                  </motion.div>
                )}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="flex justify-between items-center">
                  <p className="text-stone-600">{t('Navigation.language')}</p>
                  <div className="inline-block">
                    <LocaleSwitcher closeMenu={() => setIsMobileMenuOpen(false)} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
} 