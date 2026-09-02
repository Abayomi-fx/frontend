/**
 * Heliobond Design System · Breakpoints & Media Query Tokens
 *
 * Responsive boundaries used across the app shell and component layouts.
 */

export const breakpoints = {
  mobile: 680,
  tablet: 960,
  desktop: 1440,
} as const

export const media = {
  mobile: '@media (max-width: 680px)',
  tablet: '@media (max-width: 960px)',
  desktop: '@media (min-width: 961px)',
  hover: '@media (hover: hover) and (pointer: fine)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
} as const

export type BreakpointTokens = typeof breakpoints
export type MediaTokens = typeof media
