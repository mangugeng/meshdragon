'use client';

import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelLoaderProps {
  url: string;
  onLoad: (scene: THREE.Object3D) => void;
}

export default function ModelLoader({ url, onLoad }: ModelLoaderProps) {
  const gltf = useGLTF(url);

  useEffect(() => {
    if (gltf) {
      onLoad(gltf.scene);
    }
  }, [gltf, onLoad]);

  return null;
} 