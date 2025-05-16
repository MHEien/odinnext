'use client'

import { useState, useEffect } from 'react'

// Define a proper type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstall() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  

  useEffect(() => {
    // Check if it's iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream
    )

    // Check if already installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    // Handle the install prompt event for non-iOS devices
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Store the event for later use
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show the install button
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()
    
    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice
    
    // Reset the deferred prompt variable
    setDeferredPrompt(null)
    setShowInstallButton(false)
    
    // Log the outcome of the prompt
    console.log('User choice:', choiceResult.outcome)
  }

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {isIOS ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-white">
            Install this app on your device
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tap the share button
            <span className="mx-1">⎙</span>
            and then &quot;Add to Home Screen&quot;
            <span className="mx-1">➕</span>
          </p>
        </div>
      ) : showInstallButton ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">
            Install our app for a better experience
          </p>
          <button 
            onClick={handleInstallClick}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md text-sm transition-colors"
          >
            Install
          </button>
        </div>
      ) : null}
    </div>
  )
} 