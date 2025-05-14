# Progressive Web App (PWA) Setup for Odin Chocolate

This document provides information about the PWA functionality implemented in the Odin Chocolate web application.

## Overview

The application has been configured as a Progressive Web App (PWA), which allows users to:

- Install the application on their devices (mobile and desktop)
- Access content offline
- Receive push notifications

## Features

- **Installable Web App**: Users can add the app to their home screen
- **Offline Support**: Core pages and assets are cached for offline use
- **Push Notifications**: Users can subscribe to notifications for new products and promotions

## Implementation Details

The PWA implementation consists of the following components:

### 1. Web App Manifest

Located at `src/app/manifest.ts`, this file defines:
- App name and description
- Icons and theme colors
- Display mode and start URL

### 2. Service Worker

Located at `public/sw.js`, the service worker handles:
- Caching strategies for different types of content
- Offline fallback pages
- Push notification reception and display
- Notification click handling

### 3. UI Components

- **PWAInstall**: Provides installation prompts for users
- **PWANotification**: Manages push notification subscriptions
- **PWAProvider**: Combines PWA components and handles client-side rendering

## Environment Setup

To enable push notifications, you need to add the following to your `.env` file:

```
# PWA Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

Generate these keys using:

```bash
npx web-push generate-vapid-keys
```

## Required Assets

The PWA requires the following icon assets in the `public/pwa-icons/` directory:

- `icon-192x192.png`: 192×192 app icon
- `icon-512x512.png`: 512×512 app icon
- `maskable-icon.png`: 512×512 maskable icon with padding for adaptive UI

## Testing PWA Features

### Installation Testing

1. Open the site in Chrome, Edge, or another PWA-supporting browser
2. Wait for the installation prompt or use the custom install button
3. Verify the app appears on the home screen/desktop with the correct icon

### Offline Testing

1. Install the app to your device
2. Navigate to several pages to cache them
3. Turn off your network connection
4. Verify you can still access previously visited pages

### Push Notification Testing

1. Enable notifications through the UI
2. To test notifications, you'll need to use a server endpoint or the testing component in the admin panel
3. Verify the notification appears and clicking it navigates to the correct page

## Browser Support

PWA features have varying levels of support across browsers:

- **Chrome/Edge/Samsung Internet/Opera**: Full PWA support
- **Safari**: Partial support (iOS 16.4+ for home screen PWAs with push notifications)
- **Firefox**: Supports most features except installation prompts

## Next Steps for Improvement

- Implement background sync for offline form submissions
- Add periodic background sync for content updates
- Enhance offline experience with more sophisticated caching strategies
- Implement notification grouping for related messages 