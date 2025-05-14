import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Odin Chocolate',
    short_name: 'Odin',
    description: 'Odin Chocolate - Håndlaget sjokolade',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#92400e',
    icons: [
      {
        src: '/pwa-icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/pwa-icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  }
}