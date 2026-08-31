import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Turbopack (dev) handles code-splitting automatically — no webpack override needed.
  // The three/react-three chunk is naturally split by Turbopack's dependency graph.
  //
  // If you ever need to opt specific packages into a custom Turbopack rule, use:
  //   experimental: { turbo: { rules: { ... } } }
  // Reference: https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(nextConfig)
