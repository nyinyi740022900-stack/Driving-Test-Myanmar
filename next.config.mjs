import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Hosts that serve the production build but are NOT the canonical site.
 * Vercel attaches the project's *.vercel.app domain to production, so it
 * answers 200 with a byte-identical copy of every page. Google crawled both
 * and reported "Duplicate without user-selected canonical", which is half of
 * the "replicated content" flag AdSense rejected this site for.
 *
 * www.theorylane.app is handled by a 308 redirect in the Vercel dashboard.
 * The *.vercel.app host cannot be redirected there without breaking Vercel's
 * own deployment previews, so it is excluded at the header level instead.
 */
const NON_CANONICAL_HOSTS = ['web-six-eta-43.vercel.app'];

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async headers() {
    return NON_CANONICAL_HOSTS.map((host) => ({
      source: '/:path*',
      has: [{ type: 'host', value: host }],
      headers: [
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      ],
    }));
  },
};

export default withNextIntl(nextConfig);
