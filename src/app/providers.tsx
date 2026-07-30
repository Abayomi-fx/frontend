'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { WalletProvider } from '../wallet/WalletProvider'
import { ToastProvider } from '../components'

/**
 * Client providers that must persist across route changes: theme (After Sunset
 * dark mode) and wallet (Stellar connection). LocaleProvider lives one level up
 * so it can be seeded with the server-resolved locale and messages.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <ToastProvider>{children}</ToastProvider>
      </WalletProvider>
    </ThemeProvider>
  )
}
