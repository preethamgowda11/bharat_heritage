// src/components/common/ThreeSixtyViewer.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type ThreeSixtyViewerProps = {
  image: string;
  height?: string | number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

const ThreeSixtyViewer = ({
  image,
  height = '100%',
  autoRotate = false,
  autoRotateSpeed = 0.5,
}: ThreeSixtyViewerProps) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 0.1;

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = -0.25; 
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;

    // Sphere
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    // Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      image,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
      },
      undefined,
      (err) => {
        console.error('Failed to load 360 image', image, err);
         if (currentMount) {
          const errBox = document.createElement('div');
          errBox.style.position = 'absolute';
          errBox.style.top = '1rem';
          errBox.style.left = '1rem';
          errBox.style.padding = '1rem';
          errBox.style.background = 'rgba(255, 200, 200, 0.9)';
          errBox.style.border = '1px solid red';
          errBox.style.color = 'black';
          errBox.innerText = `Error: Could not load the 360° image at ${image}. Please check the file path and network.`;
          currentMount.appendChild(errBox);
        }
      }
    );

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
        if (currentMount) {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      renderer.dispose();
    };
  }, [image, autoRotate, autoRotateSpeed]);

  return <div ref={mountRef} style={{ width: '100%', height, position: 'relative' }} />;
};

export default ThreeSixtyViewer;
