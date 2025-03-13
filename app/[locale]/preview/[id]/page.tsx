'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function PreviewPage({ params }: { params: { id: string } }) {
  const t = useTranslations('Editor.export');
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Fetch the generated HTML from API
    fetch(`/api/preview/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.html) {
          setHtml(data.html);
          // Create blob URL for download
          const blob = new Blob([data.html], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          const iframe = document.getElementById('preview') as HTMLIFrameElement;
          if (iframe) {
            iframe.src = url;
          }
        } else {
          setError('Preview not found');
        }
      })
      .catch(err => {
        setError(err.message);
      });
  }, [params.id]);

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-red-500 mb-4">{error}</h1>
          <Link
            href="/editor"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Back to Editor
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center">
        <Link
          href="/editor"
          className="text-blue-500 hover:text-blue-400 transition-colors"
        >
          ← Back to Editor
        </Link>
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          {t('downloadButton')}
        </button>
      </div>

      {/* Preview */}
      <div className="w-full h-[calc(100vh-64px)]">
        <iframe
          id="preview"
          className="w-full h-full border-0"
          sandbox="allow-scripts"
          title="Preview"
        />
      </div>
    </div>
  );
} 