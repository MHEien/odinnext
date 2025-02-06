'use client';

import { motion } from 'framer-motion';
import type { User } from '@prisma/client';

type CustomerWithProfile = User & {
  profile: {
    id: string;
    userId: string;
    shippingStreet: string | null;
    shippingCity: string | null;
    shippingState: string | null;
    shippingPostalCode: string | null;
    shippingCountry: string | null;
    billingStreet: string | null;
    billingCity: string | null;
    billingState: string | null;
    billingPostalCode: string | null;
    billingCountry: string | null;
    marketingConsent: boolean;
    notifications: boolean;
    phone: string | null;
  } | null;
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

export function CustomerSidebar({ customer }: { customer: CustomerWithProfile }) {
  return (
    <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-norse text-xl mb-6">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-stone-500">Email</h3>
            <p className="mt-1">{customer.email}</p>
          </div>
          {customer.profile?.phone && (
            <div>
              <h3 className="text-sm font-medium text-stone-500">Phone</h3>
              <p className="mt-1">{customer.profile.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Shipping Address */}
      {customer.profile && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-norse text-xl mb-6">Shipping Address</h2>
          <div className="p-4 rounded-lg bg-stone-50">
            {customer.profile.shippingStreet && (
              <p>{customer.profile.shippingStreet}</p>
            )}
            {(customer.profile.shippingCity ||
              customer.profile.shippingState ||
              customer.profile.shippingPostalCode) && (
              <p>
                {[
                  customer.profile.shippingCity,
                  customer.profile.shippingState,
                  customer.profile.shippingPostalCode,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {customer.profile.shippingCountry && (
              <p>{customer.profile.shippingCountry}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
} 