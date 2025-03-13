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
}

export default function ExportPanel({ onExport }: ExportPanelProps) {
  const [config, setConfig] = useState<ExportConfig>({
    title: 'My 3D Scene',
    description: 'Generated with MeshDragon',
    includeOrbitControls: true,
    includeLighting: true,
    includeStats: false,
    backgroundColor: '#000000',
    responsive: true
  });

  const handleExport = () => {
    onExport(config);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Export</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Page Title</label>
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
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.includeOrbitControls}
              onChange={(e) => setConfig({ ...config, includeOrbitControls: e.target.checked })}
              className="form-checkbox"
            />
            <span className="text-sm text-gray-300">Include Orbit Controls</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.includeLighting}
              onChange={(e) => setConfig({ ...config, includeLighting: e.target.checked })}
              className="form-checkbox"
            />
            <span className="text-sm text-gray-300">Include Lighting</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.includeStats}
              onChange={(e) => setConfig({ ...config, includeStats: e.target.checked })}
              className="form-checkbox"
            />
            <span className="text-sm text-gray-300">Include Performance Stats</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.responsive}
              onChange={(e) => setConfig({ ...config, responsive: e.target.checked })}
              className="form-checkbox"
            />
            <span className="text-sm text-gray-300">Responsive</span>
          </label>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Background Color</label>
          <input
            type="color"
            value={config.backgroundColor}
            onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
            className="w-full bg-gray-700 rounded-md h-8"
          />
        </div>

        <button
          onClick={handleExport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Export to HTML
        </button>
      </div>
    </div>
  );
} 