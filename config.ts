export const locales = ['en', 'id'] as const;
export const defaultLocale = 'id' as const;

export const pathnames = {
  '/': '/',
  '/features': '/features',
  '/about': '/about',
} as const;

export type Pathnames = keyof typeof pathnames; 