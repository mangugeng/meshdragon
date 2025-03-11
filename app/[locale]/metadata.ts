import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    const t = messages.Metadata;

    return {
      title: t.title,
      description: t.description,
      icons: {
        icon: '/favicon.ico'
      }
    };
  } catch {
    return {
      title: 'MeshDragon - Web3D Platform',
      description: 'Create and share stunning 3D visualizations with MeshDragon',
      icons: {
        icon: '/favicon.ico'
      }
    };
  }
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'id' }];
} 