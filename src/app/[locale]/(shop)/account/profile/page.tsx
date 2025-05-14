'use client';

import { useState, useEffect } from 'react';
import { useRouter} from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import { updateUserProfile } from '@/lib/auth/service';
import { useLocale } from 'next-intl';
import { AppLocale } from '@/i18n/config';

interface ProfileFormData {
  name: string;
  phone: string;
  shipping: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  preferences: {
    marketing: boolean;
    notifications: boolean;
    locale: AppLocale;
  };
}

export default function ProfilePage() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const router = useRouter();
  const currentLocale = useLocale() as AppLocale;
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    shipping: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    preferences: {
      marketing: true,
      notifications: true,
      locale: currentLocale,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/sign-in');
    }
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        shipping: {
          street: profile.shippingStreet || '',
          city: profile.shippingCity || '',
          state: profile.shippingState || '',
          postalCode: profile.shippingPostalCode || '',
          country: profile.shippingCountry || '',
        },
        preferences: {
          marketing: profile.marketingConsent || true,
          notifications: profile.notifications || true,
          locale: currentLocale,
        },
      });
    }
  }, [isLoading, user, profile, router, currentLocale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (!user || !user.id) throw new Error('Not authenticated');

      await updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        shippingStreet: formData.shipping.street,
        shippingCity: formData.shipping.city,
        shippingState: formData.shipping.state,
        shippingPostalCode: formData.shipping.postalCode,
        shippingCountry: formData.shipping.country,
        marketingConsent: formData.preferences.marketing,
        notifications: formData.preferences.notifications,
        locale: formData.preferences.locale,
      });

      await refreshProfile();
      router.push('/account');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating your profile');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl mb-2">Edit Profile</h1>
            <p className="text-stone-600">Update your personal information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h2 className="font-display text-xl">Shipping Address</h2>
              <div>
                <label
                  htmlFor="street"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  value={formData.shipping.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shipping: { ...formData.shipping, street: e.target.value },
                    })
                  }
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.shipping.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping: { ...formData.shipping, city: e.target.value },
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    State/Province
                  </label>
                  <input
                    id="state"
                    type="text"
                    value={formData.shipping.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping: { ...formData.shipping, state: e.target.value },
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={formData.shipping.postalCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping: {
                          ...formData.shipping,
                          postalCode: e.target.value,
                        },
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-stone-700 mb-1"
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    value={formData.shipping.country}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping: {
                          ...formData.shipping,
                          country: e.target.value,
                        },
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h2 className="font-display text-xl">Preferences</h2>
              <div className="flex items-center">
                <input
                  id="marketing"
                  type="checkbox"
                  checked={formData.preferences.marketing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        marketing: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-stone-300 rounded"
                />
                <label
                  htmlFor="marketing"
                  className="ml-2 block text-sm text-stone-700"
                >
                  Receive marketing emails about new products and offers
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="notifications"
                  type="checkbox"
                  checked={formData.preferences.notifications}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        notifications: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-stone-300 rounded"
                />
                <label
                  htmlFor="notifications"
                  className="ml-2 block text-sm text-stone-700"
                >
                  Receive order status and shipping notifications
                </label>
              </div>
              
              <div className="mt-4">
                <label
                  htmlFor="preferredLanguage"
                  className="block text-sm font-medium text-stone-700 mb-1"
                >
                  Preferred Newsletter Language
                </label>
                <select
                  id="preferredLanguage"
                  value={formData.preferences.locale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: {
                        ...formData.preferences,
                        locale: e.target.value as AppLocale,
                      },
                    })
                  }
                  className="input-field"
                >
                  <option value="en">English</option>
                  <option value="no">Norwegian</option>
                </select>
                <p className="text-sm text-stone-500 mt-1">
                  This is the language in which you&apos;ll receive newsletters and marketing emails.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn-primary flex-1 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 