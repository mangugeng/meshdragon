'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import AssetPanel from './AssetPanel';

export default function Editor3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);

  const [activeMode, setActiveMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);

  // Fungsi untuk menangani model yang diupload
  const handleModelLoad = (model: THREE.Object3D) => {
    if (sceneRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      
      // Add the model to the scene
      sceneRef.current.add(model);
      
      // Update camera to frame the model
      if (cameraRef.current) {
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = cameraRef.current.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
        cameraRef.current.position.set(cameraZ, cameraZ, cameraZ);
        cameraRef.current.lookAt(0, 0, 0);
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;

    // Setup grid and lights
    const grid = new THREE.GridHelper(10, 10);
    scene.add(grid);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Setup controls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControlsRef.current = orbitControls;

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControlsRef.current = transformControls;
    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
    });
    scene.add(transformControls);

    // Configure renderer
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x1a1a1a);
    containerRef.current.appendChild(renderer.domElement);

    // Position camera
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Setup raycaster for object selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object !== grid) {
          setSelectedObject(object);
          transformControls.attach(object);
        }
      } else {
        setSelectedObject(null);
        transformControls.detach();
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update transform controls mode when activeMode changes
  useEffect(() => {
    if (transformControlsRef.current) {
      transformControlsRef.current.setMode(activeMode);
    }
  }, [activeMode]);

  return (
    <div className="w-full h-screen flex">
      {/* Tools Panel */}
      <div className="w-64 bg-gray-800 p-4 text-white">
        <h2 className="text-xl font-bold mb-4">Tools</h2>
        <div className="space-y-2">
          <button
            className={`w-full p-2 rounded ${
              activeMode === 'translate' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            onClick={() => setActiveMode('translate')}
          >
            Translate
          </button>
          <button
            className={`w-full p-2 rounded ${
              activeMode === 'rotate' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            onClick={() => setActiveMode('rotate')}
          >
            Rotate
          </button>
          <button
            className={`w-full p-2 rounded ${
              activeMode === 'scale' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            onClick={() => setActiveMode('scale')}
          >
            Scale
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div ref={containerRef} className="flex-1 bg-gray-900" />

      {/* Asset Panel */}
      <AssetPanel onModelLoad={handleModelLoad} />
    </div>
  );
} 