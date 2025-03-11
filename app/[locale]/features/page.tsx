import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export default function Features({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Features');

  const features = [
    {
      key: 'modeling',
      icon: '🎨',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      key: 'collaboration',
      icon: '👥',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'performance',
      icon: '⚡',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      key: 'export',
      icon: '📦',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      key: 'security',
      icon: '🔒',
      gradient: 'from-red-500 to-rose-500'
    },
    {
      key: 'support',
      icon: '💬',
      gradient: 'from-indigo-500 to-violet-500'
    }
  ];

  return (
    <main className="min-h-screen bg-[#000308] text-white pt-24 md:pt-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="hero-glow top-1/4 left-1/4 animate-pulse opacity-50" />
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.key}
                className="p-6 rounded-2xl transition-transform hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, var(--${feature.gradient}-from), var(--${feature.gradient}-to))`,
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-gray-100">
                  {t(`features.${feature.key}.description`)}
                </p>
                <ul className="mt-4 space-y-2">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t(`features.${feature.key}.points.${i}`)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="hero-glow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.description')}
          </p>
          <button className="button-primary text-lg px-10 py-4">
            {t('cta.button')}
          </button>
        </div>
      </section>
    </main>
  );
} 