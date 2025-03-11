import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  // List bahasa yang didukung
  locales: ['en', 'id'],

  // Bahasa default
  defaultLocale: 'id',

  // Lokalisasi paths
  localePrefix: 'always',

  // Redirect ke halaman 404 yang sesuai
  localeDetection: true
});

export const config = {
  // Match semua path kecuali:
  // - API routes (/api/*)
  // - Static files (*.jpg, *.png, dll)
  // - Internal Next.js files
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)', '/(en|id)/:path*']
}; 