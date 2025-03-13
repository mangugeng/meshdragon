import * as THREE from 'three';
import { ExportConfig } from '../types/editor';

export function generateHTML(scene: THREE.Scene, config: ExportConfig): string {
  const sceneJson = scene.toJSON();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <meta name="description" content="${config.description}">
    <style>
        body {
            margin: 0;
            overflow: hidden;
            background-color: ${config.backgroundColor};
        }
        #canvas {
            width: ${config.responsive ? '100vw' : '800px'};
            height: ${config.responsive ? '100vh' : '600px'};
        }
    </style>
</head>
<body>
    <canvas id="canvas"></canvas>

    <!-- Three.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    ${config.includeOrbitControls ? 
      '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>' : 
      ''}
    ${config.includeStats ? 
      '<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/stats.min.js"></script>' : 
      ''}

    <script>
        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
        
        ${config.responsive ? `
        // Responsive setup
        function updateSize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        ` : `
        renderer.setSize(800, 600);
        `}

        ${config.includeOrbitControls ? `
        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        ` : ''}

        ${config.includeLighting ? `
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        ` : ''}

        ${config.includeStats ? `
        // Stats
        const stats = new Stats();
        document.body.appendChild(stats.dom);
        ` : ''}

        // Load scene
        const sceneData = ${JSON.stringify(sceneJson)};
        const loader = new THREE.ObjectLoader();
        loader.parse(sceneData, (loadedScene) => {
            loadedScene.traverse((child) => {
                scene.add(child.clone());
            });
        });

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            ${config.includeOrbitControls ? 'controls.update();' : ''}
            ${config.includeStats ? 'stats.begin();' : ''}
            renderer.render(scene, camera);
            ${config.includeStats ? 'stats.end();' : ''}
        }

        animate();
    </script>
</body>
</html>
  `.trim();
} 