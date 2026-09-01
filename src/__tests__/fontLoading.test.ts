import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(process.cwd())
const fontsCssPath = resolve(root, 'src/styles/tokens/fonts.css')
const layoutPath = resolve(root, 'src/app/layout.tsx')

function readFile(path: string) {
  return readFileSync(path, 'utf8')
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Origins the webfont CSS and binaries are served from, and whether fonts are
 *  fetched from them in CORS mode (which is what `crossorigin` marks). */
const FONT_ORIGINS = [
  { href: 'https://api.fontshare.com', servesBinaries: false },
  { href: 'https://cdn.fontshare.com', servesBinaries: true },
  { href: 'https://fonts.googleapis.com', servesBinaries: false },
  { href: 'https://fonts.gstatic.com', servesBinaries: true },
]

describe('webfont loading strategy', () => {
  it('requests every CDN stylesheet with a swap display strategy', () => {
    const css = readFile(fontsCssPath)
    const imports = css.match(/@import url\('[^']+'\);/g) ?? []

    expect(imports).toHaveLength(2)
    for (const rule of imports) {
      expect(rule).toContain('display=swap')
    }
  })

  it('loads the display, body and data faces from their official CDNs', () => {
    const css = readFile(fontsCssPath)

    expect(css).toContain('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@500,700,800')
    expect(css).toContain('family=Hanken+Grotesk')
    expect(css).toContain('family=Spline+Sans+Mono')
  })

  it('preconnects to each font origin from the document head', () => {
    const layout = readFile(layoutPath)

    for (const { href } of FONT_ORIGINS) {
      expect(layout).toContain(`<link rel="preconnect" href="${href}"`)
    }
  })

  it('marks only the binary-serving origins as cross-origin', () => {
    const layout = readFile(layoutPath)

    for (const { href, servesBinaries } of FONT_ORIGINS) {
      const pattern = new RegExp(`<link rel="preconnect" href="${escapeRegExp(href)}"[^>]*/>`)
      const tag = layout.match(pattern)?.[0]

      expect(tag).toBeDefined()
      expect(tag?.includes('crossOrigin="anonymous"')).toBe(servesBinaries)
    }
  })
})
