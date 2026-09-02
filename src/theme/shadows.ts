/**
 * Heliobond Design System · Shadow Tokens
 *
 * Ink-tinted shadows, never gray-black. Mirrors src/styles/tokens/colors.css.
 */

export const shadows = {
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
} as const

export type ShadowTokens = typeof shadows
