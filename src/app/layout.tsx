import type { Metadata, Viewport } from 'next'
import { getLocale, getMessages } from 'next-intl/server'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Providers } from './providers'
import { LocaleProvider, type Messages } from '../i18n/LocaleProvider'
import { type Locale, RTL_LOCALES } from '../i18n/request'
import { THEME_SCRIPT } from '../theme/themeScript'
import '../styles/index.css'

const TopBar = dynamic(() => import('../shell/TopBar'))
const Footer = dynamic(() => import('../shell/Footer'))

export const metadata: Metadata = {
  title: 'Heliobond — sunlight made financial',
  description:
    'Own a piece of the energy transition. From one dollar. A transparent pool funding verified green projects on Stellar.',
  icons: {
    icon: '/assets/favicon.svg',
    apple: '/assets/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Heliobond — sunlight made financial',
    description:
      'Own a piece of the energy transition. From one dollar. A transparent pool funding verified green projects on Stellar.',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Heliobond preview card',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heliobond — sunlight made financial',
    description:
      'Own a piece of the energy transition. From one dollar. A transparent pool funding verified green projects on Stellar.',
    images: ['/assets/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F3F5F1' },
    { media: '(prefers-color-scheme: dark)', color: '#0D1714' },
  ],
}

/**
 * Root layout (Server Component). Resolves the locale + messages server-side and
 * provides them to the client tree; injects the no-flash theme script; holds the
 * persistent TopBar + Footer shell around the routed page.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={RTL_LOCALES.has(locale as Locale) ? 'rtl' : 'ltr'}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHtml={{ __html: THEME_SCRIPT }} />
        {/*
          Warm the font CDN connections. The webfont stylesheets sit behind a CSS
          `@import` chain (`src/styles/index.css` → `tokens/fonts.css`), so the
          browser only discovers them once that CSS has parsed. Preconnecting here
          runs the DNS + TLS handshakes in parallel with the parse, shortening the
          window in which the `font-display: swap` faces render in the fallback.

          The hosts serving the font binaries carry `crossOrigin`, because fonts are
          always fetched in CORS mode and would otherwise need a second connection;
          the hosts serving only CSS must not, or the warmed socket goes unused.
        */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <LocaleProvider initialLocale={locale as Locale} initialMessages={messages as Messages}>
          <Providers>
            <a href="#main-content" className="hb-skip-link">
              Skip to content
            </a>
            <Suspense fallback={null}>
              <TopBar />
            </Suspense>
            {children}
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
          </Providers>
        </LocaleProvider>
      </body>
    </html>
  )
}
