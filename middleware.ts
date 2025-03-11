import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // List bahasa yang didukung
  locales: ['en', 'id'],

  // Bahasa default
  defaultLocale: 'id',

  // Lokalisasi paths
  localePrefix: 'always'
});

export const config = {
  // Match semua path kecuali:
  // - API routes (/api/*)
  // - Static files (*.jpg, *.png, dll)
  // - Internal Next.js files
  matcher: ['/', '/(en|id)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
}; 