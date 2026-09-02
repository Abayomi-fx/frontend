import type { CSSProperties } from 'react'

/**
 * Heliobond Design System · Centralized Theme Style Definitions
 *
 * Predefined, typed style objects extracted from scattered component and screen definitions.
 * All properties consume design tokens to guarantee visual consistency across the application.
 */

// --- Card & Panel Styles ----------------------------------------------------

export const cardTitle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--type-h5)',
  margin: '0 0 8px',
  color: 'var(--ink)',
  letterSpacing: '-0.01em',
}

export const cardTitleLg: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--type-body-lg)',
  margin: 0,
  color: 'var(--ink)',
  letterSpacing: '-0.01em',
}

export const cardInner: CSSProperties = {
  padding: 22,
  height: '100%',
  boxSizing: 'border-box',
}

export const panelStyle: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--ink-12)',
  borderRadius: 'var(--radius-card)',
  padding: 16,
  boxShadow: 'var(--shadow-sm)',
}

export const sectionCard: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--ink-12)',
  borderRadius: 'var(--radius-card)',
  padding: 16,
  boxShadow: 'var(--shadow-sm)',
}

// --- Typography & Headings --------------------------------------------------

export const pageTitle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--type-h2)',
  margin: 0,
  color: 'var(--ink)',
}

export const sectionTitle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--type-h5)',
  margin: 0,
  color: 'var(--ink)',
}

export const subtle: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-small)',
  lineHeight: 1.5,
  color: 'var(--ink-60)',
}

export const subtleText: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-small)',
  lineHeight: 1.5,
  color: 'var(--ink-60)',
}

export const subtleBlock: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-small)',
  lineHeight: 1.5,
  color: 'var(--ink-60)',
  margin: '0 0 16px',
}

export const subtext: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-caption)',
  lineHeight: 1.5,
  color: 'var(--ink-60)',
}

export const errorText: CSSProperties = {
  margin: '8px 0 0',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-caption)',
  color: 'var(--ember)',
}

export const hintText: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-eyebrow)',
  color: 'var(--ink-60)',
  lineHeight: 1.4,
}

// --- Form & Input Styles ----------------------------------------------------

export const inputStyle: CSSProperties = {
  width: '100%',
  height: 44,
  padding: '0 14px',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-data)',
  color: 'var(--ink)',
  background: 'var(--surface)',
  border: '1px solid var(--ink-12)',
  borderRadius: 'var(--radius-input)',
  outline: 'none',
  boxSizing: 'border-box',
}

export const scoreInputStyle: CSSProperties = {
  width: 72,
  height: 36,
  padding: '0 10px',
  fontFamily: 'var(--font-data)',
  fontSize: 'var(--type-small)',
  fontFeatureSettings: '"tnum" 1',
  color: 'var(--ink)',
  background: 'var(--surface)',
  border: '1px solid var(--ink-12)',
  borderRadius: 'var(--radius-input)',
  outline: 'none',
}

export const textInput: CSSProperties = {
  minHeight: 40,
  padding: '0 12px',
  fontFamily: 'var(--font-data)',
  fontSize: 'var(--type-small)',
  fontFeatureSettings: '"tnum" 1',
}

export const labelText: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-caption)',
  fontWeight: 600,
  color: 'var(--ink)',
}

export const fieldLabel: CSSProperties = {
  ...labelText,
  display: 'block',
  marginBottom: 8,
}

export const fieldSpacing: CSSProperties = {
  marginBottom: 18,
}

export const formRowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
}

export const fieldGrowStyle: CSSProperties = {
  flex: 1,
}

export const inputGroupStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}

// --- Statistics & Metrics ---------------------------------------------------

export const statRow: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
}

export const statCell: CSSProperties = {
  flex: '1 1 0',
  minWidth: 140,
  padding: '14px 16px',
}

export const statCellLabel: CSSProperties = {
  marginBottom: 6,
}

export const statValueRow: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: 5,
  flexWrap: 'wrap',
}

export const statValue: CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontWeight: 600,
  fontSize: 'var(--type-h4)',
  color: 'var(--ink)',
  fontFeatureSettings: '"tnum" 1',
  lineHeight: 1.1,
}

export const statUnit: CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontSize: 'var(--type-fine)',
  color: 'var(--ink-60)',
}

export const scoreColumn: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
}

// --- Table Styles -----------------------------------------------------------

export const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-small)',
}

export const thBase: CSSProperties = {
  background: 'var(--ink-06)',
  padding: '10px 14px',
  position: 'sticky',
  top: 0,
  whiteSpace: 'nowrap',
  zIndex: 1,
}

export const tdStyle: CSSProperties = {
  padding: '12px 14px',
  verticalAlign: 'middle',
  color: 'var(--ink)',
}

export const numCell: CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontFeatureSettings: '"tnum" 1',
  textAlign: 'end',
  whiteSpace: 'nowrap',
}

export const typePill: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 22,
  padding: '0 9px',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-eyebrow)',
  fontWeight: 500,
}

// --- Layout Helpers ---------------------------------------------------------

export const sectionHeaderTop: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
}

export const sectionHeaderBottom: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
}

export const warningBoxStyle: CSSProperties = {
  marginTop: 10,
  padding: '10px 14px',
  borderRadius: 'var(--radius-input)',
  background: 'var(--ember-12)',
  border: '1px solid var(--ember)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-caption)',
  color: 'var(--ember)',
}

export const helpText: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-caption)',
  lineHeight: 1.5,
  color: 'var(--ink-60)',
}

export const consolePage: CSSProperties = {
  fontFamily: 'var(--font-body)',
  color: 'var(--ink)',
}

export const header: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 20,
}

export const whitelistRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  flexWrap: 'wrap',
  padding: '12px 0',
}

export const whitelistName: CSSProperties = {
  minWidth: 180,
  flex: '1 1 200px',
}

export const whitelistNameText: CSSProperties = {
  fontWeight: 600,
  fontSize: 'var(--type-small)',
}

export const whitelistMeta: CSSProperties = {
  ...subtext,
  fontSize: 'var(--type-eyebrow)',
}

export const whitelistData: CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontFeatureSettings: '"tnum" 1',
}

export const whitelistActions: CSSProperties = {
  display: 'flex',
  gap: 8,
  marginInlineStart: 'auto',
}

export const dataCaptionStyle: CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontSize: 'var(--type-caption)',
  color: 'var(--ink-60)',
}

export const gridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 16,
}

export const warningTextStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--type-small)',
  color: 'var(--ink)',
  fontWeight: 600,
}

export const moneyStyle: CSSProperties = {
  fontFamily: 'var(--font-data)',
  fontFeatureSettings: '"tnum" 1',
  color: 'var(--ink)',
}

export const panelTitleStyle: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 700,
  fontSize: 'var(--type-body)',
  margin: 0,
  color: 'var(--ink)',
}

export const panelHeaderStyle: CSSProperties = {
  marginBottom: 12,
}

export const panelBodyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}
