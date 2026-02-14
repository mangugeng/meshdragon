'use client';

import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DismissibleBanner from '../components/DismissibleBanner';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEditorPage = pathname === '/editor';

  if (isEditorPage) {
    return <>{children}</>;
  }

  return (
    <>
      <DismissibleBanner message="🎉 Selamat datang di MeshDragon - Platform visualisasi 3D modern untuk kreator digital" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
} 