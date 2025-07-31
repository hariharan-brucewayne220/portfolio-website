"use client"

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleBackgroundProps {
  onAnimationComplete: () => void;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ onAnimationComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const windAudioRef = useRef<HTMLAudioElement | null>(null);
  const swooshAudioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => setShowPrompt(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (windAudioRef.current) {
      windAudioRef.current.volume = 0.1;
      windAudioRef.current.play().catch(() => {
        // Audio autoplay blocked - this is expected behavior in browsers
      });
    }
  }, [showPrompt]);

  const handleClick = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setShowPrompt(false);
    windAudioRef.current?.pause();
    swooshAudioRef.current?.play().catch(() => {
      // Audio play failed - this can happen due to browser restrictions
    });
  }, [isExiting]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Responsive particle count for intro animation
    const getIntroParticleCount = () => {
      const width = window.innerWidth;
      const isMobile = width <= 768;
      const isLowEnd = navigator.hardwareConcurrency <= 4;
      
      if (isMobile && isLowEnd) return 1500;  // Low-end mobile
      if (isMobile) return 2500;              // Mobile
      if (width <= 1024) return 3500;         // Tablet
      return 5000;                            // Desktop
    };
    
    const particleCount = getIntroParticleCount();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * 800;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 800;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * 800;
      velocities[i * 3 + 2] = Math.random() * 0.5 + 0.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 1,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationFrameId: number;
    const animate = () => {
      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        if (isExiting) {
          velocities[i * 3 + 2] *= 1.05; // Hyperspace effect
        }
        pos[i * 3 + 2] += velocities[i * 3 + 2];
        if (pos[i * 3 + 2] > 1000) pos[i * 3 + 2] = -1000;
      }
      geometry.attributes.position.needsUpdate = true;

      if (isExiting) {
        material.opacity -= 0.01;
        if (material.opacity <= 0) {
          onAnimationComplete();
          return;
        }
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isExiting, onAnimationComplete, handleClick]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, background: '#000' }}>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
      <audio ref={windAudioRef} src="/sounds/wind.mp3" preload="auto" loop />
      <audio ref={swooshAudioRef} src="/sounds/swoosh.wav" preload="auto" />
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 1.5 } }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', color: 'white',
              textAlign: 'center', pointerEvents: 'none',
            }}
          >
            <motion.h1 style={{ 
              fontSize: 'clamp(2.5rem, 8vw, 4rem)', // Responsive font sizing
              fontWeight: 'bold', 
              marginBottom: '1rem',
              background: 'linear-gradient(45deg, #ffffff, #0070f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))'
            }}>
              Welcome
            </motion.h1>
            <motion.p
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ 
                fontSize: 'clamp(1rem, 3vw, 1.2rem)', // Responsive font sizing
                color: 'rgba(255, 255, 255, 0.8)'
              }}
            >
              {typeof window !== 'undefined' && window.innerWidth <= 768 ? 'Tap anywhere to enter' : 'Click anywhere to enter'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticleBackground;