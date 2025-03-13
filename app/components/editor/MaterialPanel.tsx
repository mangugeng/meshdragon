'use client';

import { useState } from 'react';
import * as THREE from 'three';

interface MaterialPanelProps {
  selectedObject: THREE.Object3D | null;
  onUpdateMaterial: (material: THREE.Material) => void;
}

export default function MaterialPanel({ selectedObject, onUpdateMaterial }: MaterialPanelProps) {
  const [materialType, setMaterialType] = useState<'standard' | 'basic' | 'phong'>('standard');
  const [color, setColor] = useState('#ffffff');
  const [roughness, setRoughness] = useState(0.5);
  const [metalness, setMetalness] = useState(0);
  const [shininess, setShininess] = useState(30);

  const handleMaterialTypeChange = (type: 'standard' | 'basic' | 'phong') => {
    setMaterialType(type);
    applyMaterial(type);
  };

  const applyMaterial = (type: 'standard' | 'basic' | 'phong') => {
    if (!selectedObject) return;

    let material: THREE.Material;
    const colorValue = new THREE.Color(color);

    switch (type) {
      case 'standard':
        material = new THREE.MeshStandardMaterial({
          color: colorValue,
          roughness,
          metalness
        });
        break;
      case 'basic':
        material = new THREE.MeshBasicMaterial({
          color: colorValue
        });
        break;
      case 'phong':
        material = new THREE.MeshPhongMaterial({
          color: colorValue,
          shininess
        });
        break;
      default:
        return;
    }

    onUpdateMaterial(material);
  };

  if (!selectedObject) {
    return (
      <div className="text-gray-400 text-center">
        Select an object to edit its material
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Materials</h3>

      {/* Material Type */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Material Type</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['standard', 'basic', 'phong'] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleMaterialTypeChange(type)}
              className={`p-2 rounded-md text-sm font-medium transition-colors ${
                materialType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Color</h4>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            applyMaterial(materialType);
          }}
          className="w-full h-10 bg-gray-700 rounded-md cursor-pointer"
        />
      </div>

      {/* Material-specific properties */}
      {materialType === 'standard' && (
        <>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Roughness</h4>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={roughness}
              onChange={(e) => {
                setRoughness(parseFloat(e.target.value));
                applyMaterial(materialType);
              }}
              className="w-full"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Metalness</h4>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={metalness}
              onChange={(e) => {
                setMetalness(parseFloat(e.target.value));
                applyMaterial(materialType);
              }}
              className="w-full"
            />
          </div>
        </>
      )}

      {materialType === 'phong' && (
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Shininess</h4>
          <input
            type="range"
            min="0"
            max="100"
            value={shininess}
            onChange={(e) => {
              setShininess(parseInt(e.target.value));
              applyMaterial(materialType);
            }}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
} 