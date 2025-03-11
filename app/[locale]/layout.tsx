import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Navigation from '../components/Navigation'
import { Metadata } from 'next'
import '../globals.css'
import { unstable_setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Inter } from 'next/font/google'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import DismissibleBanner from '@/app/components/DismissibleBanner'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default
    const t = messages.Metadata

    return {
      title: t.title,
      description: t.description,
      icons: {
        icon: '/favicon.ico'
      }
    }
  } catch {
    return {
      title: 'MeshDragon - Web3D Platform',
      description: 'Create and share stunning 3D visualizations with MeshDragon',
      icons: {
        icon: '/favicon.ico'
      }
    }
  }
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'id' }]
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  let messages
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch {
    notFound()
  }

  unstable_setRequestLocale(locale)
  const t = useTranslations('Layout')

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <DismissibleBanner 
          message="Chrome akan memperbarui pengalaman browsing dengan membatasi cookie pihak ketiga. Hal ini mungkin mempengaruhi beberapa fitur website." 
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar />
          <Navigation />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}