import { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, StopIcon, TrashIcon } from '@heroicons/react/24/solid';
import * as THREE from 'three';

interface Keyframe {
  id: string;
  time: number;
  cameraPosition: THREE.Vector3;
  cameraTarget: THREE.Vector3;
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

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm p-4 flex flex-col gap-2">
      {/* Timeline Controls */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex gap-2">
          <button
            onClick={isPlaying ? pauseAnimation : playAnimation}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={stopAnimation}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
            title="Stop"
          >
            <StopIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-white flex-1">
          <span>{currentTime.toFixed(2)}s</span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <span>{duration}s</span>
        </div>

        <button
          onClick={addKeyframe}
          disabled={!camera || !controls}
          className={`px-3 py-1 rounded-lg ${
            camera && controls 
              ? 'bg-blue-600 hover:bg-blue-500' 
              : 'bg-gray-500 cursor-not-allowed'
          } text-white flex items-center gap-1`}
          title={camera && controls ? "Add/Update Keyframe" : "Camera not ready"}
        >
          <span className="text-sm">Add Keyframe</span>
          {keyframes.find(kf => Math.abs(kf.time - currentTime) < 0.01) && 
            <span className="text-xs">(Update)</span>
          }
        </button>

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 px-2 py-1 rounded bg-gray-700 text-white"
          min="1"
          title="Animation Duration (seconds)"
        />
      </div>

      {/* Timeline with Ruler */}
      <div className="relative h-16 bg-gray-700 rounded">
        {/* Ruler */}
        <div className="absolute top-0 left-0 right-0 h-8">
          {generateTimeMarks()}
        </div>

        {/* Keyframe Markers */}
        <div className="absolute bottom-0 left-0 right-0 h-8">
          {keyframes.map((kf) => (
            <div
              key={kf.id}
              className={`absolute bottom-0 flex flex-col items-center cursor-pointer group ${
                selectedKeyframe === kf.id ? 'z-10' : ''
              }`}
              style={{ left: `${(kf.time / duration) * 100}%` }}
              onClick={() => selectKeyframe(kf.id)}
            >
              {/* Keyframe Marker */}
              <div className={`w-4 h-4 rounded-full ${
                selectedKeyframe === kf.id ? 'bg-blue-500' : 'bg-blue-400'
              } hover:bg-blue-300 transform -translate-x-1/2`} />
              
              {/* Delete Button - Visible on Hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteKeyframe(kf.id);
                }}
                className="absolute -top-6 opacity-0 group-hover:opacity-100 p-1 rounded bg-red-500 hover:bg-red-400"
                title="Delete Keyframe"
              >
                <TrashIcon className="w-4 h-4 text-white" />
              </button>

              {/* Time Label */}
              <div className="absolute -bottom-6 transform -translate-x-1/2 text-xs text-gray-300">
                {kf.time.toFixed(1)}s
              </div>
            </div>
          ))}
        </div>

        {/* Current Time Indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
} 