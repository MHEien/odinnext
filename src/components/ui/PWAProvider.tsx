'use client'

import { useState, useEffect } from 'react'
import PWAInstall from './PWAInstall'
import PWANotification from './PWANotification'

export default function PWAProvider() {
  const [mounted, setMounted] = useState(false)

  //Check if desktop or mobile
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;

  // Only show PWA components after mounting to avoid hydration issues
  useEffect(() => {
    if (!isDesktop) {
      setMounted(true)
    }
  }, [isDesktop])

  // Don't render anything on the server
  if (!mounted) {
    return null
  }

  return (
    <>
      <PWAInstall />
      <PWANotification />
    </>
  )
} 