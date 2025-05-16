"use client"
import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-4xl mb-4">Product Not Found</h2>
          <p className="text-stone-600 mb-8">
            The chocolate you&apos;re looking for seems to have vanished into Valhalla.
          </p>
          <Link
            href="/products"
            className="btn-primary bg-primary-600 hover:bg-primary-700 inline-block"
          >
            Return to Shop
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 