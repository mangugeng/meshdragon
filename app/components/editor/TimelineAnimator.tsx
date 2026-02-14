import { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, StopIcon, TrashIcon } from '@heroicons/react/24/solid';
import * as THREE from 'three';

interface Keyframe {
  id: string;
  time: number;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
}

interface Slide {
  id: string;
  title: string;
  duration: number;
  keyframes: Keyframe[];
  notes?: string;
  annotations?: Annotation[];
}

interface Annotation {
  id: string;
  position: THREE.Vector3;
  text: string;
  type: 'text' | 'highlight' | 'callout';
}

interface TimelineAnimatorProps {
  camera: THREE.PerspectiveCamera | null;
  controls: THREE.OrbitControls | null;
}

export default function TimelineAnimator({ camera, controls }: TimelineAnimatorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5); // 5 detik default
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [fps] = useState(30);
  const [selectedKeyframe, setSelectedKeyframe] = useState<string | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  // Fungsi untuk membuat ruler marks
  const generateTimeMarks = () => {
    const marks = [];
    const majorInterval = 5; // Major mark setiap 5 detik
    const minorInterval = 1; // Minor mark setiap 1 detik

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

  const addKeyframe = () => {
    if (!camera || !controls) {
      console.warn('Camera or controls not initialized');
      return;
    }

    try {
      // Buat keyframe baru
      const newKeyframe: Keyframe = {
        id: Math.random().toString(36).substr(2, 9),
        time: currentTime,
        cameraPosition: camera.position.clone(),
        cameraTarget: controls.target.clone()
      };

      // Cek apakah sudah ada keyframe di waktu yang sama
      const existingKeyframe = keyframes.find(kf => Math.abs(kf.time - currentTime) < 0.01);

      if (existingKeyframe) {
        // Update keyframe yang sudah ada
        const updatedKeyframes = keyframes.map(kf =>
          Math.abs(kf.time - currentTime) < 0.01
            ? {
              ...kf,
              cameraPosition: camera.position.clone(),
              cameraTarget: controls.target.clone()
            }
            : kf
        );
        setKeyframes(updatedKeyframes);
        setSelectedKeyframe(existingKeyframe.id);
        console.log('Updated keyframe:', existingKeyframe.id);
      } else {
        // Tambahkan keyframe baru dan urutkan berdasarkan waktu
        const newKeyframes = [...keyframes, newKeyframe].sort((a, b) => a.time - b.time);
        setKeyframes(newKeyframes);
        setSelectedKeyframe(newKeyframe.id);
        console.log('Added new keyframe:', newKeyframe.id);
      }
    } catch (error) {
      console.error('Error adding keyframe:', error);
    }
  };

  const deleteKeyframe = (id: string) => {
    setKeyframes(keyframes.filter(kf => kf.id !== id));
    setSelectedKeyframe(null);
  };

  const selectKeyframe = (id: string) => {
    setSelectedKeyframe(id);
    const keyframe = keyframes.find(kf => kf.id === id);
    if (keyframe && camera && controls) {
      camera.position.copy(keyframe.cameraPosition);
      controls.target.copy(keyframe.cameraTarget);
      controls.update();
      setCurrentTime(keyframe.time);
    }
  };

  const playAnimation = () => {
    if (keyframes.length < 2) return;
    setIsPlaying(true);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const stopAnimation = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (keyframes.length > 0 && camera && controls) {
      const firstKeyframe = keyframes[0];
      camera.position.copy(firstKeyframe.cameraPosition);
      controls.target.copy(firstKeyframe.cameraTarget);
      controls.update();
    }
  };

  // Fungsi untuk memperbarui posisi kamera berdasarkan waktu saat ini
  const updateCameraPosition = (time: number) => {
    if (!camera || !controls || keyframes.length < 2) return;

    // Jika waktu melebihi keyframe terakhir, tetap di posisi terakhir
    if (time >= keyframes[keyframes.length - 1].time) {
      const lastKeyframe = keyframes[keyframes.length - 1];
      camera.position.copy(lastKeyframe.cameraPosition);
      controls.target.copy(lastKeyframe.cameraTarget);
      controls.update();
      return;
    }

    // Temukan dua keyframe yang mengapit waktu saat ini
    let startFrame = keyframes[0];
    let endFrame = keyframes[1];

    // Cari keyframe yang tepat
    for (let i = 1; i < keyframes.length; i++) {
      if (keyframes[i].time > time) {
        startFrame = keyframes[i - 1];
        endFrame = keyframes[i];
        break;
      }
    }

    // Hitung alpha (nilai interpolasi) antara dua keyframe
    const alpha = (time - startFrame.time) / (endFrame.time - startFrame.time);

    // Interpolasi posisi kamera
    camera.position.lerpVectors(startFrame.cameraPosition, endFrame.cameraPosition, alpha);

    // Interpolasi target kamera
    const targetVector = new THREE.Vector3();
    targetVector.lerpVectors(startFrame.cameraTarget, endFrame.cameraTarget, alpha);
    controls.target.copy(targetVector);
    controls.update();
  };

  // Fungsi untuk menangani perubahan slider
  const handleTimeChange = (newTime: number) => {
    setCurrentTime(newTime);
    if (!isPlaying && keyframes.length >= 2) {
      updateCameraPosition(newTime);
    }
  };

  useEffect(() => {
    if (!isPlaying || !camera || !controls || keyframes.length < 2) return;

    let animationFrame: number;
    let startTime = Date.now() - currentTime * 1000;

    const animate = () => {
      const now = Date.now();
      const newTime = (now - startTime) / 1000;
      const lastKeyframeTime = keyframes[keyframes.length - 1].time;

      if (newTime >= lastKeyframeTime) {
        // Berhenti di keyframe terakhir
        setCurrentTime(lastKeyframeTime);
        updateCameraPosition(lastKeyframeTime);
        setIsPlaying(false);
        return;
      }

      setCurrentTime(newTime);
      updateCameraPosition(newTime);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, camera, controls, keyframes, currentTime]);

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      duration: 5,
      keyframes: [],
      notes: '',
      annotations: []
    };
    setSlides([...slides, newSlide]);
  };

  const updateSlide = (slideId: string, updates: Partial<Slide>) => {
    setSlides(slides.map(slide => 
      slide.id === slideId ? { ...slide, ...updates } : slide
    ));
  };

  const deleteSlide = (slideId: string) => {
    setSlides(slides.filter(slide => slide.id !== slideId));
  };

  const addAnnotation = (slideId: string, annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `annotation-${Date.now()}`
    };
    updateSlide(slideId, {
      annotations: [...(slides.find(s => s.id === slideId)?.annotations || []), newAnnotation]
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
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
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500"
          >
            {isPresentationMode ? 'Exit Presentation' : 'Start Presentation'}
          </button>
        </div>
      </div>

      {isPresentationMode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{slides[currentSlide]?.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
                className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === slides.length - 1}
                className="px-3 py-1 rounded bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
          <div className="h-2 bg-gray-700 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Slides</h3>
            <button
              onClick={addSlide}
              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500"
            >
              Add Slide
            </button>
          </div>
          <div className="space-y-2">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`p-3 rounded ${
                  currentSlide === index ? 'bg-blue-900' : 'bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                    className="bg-transparent border-none focus:ring-0"
                  />
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-1 rounded hover:bg-gray-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={slide.notes || ''}
                  onChange={(e) => updateSlide(slide.id, { notes: e.target.value })}
                  placeholder="Add notes..."
                  className="w-full mt-2 bg-gray-600 rounded p-2 text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 