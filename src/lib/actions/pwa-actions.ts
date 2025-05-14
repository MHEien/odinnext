'use server'

import webpush from 'web-push'

// Define a compatible interface for our subscription that matches web-push expectations
interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expirationTime?: number | null;
}

// Initialize VAPID details (you'll need to set these environment variables)
webpush.setVapidDetails(
  'mailto:contact@odinchocolate.com', // Replace with your actual email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

// In a production app, you'd store subscriptions in your database
// For simplicity, we're keeping it in memory for now
let subscriptions: WebPushSubscription[] = []

/**
 * Add a user's push subscription to the list
 */
export async function subscribeUser(sub: WebPushSubscription) {
  // In a production app, you'd save this to your database
  // Example: await prisma.pushSubscription.create({ data: { ...sub } })
  subscriptions.push(sub)
  return { success: true }
}

/**
 * Remove a user's push subscription from the list
 */
export async function unsubscribeUser(endpoint: string) {
  // In a production app, you'd delete this from your database
  // Example: await prisma.pushSubscription.delete({ where: { endpoint } })
  subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint)
  return { success: true }
}

/**
 * Send a push notification to all subscribed users
 */
export async function sendNotification(message: string, title: string = 'Odin Chocolate') {
  if (subscriptions.length === 0) {
    return { success: false, error: 'No subscriptions available' }
  }

  const failedSubscriptions: string[] = []
  
  // Send notification to all subscriptions
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title,
          body: message,
          icon: '/pwa-icons/icon-192x192.png',
        })
      )
    } catch (error) {
      console.error('Error sending push notification:', error)
      failedSubscriptions.push(subscription.endpoint)
      
      // Remove failed subscription (it might be expired)
      subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint)
    }
  }

  return { 
    success: true, 
    sent: subscriptions.length - failedSubscriptions.length,
    failed: failedSubscriptions.length
  }
} 