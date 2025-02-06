'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter} from '@/i18n/routing';
import type { User } from '@prisma/client';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function CustomerHeader({ customer }: { customer: User }) {
  const router = useRouter();

  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible">
      <button
        onClick={() => router.back()}
        className="text-stone-600 hover:text-amber-600 mb-4"
      >
        ← Back to Customers
      </button>
      <div className="flex items-start gap-6">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-stone-100">
          {customer.image ? (
            <Image
              src={customer.image}
              alt={customer.name || ''}
              fill
              className="object-cover"
            />
          ) : (
            <svg
              className="w-full h-full text-stone-400 p-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>
        <div>
          <h1 className="font-norse text-3xl">{customer.name || 'Anonymous'}</h1>
          <p className="text-stone-600">{customer.email}</p>
        </div>
      </div>
    </motion.div>
  );
} 