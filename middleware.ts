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
  // Match all paths except for
  // - API routes
  // - Static files
  // - _next
  // - public folder
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 