'use client';

import { useState } from 'react';

interface HeroContentProps {
  t: (key: string) => string;
}

export default function HeroContent({ t }: HeroContentProps) {
  const [showHeroContent, setShowHeroContent] = useState(true);

  return (
    <>
      {showHeroContent ? (
        <div className="relative z-10 text-center max-w-4xl mx-auto bg-black/30 backdrop-blur-sm p-8 rounded-2xl">
          <button 
            onClick={() => setShowHeroContent(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
        </div>
      ) : (
        <button
          onClick={() => setShowHeroContent(true)}
          className="fixed top-24 right-4 z-10 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/50 transition-colors"
          aria-label="Show content"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      )}
    </>
  );
} 