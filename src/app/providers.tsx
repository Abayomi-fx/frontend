'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { WalletProvider, useWallet } from '../wallet/WalletProvider'
import { ToastProvider, SessionTimeoutModal, useToast } from '../components'
import { WatchlistProvider } from '../watchlist/WatchlistProvider'
import { useSessionTimeout } from '../hooks/useSessionTimeout'

function SessionWatcher() {
  const { connected, disconnect } = useWallet()
  const { toast } = useToast()

  const { isWarningOpen, formattedRemaining, extendSession, expireNow } = useSessionTimeout({
    enabled: connected,
    onTimeout: () => {
      disconnect()
      toast({
        tone: 'error',
        title: 'Session expired',
        message: 'You have been disconnected due to inactivity.',
      })
    },
  })

  return (
    <SessionTimeoutModal
      open={isWarningOpen}
      formattedTime={formattedRemaining}
      onExtend={extendSession}
      onLogout={expireNow}
    />
  )
}

function OfflineBanner() {
  const { connected } = useWallet()
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [wasConnected, setWasConnected] = useState(() => {
    try {
      return localStorage.getItem('stellar-wallet-connected') === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (connected) {
      try {
        localStorage.setItem('stellar-wallet-connected', 'true')
      } catch {
        // ignore storage errors
      }
      setWasConnected(true)
    }
  }, [connected])

  const showOffline = !isOnline || (wasConnected && !connected)
  if (!showOffline) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        backgroundColor: '#f97316', // orange
        color: 'white',
        textAlign: 'center',
        zIndex: 9999,
        fontSize: '0.875rem',
      }}
    >
      <strong>Offline</strong> — Showing cached data. Attempting to reconnect...
    </div>
  )
}

/**
 * Client providers that must persist across route changes: theme (After Sunset
 * dark mode) and wallet (Stellar connection). LocaleProvider lives one level up
 * so it can be seeded with the server-resolved locale and messages.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <ToastProvider>
          <WatchlistProvider>
            <SessionWatcher />
            <OfflineBanner />
            {children}
          </WatchlistProvider>
        </ToastProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}
