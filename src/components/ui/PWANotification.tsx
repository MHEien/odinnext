'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeUser, unsubscribeUser } from '@/lib/actions/pwa-actions'
import { Bell } from 'lucide-react'

// Define a compatible interface for PushSubscriptionData that matches web-push requirements
interface WebPushSubscription {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export default function PWANotification({isStandalone}: {isStandalone: boolean | undefined}) {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Check if push notifications are supported
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  }

  async function subscribeToPush() {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      })
      setSubscription(sub)

      // Send subscription to server
      const serializedSub = JSON.parse(JSON.stringify(sub)) as WebPushSubscription
      await subscribeUser(serializedSub)
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true)
    try {
      if (subscription) {
        await subscription.unsubscribe()
        await unsubscribeUser(subscription.endpoint)
        setSubscription(null)
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  if (!isSupported || !isStandalone) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Notification Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-700 hover:bg-amber-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        aria-label="Notification preferences"
      >
        <Bell size={20} />
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile - closes popover when clicked */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Popover Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-16 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col gap-2 p-4">
                <h3 className="text-lg font-display">Notifications</h3>
                
                {subscription ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You will receive notifications for new products and offers.
                    </p>
                    <button 
                      onClick={unsubscribeFromPush}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Unsubscribing...' : 'Unsubscribe from notifications'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get notified about new products and special offers.
                    </p>
                    <button 
                      onClick={subscribeToPush}
                      disabled={isLoading}
                      className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-sm transition-colors disabled:opacity-50"
                    >
                      {isLoading ? 'Subscribing...' : 'Enable notifications'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 