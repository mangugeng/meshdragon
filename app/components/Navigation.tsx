'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Navigation() {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href={`/${locale}`}
            className="text-xl font-bold text-white hover:text-gray-200 transition-colors"
          >
            MeshDragon
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href={`/${locale}/features`}
              className={`text-sm ${isActive('/features') ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
            >
              {t('features')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className={`text-sm ${isActive('/about') ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
            >
              {t('about')}
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/en"
                className={`text-sm ${locale === 'en' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
              >
                {t('english')}
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/id"
                className={`text-sm ${locale === 'id' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
              >
                {t('indonesian')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 