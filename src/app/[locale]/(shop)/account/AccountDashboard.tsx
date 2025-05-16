'use client';

import { useRouter} from '@/i18n/routing';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

interface ProfileData {
  name: string;
  email: string;
  phone: string | null;
  shippingStreet: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPostalCode: string | null;
  shippingCountry: string | null;
  marketingConsent: boolean;
  notifications: boolean;
}

interface TranslationsType {
  welcome: {
    title: string;
    greeting: string;
  };
  profile: {
    title: string;
    edit: string;
    name: string;
    email: string;
    phone: string;
    shippingAddress: string;
  };
  orders: {
    title: string;
    viewAll: string;
    noOrders: string;
    startShopping: string;
  };
  subscriptions: {
    title: string;
    manage: string;
    noSubscriptions: string;
    explorePlans: string;
  };
  preferences: {
    title: string;
    marketingEmails: string;
    orderNotifications: string;
    on: string;
    off: string;
  };
}

interface AccountDashboardProps {
  profile: ProfileData;
  translations: TranslationsType;
}

export default function AccountDashboard({ profile, translations: t }: AccountDashboardProps) {
  const router = useRouter();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h1 className="font-display text-4xl mb-2">{t.welcome.title}</h1>
        <p className="text-stone-600">{t.welcome.greeting}</p>
      </motion.div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">{t.profile.title}</h2>
            <button
              onClick={() => router.push('/account/profile')}
              className="text-primary-600 hover:text-primary-700"
            >
              {t.profile.edit}
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-stone-600">
              <span className="font-medium">{t.profile.name}:</span> {profile.name}
            </p>
            <p className="text-stone-600">
              <span className="font-medium">{t.profile.email}:</span> {profile.email}
            </p>
            {profile.phone && (
              <p className="text-stone-600">
                <span className="font-medium">{t.profile.phone}:</span> {profile.phone}
              </p>
            )}
            {profile.shippingStreet && (
              <div className="text-stone-600">
                <span className="font-medium">{t.profile.shippingAddress}:</span>
                <p className="mt-1">
                  {profile.shippingStreet}
                  <br />
                  {profile.shippingCity}, {profile.shippingState} {profile.shippingPostalCode}
                  <br />
                  {profile.shippingCountry}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">{t.orders.title}</h2>
            <button
              onClick={() => router.push('/account/orders')}
              className="text-primary-600 hover:text-primary-700"
            >
              {t.orders.viewAll}
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-stone-600">{t.orders.noOrders}</p>
            <button
              onClick={() => router.push('/products')}
              className="btn-primary w-full"
            >
              {t.orders.startShopping}
            </button>
          </div>
        </motion.div>

        {/* Active Subscriptions */}
        <motion.div variants={itemVariants} className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">{t.subscriptions.title}</h2>
            <button
              onClick={() => router.push('/account/subscriptions')}
              className="text-primary-600 hover:text-primary-700"
            >
              {t.subscriptions.manage}
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-stone-600">{t.subscriptions.noSubscriptions}</p>
            <button
              onClick={() => router.push('/subscriptions')}
              className="btn-primary w-full"
            >
              {t.subscriptions.explorePlans}
            </button>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="font-display text-2xl mb-4">{t.preferences.title}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-stone-600">{t.preferences.marketingEmails}</span>
              <span className="text-primary-600">
                {profile.marketingConsent ? t.preferences.on : t.preferences.off}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600">{t.preferences.orderNotifications}</span>
              <span className="text-primary-600">
                {profile.notifications ? t.preferences.on : t.preferences.off}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 