'use client';

import { motion } from 'framer-motion';
import type { User } from '@prisma/client';

type CustomerWithStats = User & {
  totalOrders: number;
  totalSpent: number;
  activeSubscriptions: number;
};

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

export function CustomerStats({ customer }: { customer: CustomerWithStats }) {
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-medium text-stone-500">Total Orders</h3>
        <p className="text-2xl font-norse mt-1">{customer.totalOrders}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-medium text-stone-500">Total Spent</h3>
        <p className="text-2xl font-norse mt-1">
          {new Intl.NumberFormat('no-NO', {
            style: 'currency',
            currency: 'NOK',
          }).format(customer.totalSpent)}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-medium text-stone-500">
          Active Subscriptions
        </h3>
        <p className="text-2xl font-norse mt-1">{customer.activeSubscriptions}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-sm font-medium text-stone-500">Customer Since</h3>
        <p className="text-2xl font-norse mt-1">
          {new Date(customer.emailVerified || Date.now()).toLocaleDateString(
            'no-NO'
          )}
        </p>
      </div>
    </motion.div>
  );
} 