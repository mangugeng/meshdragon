'use client';

import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { 
  ArrowsPointingOutIcon, 
  ArrowPathIcon, 
  ArrowsUpDownIcon,
  CubeIcon,
  ViewfinderCircleIcon,
  ArrowsRightLeftIcon,
  EyeIcon
} from '@heroicons/react/24/solid';
import AssetPanel from './AssetPanel';
import TimelineAnimator from './TimelineAnimator';

type ViewMode = 'perspective' | 'top' | 'front' | 'right' | 'isometric';
type NavigationMode = 'orbit' | 'pan' | 'zoom';

export default function Editor3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);

  const [activeMode, setActiveMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('perspective');
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('orbit');

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

  // Fungsi untuk mengubah posisi kamera berdasarkan view mode
  const changeView = (mode: ViewMode) => {
    if (!cameraRef.current || !orbitControlsRef.current) return;
    
    const camera = cameraRef.current;
    const controls = orbitControlsRef.current;
    
    switch (mode) {
      case 'top':
        camera.position.set(0, 10, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'front':
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        break;
      case 'right':
        camera.position.set(10, 0, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'isometric':
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        break;
      case 'perspective':
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        break;
    }
    
    controls.update();
    setViewMode(mode);
  };

  // Fungsi untuk mengubah mode navigasi
  const changeNavigationMode = (mode: NavigationMode) => {
    if (!orbitControlsRef.current) return;
    
    const controls = orbitControlsRef.current;
    
    // Reset semua mode
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    
    switch (mode) {
      case 'orbit':
        controls.enableRotate = true;
        break;
      case 'pan':
        controls.enablePan = true;
        break;
      case 'zoom':
        controls.enableZoom = true;
        break;
    }
    
    setNavigationMode(mode);
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
    
    // Konfigurasi default OrbitControls
    orbitControls.enableRotate = true; // Orbit mode default
    orbitControls.enablePan = false;
    orbitControls.enableZoom = false;
    orbitControls.enableDamping = true; // Smooth camera movement
    orbitControls.dampingFactor = 0.05;
    orbitControls.screenSpacePanning = true; // Pan mengikuti arah mouse
    orbitControls.minDistance = 1; // Minimum zoom distance
    orbitControls.maxDistance = 100; // Maximum zoom distance
    orbitControls.zoomSpeed = 0.5; // Kurangi kecepatan zoom
    orbitControls.panSpeed = 0.5; // Kurangi kecepatan pan
    orbitControls.rotateSpeed = 0.5; // Kurangi kecepatan rotate

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
      orbitControls.dispose();
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
    <div className="w-full h-screen flex relative">
      {/* Transform Tools - Top Center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 flex gap-2 z-10">
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === 'translate' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveMode('translate')}
          title="Move"
        >
          <ArrowsUpDownIcon className="w-6 h-6 text-white" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === 'rotate' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveMode('rotate')}
          title="Rotate"
        >
          <ArrowPathIcon className="w-6 h-6 text-white" />
        </button>
        <button
          className={`p-2 rounded-lg transition-colors ${
            activeMode === 'scale' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
          onClick={() => setActiveMode('scale')}
          title="Scale"
        >
          <ArrowsPointingOutIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* 3D Viewport dengan Navigation Tools */}
      <div ref={containerRef} className="flex-1 bg-gray-900 relative">
        {/* Combined Navigation Tools - Kanan Atas */}
        <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 flex flex-col gap-2">
          {/* Camera Views */}
          <div className="flex flex-col gap-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'perspective' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeView('perspective')}
              title="Perspective"
            >
              <CubeIcon className="w-6 h-6 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'isometric' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeView('isometric')}
              title="Isometric"
            >
              <ViewfinderCircleIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Horizontal Separator */}
          <div className="h-px w-full bg-gray-600" />

          {/* Standard Views */}
          <div className="flex flex-col gap-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'top' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeView('top')}
              title="Top View"
            >
              T
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'front' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeView('front')}
              title="Front View"
            >
              F
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'right' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeView('right')}
              title="Right View"
            >
              R
            </button>
          </div>

          {/* Horizontal Separator */}
          <div className="h-px w-full bg-gray-600" />

          {/* Navigation Controls */}
          <div className="flex flex-col gap-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                navigationMode === 'orbit' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeNavigationMode('orbit')}
              title="Orbit"
            >
              <ArrowPathIcon className="w-6 h-6 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                navigationMode === 'pan' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeNavigationMode('pan')}
              title="Pan"
            >
              <ArrowsRightLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                navigationMode === 'zoom' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeNavigationMode('zoom')}
              title="Zoom"
            >
              <EyeIcon className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Timeline Animator */}
        <TimelineAnimator 
          camera={cameraRef.current}
          controls={orbitControlsRef.current}
        />
      </div>

      {/* Asset Panel */}
      <AssetPanel onModelLoad={handleModelLoad} />
    </div>
  );
} 