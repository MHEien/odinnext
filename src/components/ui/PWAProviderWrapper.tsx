'use client';

import dynamic from 'next/dynamic';

// Dynamically import the PWA provider with SSR disabled
// This is now correctly used in a client component
const PWAProvider = dynamic(() => import('./PWAProvider'), { 
  ssr: false 
});

export default function PWAProviderWrapper() {
  return <PWAProvider />;
} 