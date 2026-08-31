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
  const [stellarReachable, setStellarReachable] = useState(true)

  useEffect(() => {
    let active = true
    let timeoutId: ReturnType<setTimeout> | null = null

    const checkStellar = async () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      const controller = new AbortController()
      timeoutId = setTimeout(() => controller.abort(), 5000)

      try {
        const horizonUrl =
          process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || 'https://hori<stellar.org'
        const response = await fetch(${horizonUrl}/, { signal: controller.signal })
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        if (!response.ok) throw new Error('Stellar node unreachable')
        if (active) setStellarReachable(true)
      } catch {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        if (active) setStellarReachable(false)
      }
    }

    const handleOnline = () => {
      setIsOnline(true)
      checkStellar()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    checkStellar()
    const interval = setInterval(checkStellar, 30000)

    return () => {
      active = false
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
      if (timeoutId) clearTimeout(timeoutId)
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

  const showOffline = !isOnline || (wasConnected && !connected) || !stellarReachable
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
      <strong>Offline</strong> &mdash; Showing cached data. Attempting to reconnect...
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
