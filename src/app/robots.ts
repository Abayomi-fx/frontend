import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/explore', '/creator', '/project/'],
      disallow: ['/admin', '/portfolio', '/deposit', '/withdraw'],
    },
    sitemap: 'https://heliobond.vercel.app/sitemap.xml',
  }
}
