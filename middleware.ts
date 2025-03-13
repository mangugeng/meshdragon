import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, pathnames } from './config';

export default createMiddleware({
  // List bahasa yang didukung
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
  pathnames
});

export const config = {
  // Hanya terapkan middleware pada rute yang perlu internasionalisasi
  matcher: ['/', '/about', '/features']
}; 