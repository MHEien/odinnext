'use client'

import { useState, useEffect } from 'react'
import PWAInstall from './PWAInstall'
import PWANotification from './PWANotification'

export default function PWAProvider() {
  const [mounted, setMounted] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  //Check if desktop or mobile
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;

  useEffect(() => {


    // Check if already installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    // Handle the install prompt event for non-iOS devices
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Store the event for later use

    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    }
  }, [])
  // Only show PWA components after mounting to avoid hydration issues
  useEffect(() => {
      setMounted(true)
  }, [])

  // Don't render anything on the server
  if (!mounted || isDesktop) {
    return null
  }

  return (
    <>
      <PWAInstall />
      <PWANotification isStandalone={isStandalone} />
    </>
  )
} 