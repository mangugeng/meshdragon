'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { ChangeEvent } from 'react'

export default function LanguageSwitcher() {
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const newPath = pathname.startsWith('/' + locale) 
      ? pathname.replace('/' + locale, '/' + newLocale)
      : '/' + newLocale + pathname
    router.push(newPath)
  }

  return (
    <div className="relative inline-block text-left">
      <select
        id="language-select"
        value={locale}
        onChange={handleLanguageChange}
        className="block w-full px-3 py-2 text-sm text-gray-300 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500"
        aria-label={t('language')}
      >
        <option value="en" className="bg-gray-800">English</option>
        <option value="id" className="bg-gray-800">Indonesia</option>
      </select>
    </div>
  )
} 