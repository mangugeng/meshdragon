'use client';

import { useState } from 'react';

interface ControlPanelProps {
  onAddShape: (shapeType: string) => void;
}

export default function ControlPanel({ onAddShape }: ControlPanelProps) {
  const [activeMode, setActiveMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  const handleModeChange = (mode: 'translate' | 'rotate' | 'scale') => {
    setActiveMode(mode);
    // Set mode dan trigger event
    if (typeof window !== 'undefined') {
      (window as any).transformMode = mode;
      window.dispatchEvent(new Event('transformModeChange'));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Tools</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleModeChange('translate')}
            className={`p-2 rounded-md text-sm font-medium transition-colors ${
              activeMode === 'translate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Move
          </button>
          <button
            onClick={() => handleModeChange('rotate')}
            className={`p-2 rounded-md text-sm font-medium transition-colors ${
              activeMode === 'rotate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Rotate
          </button>
          <button
            onClick={() => handleModeChange('scale')}
            className={`p-2 rounded-md text-sm font-medium transition-colors ${
              activeMode === 'scale'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Scale
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Basic Shapes</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onAddShape('box')}
            className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            Box
          </button>
          <button
            onClick={() => onAddShape('sphere')}
            className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            Sphere
          </button>
          <button
            onClick={() => onAddShape('cylinder')}
            className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
          >
            Cylinder
          </button>
        </div>
      </div>
    </div>
  );
} 