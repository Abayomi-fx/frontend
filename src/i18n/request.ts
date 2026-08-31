import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

// Locale is chosen by a cookie (set by the in-app language switcher); no
// [locale] URL segment is used, so existing routes are untouched.
export const LOCALES = ['en', 'fr', 'es', 'ar', 'pt'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', fr: 'FR', es: 'ES', ar: 'AR', pt: 'PT' }

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(['ar'] as const)

export default getRequestConfig(async () => {
  const store = await cookies()
  const cookieLocale = store.get('NEXT_LOCALE')?.value
  const locale: Locale = LOCALES.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : DEFAULT_LOCALE

  const messages = (await import(`../../messages/${locale}.json`)).default
  return { locale, messages }
})
