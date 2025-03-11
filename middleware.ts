import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // List bahasa yang didukung
  locales: ['en', 'id'],
  
  // Bahasa default
  defaultLocale: 'id'
});

export const config = {
  // Match semua path kecuali yang dimulai dengan: api/*, _next/*, _vercel/*, dll
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 