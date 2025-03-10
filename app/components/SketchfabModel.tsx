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

export default function SketchfabModel({ modelId, title, author, authorUrl, ui_controls, ui_infos }: SketchfabModelProps) {
  const t = useTranslations('Model')
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?ui_infos=${ui_infos}&ui_controls=${ui_controls}&transparent=1&autostart=1&navigationMode=drag&preload=1`

  return (
    <div className="relative w-full h-full">
      <iframe
        title={`${title} by ${author}`}
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking; autoplay; fullscreen"
        frameBorder="0"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute bottom-0 right-0 p-2 text-xs text-white bg-black bg-opacity-50">
        <a href={authorUrl} target="_blank" rel="noopener noreferrer">
          {t('by')} {author}
        </a>
      </div>
    </div>
  )
} 