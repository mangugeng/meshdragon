import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { unstable_setRequestLocale } from 'next-intl/server'
import { Inter } from 'next/font/google'
import '../globals.css'
import ClientLayout from './ClientLayout'

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

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}