'use client'

import { useTranslations } from 'next-intl'

interface SketchfabModelProps {
  modelId: string
  title: string
  author: string
  authorUrl: string
  ui_controls: boolean
  ui_infos: boolean
}

export default function SketchfabModel({
  modelId,
  title,
  author,
  authorUrl,
  ui_controls,
  ui_infos
}: SketchfabModelProps) {
  const t = useTranslations('Model')
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_controls=${ui_controls ? 1 : 0}&ui_infos=${ui_infos ? 1 : 0}`

  return (
    <div className="relative w-full h-full">
      <iframe
        title={title}
        frameBorder="0"
        allowFullScreen
        loading="lazy"
        src={embedUrl}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        allow="autoplay; fullscreen; xr-spatial-tracking"
      />
      <div className="absolute bottom-0 right-0 p-2 text-xs text-white/70 bg-black/30 backdrop-blur-sm rounded-tl">
        <a 
          href={authorUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          {t('by')} {author}
        </a>
      </div>
    </div>
  )
} 