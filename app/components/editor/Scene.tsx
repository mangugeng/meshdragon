'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';

type ViewMode = 'perspective' | 'top' | 'front' | 'right' | 'isometric';
type NavigationMode = 'orbit' | 'pan' | 'zoom';

interface SceneProps {
  activeMode: 'translate' | 'rotate' | 'scale';
  selectedObject: THREE.Object3D | null;
  setSelectedObject: (obj: THREE.Object3D | null) => void;
  viewMode: ViewMode;
  navigationMode: NavigationMode;
}

export default function Scene({
  activeMode,
  selectedObject,
  setSelectedObject,
  viewMode,
  navigationMode
}: SceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  const getCameraPosition = (): [number, number, number] => {
    switch (viewMode) {
      case 'top':
        return [0, 10, 0] as [number, number, number];
      case 'front':
        return [0, 0, 10] as [number, number, number];
      case 'right':
        return [10, 0, 0] as [number, number, number];
      case 'isometric':
      case 'perspective':
      default:
        return [5, 5, 5] as [number, number, number];
    }
  };

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(...getCameraPosition());
      cameraRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={getCameraPosition()} />
      <OrbitControls
        makeDefault
        enableRotate={navigationMode === 'orbit'}
        enablePan={navigationMode === 'pan'}
        enableZoom={navigationMode === 'zoom'}
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={100}
      />
      {selectedObject && (
        <TransformControls
          object={selectedObject}
          mode={activeMode}
        />
      )}
      <Grid args={[10, 10]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
    </>
  );
} 