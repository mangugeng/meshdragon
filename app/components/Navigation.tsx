'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  const t = useTranslations('Navigation')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm w-full">
      <div className="w-full max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between w-full">
          <Link 
            href={`/${locale}`}
            className="text-xl font-bold text-white hover:text-gray-200 transition-colors"
          >
            MeshDragon
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full w-full md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
            <div className="w-full px-4 py-6 flex flex-col gap-6">
              <Link
                href={`/${locale}/features`}
                className={`text-base ${isActive('/features') ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                {t('features')}
              </Link>
              <Link
                href={`/${locale}/about`}
                className={`text-base ${isActive('/about') ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
                <Link
                  href="/en"
                  className={`text-base ${locale === 'en' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  {t('english')}
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  href="/id"
                  className={`text-base ${locale === 'id' ? 'text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                  onClick={() => setIsOpen(false)}
                >
                  {t('indonesian')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 