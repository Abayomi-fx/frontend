import { colors, lightPalette, darkPalette, type ColorTokens, type Palette } from './colors'
import {
  spacing,
  spacePx,
  radii,
  radiusPx,
  layout,
  zIndex,
  type SpacingTokens,
  type RadiiTokens,
  type LayoutTokens,
  type ZIndexTokens,
} from './spacing'
import {
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  type FontsTokens,
  type FontSizesTokens,
  type FontWeightsTokens,
} from './typography'
import { shadows, type ShadowTokens } from './shadows'
import { breakpoints, media, type BreakpointTokens, type MediaTokens } from './breakpoints'
import * as styles from './styles'

/**
 * Unified Heliobond Theme Configuration
 *
 * Central theme object consolidating all design tokens, geometry, typography, and reusable styles.
 */
export const theme = {
  colors,
  palettes: {
    light: lightPalette,
    dark: darkPalette,
  },
  spacing,
  spacePx,
  radii,
  radiusPx,
  layout,
  zIndex,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  shadows,
  breakpoints,
  media,
  styles,
} as const

export type ThemeConfig = typeof theme
export type {
  ColorTokens,
  Palette,
  SpacingTokens,
  RadiiTokens,
  LayoutTokens,
  ZIndexTokens,
  FontsTokens,
  FontSizesTokens,
  FontWeightsTokens,
  ShadowTokens,
  BreakpointTokens,
  MediaTokens,
}
