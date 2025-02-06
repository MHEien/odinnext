'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const t = useTranslations('Navigation')
  const pathname = usePathname()

  const links = [
    { href: '/products', label: t('products') },
    { href: '/collections', label: t('collections') },
    { href: '/cart', label: t('cart') },
    { href: '/orders', label: t('orders') },
    { href: '/about', label: t('about') },
    { href: '/account', label: t('account') },
  ]

  return (
    <nav className="bg-stone-900 border-b border-stone-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-amber-500">
            Odin
          </Link>
          <div className="hidden md:flex space-x-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith(href)
                    ? 'text-amber-500'
                    : 'text-stone-300 hover:text-amber-500'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
} 