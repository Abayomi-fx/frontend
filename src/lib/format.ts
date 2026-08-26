/**
 * Formats a number as a localized currency/money string.
 * Defaults to 'en-US' formatting.
 */
export function formatMoney(
  amount: number,
  options?: {
    includeSymbol?: boolean
    symbol?: string
    locale?: string
  },
): string {
  const locale = options?.locale ?? 'en-US'
  const formatted = amount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  if (options?.includeSymbol) {
    const symbol = options.symbol ?? '$'
    return `${symbol}${formatted}`
  }
  return formatted
}
