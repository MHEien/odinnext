import React from 'react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-stone-900 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/admin" className="text-xl font-semibold">
            Admin Dashboard
          </Link>
          <div className="flex space-x-4">
            <Link href="/admin/products" className="hover:text-primary-400">
              Products
            </Link>
            <Link href="/admin/orders" className="hover:text-primary-400">
              Orders
            </Link>
            <Link href="/admin/customers" className="hover:text-primary-400">
              Customers
            </Link>
            <Link href="/admin/newsletters" className="hover:text-primary-400">
              Newsletters
            </Link>
            <Link href="/" className="hover:text-primary-400">
              Store Front
            </Link>
          </div>
        </div>
      </nav>
      <main className="py-6">
        {children}
      </main>
    </div>
  );
} 