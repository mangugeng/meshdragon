'use client';

import { useState } from 'react';

interface ExportPanelProps {
  onExport: (config: ExportConfig) => void;
}

interface ExportConfig {
  title: string;
  description: string;
  includeOrbitControls: boolean;
  includeLighting: boolean;
  includeStats: boolean;
  backgroundColor: string;
  responsive: boolean;
  exportFormat: 'html' | 'pdf' | 'video';
  includeAnnotations: boolean;
  includeNotes: boolean;
  autoPlay: boolean;
  loop: boolean;
}

export default function ExportPanel({ onExport }: ExportPanelProps) {
  const [config, setConfig] = useState<ExportConfig>({
    title: 'My 3D Presentation',
    description: 'Generated with MeshDragon',
    includeOrbitControls: true,
    includeLighting: true,
    includeStats: false,
    backgroundColor: '#000000',
    responsive: true,
    exportFormat: 'html',
    includeAnnotations: true,
    includeNotes: true,
    autoPlay: true,
    loop: false
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Export Presentation</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Title</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Export Format</label>
          <select
            value={config.exportFormat}
            onChange={(e) => setConfig({ ...config, exportFormat: e.target.value as ExportConfig['exportFormat'] })}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          >
            <option value="html">HTML (Interactive)</option>
            <option value="pdf">PDF (Static)</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Options</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.includeOrbitControls}
              onChange={(e) => setConfig({ ...config, includeOrbitControls: e.target.checked })}
              className="rounded bg-gray-700"
            />
            <span className="text-sm text-gray-300">Include Orbit Controls</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.includeAnnotations}
              onChange={(e) => setConfig({ ...config, includeAnnotations: e.target.checked })}
              className="rounded bg-gray-700"
            />
            <span className="text-sm text-gray-300">Include Annotations</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.includeNotes}
              onChange={(e) => setConfig({ ...config, includeNotes: e.target.checked })}
              className="rounded bg-gray-700"
            />
            <span className="text-sm text-gray-300">Include Notes</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.autoPlay}
              onChange={(e) => setConfig({ ...config, autoPlay: e.target.checked })}
              className="rounded bg-gray-700"
            />
            <span className="text-sm text-gray-300">Auto Play</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.loop}
              onChange={(e) => setConfig({ ...config, loop: e.target.checked })}
              className="rounded bg-gray-700"
            />
            <span className="text-sm text-gray-300">Loop Presentation</span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Background Color</label>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
            className="w-full h-10 rounded-md"
          />
        </div>

        <button
          onClick={() => onExport(config)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
        >
          Export Presentation
        </button>
      </div>
    </div>
  );
} 