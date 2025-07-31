"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { usePathname } from 'next/navigation';

interface DynamicParticleBackgroundProps {
  isIntroComplete: boolean;
}

interface ParticleFormation {
  name: string;
  positions: Float32Array;
  colors: Float32Array;
  speeds: Float32Array;
}

const DynamicParticleBackground: React.FC<DynamicParticleBackgroundProps> = ({ isIntroComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetFormationRef = useRef<ParticleFormation | null>(null);
  const transitioningRef = useRef(false);
  
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const zIndex = 1; // Fixed background level
  
  // Get background gradient based on current page
  const getBackgroundGradient = (page: string) => {
    switch (page) {
      case '/':
        return 'radial-gradient(ellipse at center, rgba(20, 40, 80, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
      case '/projects':
        return 'radial-gradient(ellipse at center, rgba(10, 50, 20, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
      case '/experience':
        return 'radial-gradient(ellipse at center, rgba(60, 30, 10, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
      default:
        return 'radial-gradient(ellipse at center, rgba(40, 10, 50, 0.3) 0%, rgba(0, 0, 0, 0.9) 70%)';
    }
  };

  // Responsive particle count based on device capabilities
  const getParticleCount = () => {
    if (typeof window === 'undefined') return 2000;
    const width = window.innerWidth;
    const isMobile = width <= 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    if (isMobile && isLowEnd) return 500;  // Low-end mobile
    if (isMobile) return 800;              // Mobile
    if (width <= 1024) return 1200;       // Tablet
    return 2000;                           // Desktop
  };
  
  const particleCount = getParticleCount();

  // Show particles only after intro is complete
  useEffect(() => {
    console.log('DynamicParticleBackground - isIntroComplete:', isIntroComplete);
    if (isIntroComplete) {
      console.log('Setting particles visible');
      setIsVisible(true);
    } else {
      // If intro hasn't been played in a while, show particles anyway
      const timer = setTimeout(() => {
        console.log('Fallback: showing particles after timeout');
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isIntroComplete]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Create different formations based on page
  const createFormation = useCallback((page: string): ParticleFormation => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      let r = 0.4, g = 0.6, b = 1.0; // Default blue
      let speed = 0.5;

      switch (page) {
        case '/':
          // Home: Organic scattered formation
          x = (Math.random() - 0.5) * 600;
          y = (Math.random() - 0.5) * 400;
          z = (Math.random() - 0.5) * 200;
          r = 1.0; g = 1.0; b = 1.0; // Bright white (landing page color)
          break;

        case '/projects':
          // Projects: Grid/matrix formation
          const gridSize = Math.ceil(Math.sqrt(particleCount));
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          x = (col - gridSize / 2) * 8 + (Math.random() - 0.5) * 5;
          y = (row - gridSize / 2) * 8 + (Math.random() - 0.5) * 5;
          z = (Math.random() - 0.5) * 100;
          r = 1.0; g = 1.0; b = 1.0; // Same white as landing page
          speed = 0.3;
          break;

        case '/experience':
          // Experience: Timeline/flow pattern
          const progress = i / particleCount;
          x = (progress - 0.5) * 1000 + Math.sin(progress * Math.PI * 4) * 100;
          y = Math.cos(progress * Math.PI * 2) * 200 + (Math.random() - 0.5) * 50;
          z = (Math.random() - 0.5) * 200;
          r = 1.0; g = 1.0; b = 1.0; // Same white as landing page
          speed = 0.7;
          break;

        default:
          // About or other: Circular orbit
          const angle = (i / particleCount) * Math.PI * 2 * 3;
          const radius = 200 + Math.random() * 300;
          x = Math.cos(angle) * radius + (Math.random() - 0.5) * 50;
          y = Math.sin(angle) * radius + (Math.random() - 0.5) * 50;
          z = (Math.random() - 0.5) * 200;
          r = 1.0; g = 1.0; b = 1.0; // Same white as landing page
          speed = 0.4;
          break;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;

      speeds[i * 3] = (Math.random() - 0.5) * speed;
      speeds[i * 3 + 1] = (Math.random() - 0.5) * speed;
      speeds[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.5;
    }

    return {
      name: page,
      positions,
      colors,
      speeds
    };
  }, []);

  // Transition to new formation
  const transitionToFormation = useCallback((newFormation: ParticleFormation) => {
    if (!particlesRef.current || transitioningRef.current) return;

    transitioningRef.current = true;
    targetFormationRef.current = newFormation;

    console.log(`Transitioning particles to: ${newFormation.name}`);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    console.log('Three.js initialization - isVisible:', isVisible, 'mountRef:', !!mountRef.current);
    if (!isVisible || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 300;
    
    console.log('Camera and scene created at z=300');
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;

    // Create initial formation
    const initialFormation = createFormation(pathname);
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(initialFormation.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(initialFormation.colors, 3));

    // Responsive particle size
    const getParticleSize = () => {
      if (typeof window === 'undefined') return 3.5;
      const width = window.innerWidth;
      if (width <= 480) return 2.5;   // Small phones
      if (width <= 768) return 3.0;   // Mobile
      return 3.5;                      // Desktop
    };
    
    const material = new THREE.PointsMaterial({
      size: getParticleSize(),
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: false,
    });
    
    console.log('Material created, particle count:', particleCount);

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;
    
    console.log('Particles added to scene, starting animation');

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      if (!particlesRef.current) return;

      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;

      // Handle formation transition
      if (transitioningRef.current && targetFormationRef.current) {
        const target = targetFormationRef.current;
        let transitionComplete = true;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Lerp positions
          const lerpSpeed = 0.05;
          positions[i3] += (target.positions[i3] - positions[i3]) * lerpSpeed;
          positions[i3 + 1] += (target.positions[i3 + 1] - positions[i3 + 1]) * lerpSpeed;
          positions[i3 + 2] += (target.positions[i3 + 2] - positions[i3 + 2]) * lerpSpeed;

          // Lerp colors
          colors[i3] += (target.colors[i3] - colors[i3]) * lerpSpeed;
          colors[i3 + 1] += (target.colors[i3 + 1] - colors[i3 + 1]) * lerpSpeed;
          colors[i3 + 2] += (target.colors[i3 + 2] - colors[i3 + 2]) * lerpSpeed;

          // Check if transition is complete
          if (Math.abs(target.positions[i3] - positions[i3]) > 5) {
            transitionComplete = false;
          }
        }

        if (transitionComplete) {
          transitioningRef.current = false;
          targetFormationRef.current = null;
        }
      } else {
        // Circular orbital motion
        const time = Date.now() * 0.001;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Each particle has its own orbital parameters
          const orbitRadius = 50 + (i % 150);
          const orbitSpeed = 0.3 + (i % 8) * 0.1;
          const orbitAngle = time * orbitSpeed + i * 0.05;
          
          // Create orbital centers based on screen regions (like in your image)
          const centerX = ((i % 7) - 3) * 200; // 7 orbital centers horizontally
          const centerY = (Math.floor(i / 300) - 2) * 150; // Multiple vertical levels
          
          // Calculate orbital position
          const orbitX = centerX + Math.cos(orbitAngle) * orbitRadius * 0.5;
          const orbitY = centerY + Math.sin(orbitAngle) * orbitRadius * 0.5;
          
          // Smooth circular motion
          positions[i3] += (orbitX - positions[i3]) * 0.015;
          positions[i3 + 1] += (orbitY - positions[i3 + 1]) * 0.015;
          
          // Gentle Z oscillation for depth
          positions[i3 + 2] += Math.sin(time * 0.5 + i * 0.01) * 0.3;
          
          // Subtle mouse influence
          positions[i3] += mouseRef.current.x * 0.3;
          positions[i3 + 1] += mouseRef.current.y * 0.3;
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.geometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isVisible, pathname, createFormation]);

  // Handle page changes
  useEffect(() => {
    if (isVisible && particlesRef.current) {
      const newFormation = createFormation(pathname);
      transitionToFormation(newFormation);
    }
  }, [pathname, isVisible, createFormation, transitionToFormation]);

  if (!isVisible) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: zIndex,
      pointerEvents: 'none',
      background: getBackgroundGradient(pathname),
      transition: 'background 1s ease-in-out'
    }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default DynamicParticleBackground;