'use client';

import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Navigation from '../components/Navigation'
import '../globals.css'
import { unstable_setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import DismissibleBanner from '../components/DismissibleBanner'

const inter = Inter({ subsets: ['latin'] })

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
        <NextIntlClientProvider messages={messages} locale={locale}>
          <DismissibleBanner 
            message="Chrome akan memperbarui pengalaman browsing dengan membatasi cookie pihak ketiga. Hal ini mungkin mempengaruhi beberapa fitur website." 
          />
          <Navbar />
          <Navigation />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}