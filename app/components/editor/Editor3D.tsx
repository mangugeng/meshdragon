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
  EyeIcon,
  PhotoIcon,
  FolderIcon,
  TrashIcon,
  PauseIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/solid';
import AssetPanel from './AssetPanel';
import TimelineAnimator from './TimelineAnimator';
import PropertiesPanel from './PropertiesPanel';
import ExportPanel from './ExportPanel';

type ViewMode = 'perspective' | 'top' | 'front' | 'right' | 'isometric';
type NavigationMode = 'orbit' | 'pan' | 'zoom';

interface Annotation {
  id: string;
  position: THREE.Vector3;
  text: string;
  type: 'text' | 'highlight' | 'callout';
}

interface Keyframe {
  id: string;
  time: number;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
}

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
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assets' | 'slides'>('assets');
  const [slides, setSlides] = useState<{ id: string; title: string; duration: number; keyframes: any[]; notes: string; annotations: Annotation[] }[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [duration, setDuration] = useState(5);

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

  const addAnnotation = (position: THREE.Vector3, type: Annotation['type'], text: string = '') => {
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      position,
      type,
      text
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    setAnnotations(annotations.map(ann => 
      ann.id === id ? { ...ann, ...updates } : ann
    ));
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  const handleSceneClick = (event: MouseEvent) => {
    if (!isAnnotationMode || !sceneRef.current || !cameraRef.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      addAnnotation(point, 'text');
    }
  };

  // Fungsi untuk generate time marks
  const generateTimeMarks = () => {
    const marks = [];
    const majorInterval = 1; // Major mark setiap 1 detik
    const minorInterval = 0.1; // Minor mark setiap 0.1 detik

    for (let i = 0; i <= duration; i += minorInterval) {
      const isMajor = i % majorInterval === 0;
      const position = (i / duration) * 100;

      marks.push(
        <div key={i} className="absolute" style={{ left: `${position}%` }}>
          <div className={`${isMajor ? 'h-4 w-0.5 -top-4' : 'h-2 w-px -top-2'} absolute bg-gray-400`} />
          {isMajor && (
            <div className="absolute -top-8 transform -translate-x-1/2 text-xs text-gray-400">
              {i}s
            </div>
          )}
        </div>
      );
    }
    return marks;
  };

  // Fungsi untuk memilih keyframe
  const selectKeyframe = (id: string) => {
    setSelectedKeyframe(id);
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

  useEffect(() => {
    if (isAnnotationMode) {
      window.addEventListener('click', handleSceneClick);
    }
    return () => {
      window.removeEventListener('click', handleSceneClick);
    };
  }, [isAnnotationMode]);

  return (
    <div className="w-full h-screen flex">
      {/* Left Sidebar - Asset & Slides */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 p-3 flex items-center justify-center space-x-2 ${
              activeTab === 'assets' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FolderIcon className="w-5 h-5" />
            <span>Assets</span>
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`flex-1 p-3 flex items-center justify-center space-x-2 ${
              activeTab === 'slides' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <PhotoIcon className="w-5 h-5" />
            <span>Slides</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'assets' ? (
            <AssetPanel onModelLoad={handleModelLoad} />
          ) : (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-300">Presentation Slides</h3>
                <button
                  onClick={() => {
                    const newSlide = {
                      id: `slide-${Date.now()}`,
                      title: `Slide ${slides.length + 1}`,
                      duration: 5,
                      keyframes: [],
                      notes: '',
                      annotations: []
                    };
                    setSlides([...slides, newSlide]);
                    setCurrentSlide(slides.length); // Set current slide to the new one
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center space-x-1"
                >
                  <PhotoIcon className="w-4 h-4" />
                  <span>Add Slide</span>
                </button>
              </div>

              <div className="space-y-3">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`rounded-lg cursor-pointer transition-all ${
                      currentSlide === index ? 'bg-blue-900/50' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    {/* Slide Header */}
                    <div className="p-3 border-b border-gray-600">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs text-gray-300">
                            {index + 1}
                          </div>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const newSlides = [...slides];
                              newSlides[index] = { ...slide, title: e.target.value };
                              setSlides(newSlides);
                            }}
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-white"
                            placeholder="Slide Title"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSlides = [...slides];
                              if (index > 0) {
                                [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
                                setSlides(newSlides);
                                setCurrentSlide(index - 1);
                              }
                            }}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-gray-500 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSlides = [...slides];
                              if (index < slides.length - 1) {
                                [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
                                setSlides(newSlides);
                                setCurrentSlide(index + 1);
                              }
                            }}
                            disabled={index === slides.length - 1}
                            className="p-1 rounded hover:bg-gray-500 disabled:opacity-50"
                          >
                            ↓
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newSlides = [...slides];
                              newSlides.splice(index, 1);
                              setSlides(newSlides);
                              if (currentSlide >= newSlides.length) {
                                setCurrentSlide(Math.max(0, newSlides.length - 1));
                              }
                            }}
                            className="p-1 rounded hover:bg-gray-500"
                          >
                            <TrashIcon className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Slide Content */}
                    <div className="p-3">
                      {/* Preview Thumbnail */}
                      <div className="w-full h-32 bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                        <div className="text-center">
                          <PhotoIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <span className="text-xs text-gray-500">Preview</span>
                        </div>
                      </div>

                      {/* Slide Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Duration: {slide.duration}s</span>
                          <span>{slide.keyframes.length} keyframes</span>
                        </div>
                        <textarea
                          value={slide.notes || ''}
                          onChange={(e) => {
                            const newSlides = [...slides];
                            newSlides[index] = { ...slide, notes: e.target.value };
                            setSlides(newSlides);
                          }}
                          placeholder="Add notes..."
                          className="w-full text-xs bg-gray-600 text-white rounded p-2 resize-none"
                          rows={2}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Transform Tools & View Controls */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                activeMode === 'translate' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveMode('translate')}
              title="Move"
            >
              <ArrowsUpDownIcon className="w-5 h-5 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                activeMode === 'rotate' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveMode('rotate')}
              title="Rotate"
            >
              <ArrowPathIcon className="w-5 h-5 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                activeMode === 'scale' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => setActiveMode('scale')}
              title="Scale"
            >
              <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'perspective' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeView('perspective')}
              title="Perspective"
            >
              <CubeIcon className="w-5 h-5 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'isometric' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeView('isometric')}
              title="Isometric"
            >
              <ViewfinderCircleIcon className="w-5 h-5 text-white" />
            </button>
            <div className="h-6 w-px bg-gray-600 mx-2" />
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

          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded-lg transition-colors ${
                navigationMode === 'orbit' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeNavigationMode('orbit')}
              title="Orbit"
            >
              <ArrowPathIcon className="w-5 h-5 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                navigationMode === 'pan' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeNavigationMode('pan')}
              title="Pan"
            >
              <ArrowsRightLeftIcon className="w-5 h-5 text-white" />
            </button>
            <button
              className={`p-2 rounded-lg transition-colors ${
                navigationMode === 'zoom' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              onClick={() => changeNavigationMode('zoom')}
              title="Zoom"
            >
              <EyeIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 3D Viewport */}
        <div ref={containerRef} className="flex-1 bg-gray-900 relative">
          {/* Annotation Controls */}
          <div className="absolute top-4 right-4 bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => setIsAnnotationMode(!isAnnotationMode)}
                className={`px-3 py-1 rounded ${
                  isAnnotationMode ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                {isAnnotationMode ? 'Exit Annotation Mode' : 'Annotation Mode'}
              </button>
            </div>
            
            {isAnnotationMode && (
              <div className="space-y-2">
                <button
                  onClick={() => addAnnotation(new THREE.Vector3(), 'text')}
                  className="w-full px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Add Text
                </button>
                <button
                  onClick={() => addAnnotation(new THREE.Vector3(), 'highlight')}
                  className="w-full px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Add Highlight
                </button>
                <button
                  onClick={() => addAnnotation(new THREE.Vector3(), 'callout')}
                  className="w-full px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Add Callout
                </button>
              </div>
            )}
          </div>

          {/* Annotation Display */}
          {annotations.map(annotation => (
            <div
              key={annotation.id}
              className={`absolute ${
                annotation.type === 'text' ? 'bg-white text-black' :
                annotation.type === 'highlight' ? 'bg-yellow-200' :
                'bg-blue-200'
              } p-2 rounded shadow-lg`}
              style={{
                left: `${annotation.position.x}px`,
                top: `${annotation.position.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <input
                type="text"
                value={annotation.text}
                onChange={(e) => updateAnnotation(annotation.id, { text: e.target.value })}
                className="w-full bg-transparent border-none focus:ring-0"
                placeholder="Enter text..."
              />
              <button
                onClick={() => deleteAnnotation(annotation.id)}
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Bar - Timeline */}
        <div className="h-48 bg-gray-800 border-t border-gray-700">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <h3 className="text-sm font-medium text-gray-300">Timeline</h3>
                <button
                  onClick={() => {
                    if (cameraRef.current && orbitControlsRef.current) {
                      const newKeyframe: Keyframe = {
                        id: Math.random().toString(36).substr(2, 9),
                        time: currentTime,
                        cameraPosition: cameraRef.current.position.clone(),
                        cameraTarget: orbitControlsRef.current.target.clone()
                      };
                      setKeyframes([...keyframes, newKeyframe].sort((a, b) => a.time - b.time));
                      setSelectedKeyframe(newKeyframe.id);
                    }
                  }}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center space-x-1"
                >
                  <span>Add Keyframe</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsPlaying(false)}
                  className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  <StopIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="relative h-full bg-gray-700 rounded">
                {/* Timeline content */}
                <div className="absolute inset-0">
                  {/* Ruler marks */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800">
                    {generateTimeMarks()}
                  </div>

                  {/* Timeline track */}
                  <div 
                    className="absolute top-8 left-0 right-0 h-2 bg-gray-600 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percentage = x / rect.width;
                      setCurrentTime(Math.max(0, Math.min(duration, percentage * duration)));
                    }}
                  />

                  {/* Timeline slider */}
                  <div className="absolute top-8 left-0 right-0 h-4 flex items-center">
                    <div className="w-full px-4">
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        step="0.1"
                        value={currentTime}
                        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                        className="w-full h-4 bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:hover:bg-gray-100 [&::-webkit-slider-thumb]:active:bg-gray-200 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-none [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:hover:bg-gray-100 [&::-moz-range-thumb]:active:bg-gray-200"
                      />
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {Math.round(currentTime * 30)}
                      </div>
                    </div>
                  </div>

                  {/* Current time indicator */}
                  <div
                    className="absolute top-8 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('type', 'timeIndicator');
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percentage = x / rect.width;
                      setCurrentTime(Math.max(0, Math.min(duration, percentage * duration)));
                    }}
                  >
                    <div className="absolute -top-2 w-4 h-4 bg-white rounded-sm shadow-md transform -translate-x-1/2" />
                  </div>

                  {/* Keyframe markers */}
                  <div className="absolute bottom-8 left-0 right-0 h-2">
                    {keyframes.map((kf) => (
                      <div
                        key={kf.id}
                        className={`absolute bottom-0 flex flex-col items-center cursor-pointer group ${
                          selectedKeyframe === kf.id ? 'z-10' : ''
                        }`}
                        style={{ left: `${(kf.time / duration) * 100}%` }}
                        onClick={() => selectKeyframe(kf.id)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('keyframeId', kf.id);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const percentage = x / rect.width;
                          const newTime = percentage * duration;
                          const newKeyframes = keyframes.map(k => 
                            k.id === kf.id ? { ...k, time: Math.max(0, Math.min(duration, newTime)) } : k
                          ).sort((a, b) => a.time - b.time);
                          setKeyframes(newKeyframes);
                        }}
                      >
                        <div className="relative">
                          <div
                            className={`w-4 h-4 ${
                              selectedKeyframe === kf.id ? 'bg-red-500' : 'bg-red-400'
                            } hover:bg-red-300 transform -translate-x-1/2`}
                          />
                          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-b-[6px] border-b-red-400 border-r-[6px] border-r-transparent" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setKeyframes(keyframes.filter(k => k.id !== kf.id));
                              if (selectedKeyframe === kf.id) {
                                setSelectedKeyframe(null);
                              }
                            }}
                            className="absolute -top-2 -right-2 w-3 h-3 bg-red-600 rounded-full text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                        <div className="absolute -bottom-6 transform -translate-x-1/2 text-xs text-gray-300">
                          <input
                            type="number"
                            value={kf.time.toFixed(1)}
                            onChange={(e) => {
                              const newTime = Math.max(0, Math.min(duration, parseFloat(e.target.value)));
                              const newKeyframes = keyframes.map(k => 
                                k.id === kf.id ? { ...k, time: newTime } : k
                              ).sort((a, b) => a.time - b.time);
                              setKeyframes(newKeyframes);
                            }}
                            className="w-12 bg-gray-600 text-white text-center rounded px-1 py-0.5 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time display */}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-xs text-gray-400">
                    <span>{currentTime.toFixed(1)}s</span>
                    <span>{duration.toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties & Export */}
      <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Properties</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <PropertiesPanel />
        </div>
        <div className="p-4 border-t border-gray-700">
          <ExportPanel onExport={() => {}} />
        </div>
      </div>
    </div>
  );
} 