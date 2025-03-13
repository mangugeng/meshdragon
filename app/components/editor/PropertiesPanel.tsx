'use client';

import { useState, useEffect } from 'react';
import * as THREE from 'three';

interface PropertiesPanelProps {
  selectedObject: THREE.Object3D | null;
  onUpdateProperties: (properties: {
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
  }) => void;
}

interface Vector3Input {
  x: number;
  y: number;
  z: number;
}

export default function PropertiesPanel({
  selectedObject,
  onUpdateProperties,
}: PropertiesPanelProps) {
  const [position, setPosition] = useState<Vector3Input>({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState<Vector3Input>({ x: 0, y: 0, z: 0 });
  const [scale, setScale] = useState<Vector3Input>({ x: 1, y: 1, z: 1 });

  useEffect(() => {
    if (selectedObject) {
      setPosition({
        x: selectedObject.position.x,
        y: selectedObject.position.y,
        z: selectedObject.position.z,
      });
      setRotation({
        x: THREE.MathUtils.radToDeg(selectedObject.rotation.x),
        y: THREE.MathUtils.radToDeg(selectedObject.rotation.y),
        z: THREE.MathUtils.radToDeg(selectedObject.rotation.z),
      });
      setScale({
        x: selectedObject.scale.x,
        y: selectedObject.scale.y,
        z: selectedObject.scale.z,
      });
    }
  }, [selectedObject]);

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    onUpdateProperties({
      position: new THREE.Vector3(newPosition.x, newPosition.y, newPosition.z),
    });
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newRotation = { ...rotation, [axis]: value };
    setRotation(newRotation);
    onUpdateProperties({
      rotation: new THREE.Euler(
        THREE.MathUtils.degToRad(newRotation.x),
        THREE.MathUtils.degToRad(newRotation.y),
        THREE.MathUtils.degToRad(newRotation.z)
      ),
    });
  };

  const handleScaleChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newScale = { ...scale, [axis]: value };
    setScale(newScale);
    onUpdateProperties({
      scale: new THREE.Vector3(newScale.x, newScale.y, newScale.z),
    });
  };

  if (!selectedObject) {
    return (
      <div className="text-gray-400 text-center">
        Select an object to edit its properties
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Properties</h3>

      {/* Position */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Position</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis}>
              <label className="block text-xs text-gray-400 mb-1">{axis.toUpperCase()}</label>
              <input
                type="number"
                value={position[axis]}
                onChange={(e) => handlePositionChange(axis, parseFloat(e.target.value))}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded-md text-sm"
                step="0.1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Rotation (deg)</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis}>
              <label className="block text-xs text-gray-400 mb-1">{axis.toUpperCase()}</label>
              <input
                type="number"
                value={rotation[axis]}
                onChange={(e) => handleRotationChange(axis, parseFloat(e.target.value))}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded-md text-sm"
                step="1"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Scale</h4>
        <div className="grid grid-cols-3 gap-2">
          {(['x', 'y', 'z'] as const).map((axis) => (
            <div key={axis}>
              <label className="block text-xs text-gray-400 mb-1">{axis.toUpperCase()}</label>
              <input
                type="number"
                value={scale[axis]}
                onChange={(e) => handleScaleChange(axis, parseFloat(e.target.value))}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded-md text-sm"
                step="0.1"
                min="0.1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 