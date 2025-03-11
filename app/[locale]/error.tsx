'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#000308] text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-300 mb-8">
          {error.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          Try again
        </button>
      </div>
    </div>
  );
} 