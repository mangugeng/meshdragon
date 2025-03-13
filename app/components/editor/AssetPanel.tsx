'use client';

import * as THREE from 'three';
import { useState, useCallback } from 'react';

interface AssetPanelProps {
  onModelLoad: (model: THREE.Object3D) => void;
}

export default function AssetPanel({ onModelLoad }: AssetPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [assets, setAssets] = useState<{ name: string; type: string }[]>([]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const fileURL = URL.createObjectURL(file);
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'gltf' || fileExtension === 'glb') {
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
          loader.load(fileURL, resolve, undefined, reject);
        });
        // @ts-ignore - we know gltf has scene
        onModelLoad(gltf.scene);
        setAssets(prev => [...prev, { 
          name: file.name, 
          type: fileExtension 
        }]);
      } else {
        console.warn('Format file tidak didukung. Silakan upload file .glb atau .gltf');
      }
    } catch (error) {
      console.error('Error loading model:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onModelLoad]);

  return (
    <div className="absolute left-4 top-4 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
      <h2 className="text-white font-semibold mb-4">Asset Panel</h2>
      <input
        type="file"
        accept=".gltf,.glb"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-600 file:text-white
          hover:file:bg-blue-500"
      />
      {isLoading && (
        <div className="mt-2 text-white">Loading...</div>
      )}

      {/* Asset List */}
      <div className="space-y-2 mt-4">
        <h3 className="font-medium mb-2">Uploaded Models</h3>
        {assets.length === 0 ? (
          <p className="text-gray-400 text-sm">No models uploaded yet</p>
        ) : (
          <ul className="space-y-1">
            {assets.map((asset, index) => (
              <li key={index} className="text-sm text-gray-300">
                {asset.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 