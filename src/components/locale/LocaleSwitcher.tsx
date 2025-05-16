'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { setUserLocale } from '@/lib/services/locale';
import type { AppLocale } from '@/i18n/config';

const locales = [
  { code: 'en', flag: '/flags/gb.svg', label: 'English' },
  { code: 'no', flag: '/flags/no.svg', label: 'Norsk' }
] as const;

type LocaleSwitcherProps = {
  closeMenu?: () => void;
  direction?: 'up' | 'down';
};

export default function LocaleSwitcher({ closeMenu, direction = 'down' }: LocaleSwitcherProps) {
  const currentLocale = useLocale() as AppLocale;
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLocaleChange = (locale: AppLocale) => {
    startTransition(() => {
      setUserLocale(locale);
      setIsOpen(false);
      if (closeMenu) closeMenu();
      window.location.pathname = window.location.pathname.replace(`/${currentLocale}`, `/${locale}`);
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 text-stone-600 hover:text-primary-600 transition-colors duration-200 ${
          isPending ? 'opacity-50 pointer-events-none' : ''
        }`}
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 relative overflow-hidden rounded-full border border-stone-200">
          <Image
            src={locales.find(l => l.code === currentLocale)?.flag || locales[0].flag}
            alt={currentLocale}
            fill
            className="object-cover"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`absolute ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'} right-0 bg-white rounded-lg shadow-lg py-1 min-w-[120px]`}
            initial={{ opacity: 0, y: direction === 'up' ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction === 'up' ? 10 : -10 }}
            transition={{ duration: 0.2 }}
          >
            {locales.map((locale) => (
              <button
                key={locale.code}
                className={`flex items-center space-x-2 px-4 py-2 w-full text-left hover:bg-stone-50 ${
                  currentLocale === locale.code ? 'bg-stone-50' : ''
                }`}
                onClick={() => handleLocaleChange(locale.code as AppLocale)}
                disabled={isPending}
              >
                <div className="w-5 h-5 relative overflow-hidden rounded-full">
                  <Image
                    src={locale.flag}
                    alt={locale.label}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-stone-700">{locale.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 