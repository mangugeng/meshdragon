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
  const isEditorPage = pathname.includes('/editor');

  return (
    <>
      {!isEditorPage && <DismissibleBanner message="🎉 Selamat datang di MeshDragon - Platform visualisasi 3D modern untuk kreator digital" />}
      {!isEditorPage && <Navbar />}
      {children}
      {!isEditorPage && <Footer />}
    </>
  );
} 