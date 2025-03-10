'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next-intl/client'
import { useTranslations } from 'next-intl'

export default function LanguageSwitcher() {
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="relative inline-block text-left">
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value)}
        className="block w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        aria-label={t('language')}
      >
        <option value="en">English</option>
        <option value="id">Indonesia</option>
      </select>
    </div>
  )
} 