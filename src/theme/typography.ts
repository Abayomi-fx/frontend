/**
 * Heliobond Design System · Typography Tokens
 *
 * Single source of truth for font families, sizes, weights, and tracking.
 * Mirrors src/styles/tokens/typography.css and fonts.css.
 */

export const fonts = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
  data: 'var(--font-data)',
  mono: 'var(--font-mono)',
} as const

export const fontSizes = {
  displayXl: 'var(--type-display-xl)', // 52–120px clamp
  displayM: 'var(--type-display-m)', // 32–56px clamp
  displayS: 'var(--type-display-s)',
  h1: 'var(--type-h1)',
  h2: 'var(--type-h2)',
  h3: 'var(--type-h3)',
  h3Sm: 'var(--type-h3-sm)',
  h4: 'var(--type-h4)',
  h5: 'var(--type-h5)',
  bodyLg: 'var(--type-body-lg)',
  body: 'var(--type-body)',
  small: 'var(--type-small)',
  caption: 'var(--type-caption)',
  eyebrow: 'var(--type-eyebrow)',
  fine: 'var(--type-fine)',
  dataL: 'var(--type-data-l)',
  dataDisplay: 'var(--type-data-display)',
  data: 'var(--type-data)',
} as const

export const fontWeights = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
} as const

export const letterSpacings = {
  tight: '-0.02em',
  snug: '-0.01em',
  normal: '0em',
  wide: '0.04em',
  caps: '0.06em',
} as const

export type FontsTokens = typeof fonts
export type FontSizesTokens = typeof fontSizes
export type FontWeightsTokens = typeof fontWeights
