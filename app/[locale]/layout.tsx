import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Navigation from '../components/Navigation'

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

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navigation />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}