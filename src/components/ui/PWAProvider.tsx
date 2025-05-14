'use client'

import { useState, useEffect } from 'react'
import PWAInstall from './PWAInstall'
import PWANotification from './PWANotification'

export default function PWAProvider() {
  const [mounted, setMounted] = useState(false)

  // Only show PWA components after mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

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