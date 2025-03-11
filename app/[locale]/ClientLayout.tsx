'use client';

import { useTranslations } from 'next-intl';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DismissibleBanner from '../components/DismissibleBanner';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Layout');

  return (
    <>
      <DismissibleBanner 
        message="Chrome akan memperbarui pengalaman browsing dengan membatasi cookie pihak ketiga. Hal ini mungkin mempengaruhi beberapa fitur website." 
      />
      <Navbar />
      {children}
      <Footer />
    </>
  );
} 