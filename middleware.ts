import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // List bahasa yang didukung
  locales: ['en', 'id'],

  // Bahasa default
  defaultLocale: 'id',

  // Lokalisasi paths
  localePrefix: 'always',

  // Redirect ke halaman 404 yang sesuai
  localeDetection: true
});

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Hapus deviceorientation dari Permissions-Policy header
  if (response.headers.has('Permissions-Policy')) {
    const permissionsPolicy = response.headers.get('Permissions-Policy')!
      .split(',')
      .filter(policy => !policy.includes('deviceorientation'))
      .join(',');
    response.headers.set('Permissions-Policy', permissionsPolicy);
  }

  return response;
}

export const config = {
  // Match semua path kecuali:
  // - API routes (/api/*)
  // - Static files (*.jpg, *.png, dll)
  // - Internal Next.js files
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)', '/(en|id)/:path*']
}; 