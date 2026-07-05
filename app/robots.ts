import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/brand';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/en/admin', '/my/admin', '/ja/admin'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
