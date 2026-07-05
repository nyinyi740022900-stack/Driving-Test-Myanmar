import type { MetadataRoute } from 'next';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: BRAND_NAME,
    description: BRAND_TAGLINE,
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F3EA',
    theme_color: '#1B9C56',
    icons: [
      {
        src: '/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/icons/favicon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
