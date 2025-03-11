'use client';

import { useTranslations } from 'next-intl';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import DismissibleBanner from '../components/DismissibleBanner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Layout');

  return (
    <>
      <DismissibleBanner
        message="This website is currently under development. Some features may not work as expected."
      />
      <Navigation />
      {children}
      <Footer />
    </>
  );
} 