'use client';

import { useState, useCallback } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

interface AssetPanelProps {
  onModelLoad: (model: THREE.Object3D) => void;
}

export default function AssetPanel({ onModelLoad }: AssetPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [assets, setAssets] = useState<{ name: string; type: string }[]>([]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileUrl = URL.createObjectURL(file);

      let loader;
      switch (fileExtension) {
        case 'glb':
        case 'gltf':
          loader = new GLTFLoader();
          loader.load(
            fileUrl,
            (gltf) => {
              onModelLoad(gltf.scene);
              setAssets(prev => [...prev, { name: file.name, type: 'model' }]);
            },
            undefined,
            (error) => console.error('Error loading GLTF/GLB:', error)
          );
          break;
        case 'obj':
          loader = new OBJLoader();
          loader.load(
            fileUrl,
            (obj) => {
              onModelLoad(obj);
              setAssets(prev => [...prev, { name: file.name, type: 'model' }]);
            },
            undefined,
            (error) => console.error('Error loading OBJ:', error)
          );
          break;
        case 'fbx':
          loader = new FBXLoader();
          loader.load(
            fileUrl,
            (fbx) => {
              onModelLoad(fbx);
              setAssets(prev => [...prev, { name: file.name, type: 'model' }]);
            },
            undefined,
            (error) => console.error('Error loading FBX:', error)
          );
          break;
        default:
          alert('Format file tidak didukung. Silakan upload file .glb, .gltf, .obj, atau .fbx');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Terjadi kesalahan saat mengupload file');
    } finally {
      setUploading(false);
    }
  }, [onModelLoad]);

  return (
    <div className="w-64 bg-gray-800 p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Assets</h2>

      {/* Upload Button */}
      <div className="mb-4">
        <label className="block w-full">
          <input
            type="file"
            className="hidden"
            accept=".glb,.gltf,.obj,.fbx"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <span className={`block w-full text-center p-2 rounded cursor-pointer ${uploading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}>
            {uploading ? 'Uploading...' : 'Upload Model'}
          </span>
        </label>
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        <h3 className="font-medium mb-2">Uploaded Models</h3>
        {assets.length === 0 ? (
          <p className="text-gray-400 text-sm">Belum ada model yang diupload</p>
        ) : (
          <ul className="space-y-1">
            {assets.map((asset, index) => (
              <li
                key={index}
                className="text-sm p-2 bg-gray-700 rounded flex items-center justify-between"
              >
                <span className="truncate">{asset.name}</span>
                <span className="text-xs text-gray-400">{asset.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 