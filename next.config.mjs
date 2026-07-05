import createNextIntlPlugin from 'next-intl/plugin';
import { fileURLToPath } from 'url';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
};

export default withNextIntl(nextConfig);
