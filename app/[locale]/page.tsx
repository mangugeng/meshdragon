import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import HeroSection from '../components/HeroSection';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('Index');

  const ModelViewer = dynamic(() => import('../components/ModelViewer'), {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black/50">
        <div className="text-white">Loading 3D Model...</div>
      </div>
    )
  });

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#000308] pt-24 md:pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        <div className="hero-glow top-1/4 left-1/4 animate-pulse" />
        <div className="hero-glow bottom-1/4 right-1/4 animate-pulse delay-1000" />
        <div className="absolute inset-0 z-0">
          <ModelViewer
            modelId="47ba25df43b74600b4c744164b9ba71f"
            title="Kyoto Cityscene"
            author="Artemy Belzer"
            authorUrl="https://sketchfab.com/artemybelzer"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto bg-black/30 backdrop-blur-sm p-8 rounded-2xl">
          <HeroSection>
            <span className="text-sm font-semibold tracking-wider uppercase mb-4 inline-block gradient-text">
              {t('subtitle')}
            </span>
            <h1 className="hero-title text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              {t('title')}
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {t('titleHighlight')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-300">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="button-primary w-full sm:w-auto">
                {t('cta.button')}
              </button>
              <button className="button-secondary w-full sm:w-auto">
                {t('learnMore')}
              </button>
            </div>
          </HeroSection>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="hero-glow top-0 left-1/2 opacity-30" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold tracking-wider uppercase mb-4 inline-block gradient-text">
              {t('features.title')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('features.subtitle')}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                key: 'realtime',
                icon: "🎨"
              },
              {
                key: 'performance',
                icon: "⚡"
              },
              {
                key: 'collaboration',
                icon: "👥"
              }
            ].map((feature) => (
              <div 
                key={feature.key} 
                className="card-gradient p-6 rounded-2xl hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-gray-300">
                  {t(`features.${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="hero-glow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
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
  )
} 