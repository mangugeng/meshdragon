'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootNotFound() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect ke halaman 404 dengan bahasa default (id)
    router.replace('/id/404');
  }, [router]);

  return null;
} 