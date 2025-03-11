'use client';

import { useState } from 'react';
import CloseButton from './CloseButton';

interface HeroSectionProps {
  children: React.ReactNode;
}

export default function HeroSection({ children }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative">
      <CloseButton onClose={() => setIsVisible(false)} />
      {children}
    </div>
  );
} 