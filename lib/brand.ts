/** Public product name — Singapore & Japan driving theory practice */
export const BRAND_NAME = 'TheoryLane';

export const BRAND_TAGLINE =
  'Singapore & Japan driving theory test practice — in your language.';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theorylane.app';

/** Bump when favicon assets change so mobile browsers fetch fresh icons */
export const FAVICON_VERSION = '3';

/** Square logo for favicons, Open Graph, and structured data */
export const BRAND_LOGO_PATH = '/icons/icon-192.png';
export const BRAND_LOGO_URL = `${SITE_URL}${BRAND_LOGO_PATH}`;

export function faviconHref(path: string): string {
  return `${path}?v=${FAVICON_VERSION}`;
}

export const SUPPORT_EMAIL = 'nyinyi1451996@icloud.com';
