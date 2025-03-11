import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="min-h-screen bg-[#000308] text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
          {t('title')}
        </h2>
        <p className="text-gray-300 mb-8">
          {t('description')}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
        >
          {t('button')}
        </Link>
      </div>
    </div>
  );
} 