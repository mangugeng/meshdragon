'use client'

import dynamic from 'next/dynamic'

const SketchfabModel = dynamic(() => import('./SketchfabModel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black/50">
      <div className="text-white">Loading 3D Model...</div>
    </div>
  )
})

interface ModelViewerProps {
  modelId: string
  title: string
  author: string
  authorUrl: string
  ui_controls?: boolean
  ui_infos?: boolean
}

export default function ModelViewer(props: ModelViewerProps) {
  return <SketchfabModel {...props} ui_controls={props.ui_controls ?? false} ui_infos={props.ui_infos ?? false} />
} 