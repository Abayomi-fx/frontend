/**
 * Heliobond Design System · Spacing, Radii, Layout & Z-Index Tokens
 *
 * Single source of truth for layout geometry. Mirrors src/styles/tokens/spacing.css.
 */

/**
 * 4px-based spacing scale as CSS variable references.
 */
export const spacing = {
  1: 'var(--space-1)', // 4px
  2: 'var(--space-2)', // 8px
  3: 'var(--space-3)', // 12px
  4: 'var(--space-4)', // 16px
  6: 'var(--space-6)', // 24px
  8: 'var(--space-8)', // 32px
  12: 'var(--space-12)', // 48px
  16: 'var(--space-16)', // 64px
  24: 'var(--space-24)', // 96px
  32: 'var(--space-32)', // 128px
} as const

/**
 * Numeric pixel values for spacing calculations and canvas renderers.
 */
export const spacePx = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
  24: 96,
  32: 128,
} as const

/**
 * Border radius tokens.
 */
export const radii = {
  input: 'var(--radius-input)', // 8px
  card: 'var(--radius-card)', // 16px
  modal: 'var(--radius-modal)', // 24px
  pill: 'var(--radius-pill)', // 999px
} as const

export const radiusPx = {
  input: 8,
  card: 16,
  modal: 24,
  pill: 999,
} as const

/**
 * Layout metrics.
 */
export const layout = {
  contentMax: 'var(--content-max)', // 90rem (1440px)
  gutterDesktop: 'var(--gutter-desktop)', // 32px
  gutterMobile: 'var(--gutter-mobile)', // 20px
  gridColumns: 12,
  touchMin: 'var(--touch-min)', // 44px
} as const

/**
 * Z-Index scale.
 */
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 100,
  nav: 200,
  dropdown: 400,
  sheet: 600,
  modal: 800,
  toast: 1000,
} as const

export type SpacingTokens = typeof spacing
export type RadiiTokens = typeof radii
export type LayoutTokens = typeof layout
export type ZIndexTokens = typeof zIndex
