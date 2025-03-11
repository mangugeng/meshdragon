'use client';

import { useState } from 'react';

interface CloseButtonProps {
  className?: string;
  onClose?: () => void;
}

export default function CloseButton({ className = '', onClose }: CloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className={`absolute -top-3 -right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all border border-white/20 ${className}`}
      aria-label="Close"
    >
      <span className="text-white text-xl">&times;</span>
    </button>
  );
} 