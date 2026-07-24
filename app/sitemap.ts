import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/brand';
import { TEST_LANDING_PATHS } from '@/lib/seo';
import { routing } from '@/i18n/routing';
import type { Category } from '@/lib/types';

const PUBLIC_PATHS = [
  '',
  ...TEST_LANDING_PATHS,
  '/premium',
  '/feedback',
  '/privacy',
  '/terms',
  '/refund',
  '/about',
  '/resources/faq',
  '/resources/guide',
  '/resources/handbook',
  '/resources/signs',
  '/resources/glossary',
  '/resources/costs',
  '/resources/foreigners',
  '/resources/license-classes',
  '/resources/roadmap',
  '/resources/practical-checklist',
  '/resources/memory-tips',
  '/resources/demerit-points',
] as const;

const CATEGORIES: Category[] = ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto'];
const QUIZ_MODES = ['lesson', 'practice', 'test'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of PUBLIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === '' ? 'weekly' : path.match(/^\/(btt|ftt|rtt)$/) ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : path.match(/^\/(btt|ftt|rtt)$/) ? 0.95 : path.startsWith('/resources') ? 0.8 : 0.7,
      });
    }

    for (const category of CATEGORIES) {
      for (const mode of QUIZ_MODES) {
        entries.push({
          url: `${SITE_URL}/${locale}/quiz/${category}/${mode}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      }
    }
  }

  return entries;
}
