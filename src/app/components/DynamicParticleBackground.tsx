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
  const explosionRef = useRef({ active: false, x: 0, y: 0, time: 0, strength: 0 });
  const particleVelocitiesRef = useRef<Float32Array | null>(null);
  const trailSystemRef = useRef<THREE.Points | null>(null);
  const trailHistoryRef = useRef<{ positions: Float32Array; currentIndex: number } | null>(null);
  const galaxySystemRef = useRef<{
    galaxies: Array<{
      centerX: number;
      centerY: number;
      centerZ: number;
      radius: number;
      armCount: number;
      rotation: number;
      rotationSpeed: number;
      type: 'spiral' | 'barred' | 'elliptical';
      blackHoleMass: number;
      colorTheme: string;
      eventHorizonRadius: number;
      photonSphereRadius: number;
      accretionDiskRadius: number;
      depthLayer: number; // 0 = far background, 1 = mid, 2 = foreground
      parallaxSpeed: number; // Multiplier for parallax effect
    }>;
    particleGalaxyMap: Int32Array;
    particleOrbitalData: Array<{
      galaxyIndex: number;
      orbitalRadius: number;
      orbitalAngle: number;
      orbitalSpeed: number;
      armIndex: number;
      isInPhotonSphere: boolean;
      lensingStrength: number;
      depthLayer: number;
    }>;
    constellations: Array<{
      stars: Array<{ x: number; y: number; brightness: number }>;
      connections: Array<{ from: number; to: number }>;
      name: string;
      centerX: number;
      centerY: number;
      active: boolean;
    }>;
  } | null>(null);
  
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
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
    if (typeof window === 'undefined') return 1000;
    const width = window.innerWidth;
    const isMobile = width <= 768;
    const isLowEnd = navigator.hardwareConcurrency <= 4;

    if (isMobile && isLowEnd) return 300;  // Low-end mobile
    if (isMobile) return 500;              // Mobile
    if (width <= 1024) return 800;         // Tablet
    return 1200;                           // Desktop
  };
  
  const particleCount = getParticleCount();

  // Show particles only after intro is complete
  useEffect(() => {
    if (isIntroComplete) {
      setIsVisible(true);
    } else {
      // If intro hasn't been played in a while, show particles anyway
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isIntroComplete]);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      // Detect which section is being hovered for constellation effects
      const elements = document.elementsFromPoint(event.clientX, event.clientY);
      const section = elements.find(el => 
        el.tagName === 'SECTION' || 
        el.classList.contains('section') ||
        el.id.includes('section')
      );
      
      if (section && section.id) {
        setHoveredSection(section.id);
      } else {
        setHoveredSection(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Mouse tracking with click explosions
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = (event: MouseEvent) => {
      // Only handle clicks on the canvas element itself, not on overlays
      const target = event.target as HTMLElement;
      if (target && target.tagName === 'CANVAS') {
        // Convert screen coordinates to world coordinates
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        explosionRef.current = {
          active: true,
          x: x * 600, // Scale to particle world space
          y: y * 400,
          time: 0,
          strength: Math.random() * 50 + 100 // Random explosion strength
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // COSMIC Galaxy formation with NEBULA BACKGROUND (optimized)
  const createGalaxySystem = useCallback((page: string) => {
    const galaxyCount = 1; // Reduced from 2-3 to 1 for better performance
    const galaxies = [];
    const particleOrbitalData = [];
    
    // Realistic space colors based on your references
    const colorThemes = [
      'cosmic',       // Main theme matching your references
      'nebula',       // Secondary nebula theme
      'stellar'       // Additional stellar theme
    ];
    
    for (let g = 0; g < galaxyCount; g++) {
      // Position galaxies with proper spacing
      let centerX, centerY;
      if (galaxyCount === 1) {
        centerX = 0;
        centerY = 0;
      } else if (galaxyCount === 2) {
        centerX = g === 0 ? -250 : 250;
        centerY = (g % 2 === 0 ? -60 : 60);
      } else {
        const angle = (g / galaxyCount) * Math.PI * 2;
        centerX = Math.cos(angle) * 300;
        centerY = Math.sin(angle) * 200;
      }
      
      const centerZ = 0; // Keep galaxies on same plane
      const radius = 120 + Math.random() * 30; // Smaller, non-overlapping galaxies
      const armCount = 2; // Always 2 arms for classic spiral
      const rotationSpeed = 0.015 + Math.random() * 0.01; // Slightly slower for majesty
      const blackHoleMass = 1200 + Math.random() * 600; // More massive black holes
      const colorTheme = colorThemes[g % colorThemes.length]; // Cycle through themes
      
      // Black hole physics - realistic scales
      const eventHorizonRadius = Math.sqrt(blackHoleMass / 100); // Schwarzschild radius
      const photonSphereRadius = eventHorizonRadius * 1.5; // Where light orbits
      const accretionDiskRadius = eventHorizonRadius * 8; // Bright accretion disk
      
      // Assign depth layers for parallax effect
      const depthLayer = g % 3; // 0, 1, 2 for different depths
      const parallaxSpeed = depthLayer === 0 ? 0.2 : depthLayer === 1 ? 0.5 : 1.0; // Far, mid, near
      
      galaxies.push({
        centerX,
        centerY,
        centerZ: centerZ + (depthLayer * 100), // Separate Z levels
        radius,
        armCount,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed,
        type: 'spiral' as const,
        blackHoleMass,
        colorTheme,
        eventHorizonRadius,
        photonSphereRadius,
        accretionDiskRadius,
        depthLayer,
        parallaxSpeed
      });
    }
    
    // Create stable orbital data for galaxy particles only (background handled separately)
    const backgroundParticles = Math.floor(particleCount * 0.4);
    const galaxyParticles = particleCount - backgroundParticles;
    const particleGalaxyMap = new Int32Array(galaxyParticles);
    
    for (let i = 0; i < galaxyParticles; i++) {
      const galaxyIndex = i % galaxyCount;
      const galaxy = galaxies[galaxyIndex];
      
      // Create stable orbital parameters with MAXIMUM DENSITY in spiral arms
      const isInArm = Math.random() < 0.92; // 92% in spiral arms for ultra-dense look
      let orbitalRadius;
      
      if (isInArm) {
        // Particles extremely concentrated in spiral arms
        orbitalRadius = 15 + Math.pow(Math.random(), 0.8) * (galaxy.radius - 15);
      } else {
        // Minimal scattered particles between arms
        orbitalRadius = 40 + Math.random() * (galaxy.radius - 40);
      }
      
      const orbitalAngle = Math.random() * Math.PI * 2;
      
      // Realistic orbital speed based on distance (Kepler's laws)
      const orbitalSpeed = Math.sqrt(galaxy.blackHoleMass / orbitalRadius) * 0.0008; // Slightly slower
      
      // Assign to spiral arm
      const armIndex = Math.floor(Math.random() * galaxy.armCount);
      
      // Calculate gravitational lensing effects
      const isInPhotonSphere = orbitalRadius <= galaxy.photonSphereRadius;
      const lensingStrength = Math.max(0, (galaxy.photonSphereRadius * 2 - orbitalRadius) / galaxy.photonSphereRadius);
      
      particleGalaxyMap[i] = galaxyIndex;
      particleOrbitalData.push({
        galaxyIndex,
        orbitalRadius,
        orbitalAngle,
        orbitalSpeed,
        armIndex,
        isInPhotonSphere,
        lensingStrength,
        depthLayer: galaxy.depthLayer
      });
    }
    
    // Create constellation patterns - positioned within camera view
    const constellations = [
      {
        name: 'Orion',
        centerX: -200,
        centerY: -100,
        stars: [
          { x: -250, y: -150, brightness: 1.0 },
          { x: -200, y: -80, brightness: 0.8 },
          { x: -150, y: -120, brightness: 0.9 },
          { x: -220, y: -40, brightness: 0.7 },
          { x: -180, y: -160, brightness: 0.6 },
          { x: -140, y: -70, brightness: 0.8 },
          { x: -170, y: -90, brightness: 0.5 }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 5 },
          { from: 1, to: 3 }, { from: 0, to: 4 }, { from: 4, to: 6 }, { from: 6, to: 5 }
        ],
        active: false
      },
      {
        name: 'Ursa Major',
        centerX: 200,
        centerY: 150,
        stars: [
          { x: 150, y: 100, brightness: 0.9 },
          { x: 180, y: 120, brightness: 0.8 },
          { x: 210, y: 110, brightness: 0.7 },
          { x: 240, y: 130, brightness: 0.8 },
          { x: 230, y: 170, brightness: 0.6 },
          { x: 200, y: 180, brightness: 0.7 },
          { x: 170, y: 160, brightness: 0.5 }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
          { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 0 }
        ],
        active: false
      },
      {
        name: 'Cassiopeia',
        centerX: 0,
        centerY: -200,
        stars: [
          { x: -50, y: -250, brightness: 0.8 },
          { x: -20, y: -220, brightness: 0.9 },
          { x: 10, y: -200, brightness: 1.0 },
          { x: 40, y: -180, brightness: 0.7 },
          { x: 70, y: -210, brightness: 0.6 }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }
        ],
        active: false
      }
    ];

    return { galaxies, particleGalaxyMap, particleOrbitalData, constellations };
  }, [particleCount]);

  // Calculate spiral arm position for a particle - ULTRA TIGHT FOR MAXIMUM DENSITY
  const getSpiralArmPosition = useCallback((
    galaxy: any,
    particleIndex: number,
    armIndex: number,
    distanceFromCenter: number,
    time: number
  ) => {
    const armAngle = (Math.PI * 2 / galaxy.armCount) * armIndex;
    const spiralTightness = 2.5; // Ultra-tight spiral for maximum density
    const spiralAngle = armAngle + (distanceFromCenter / galaxy.radius) * spiralTightness * Math.PI * 2;
    const totalAngle = spiralAngle + galaxy.rotation + time * galaxy.rotationSpeed;
    
    // Minimal scatter for ultra-tight arm definition
    const scatter = (particleIndex * 0.1) % 1;
    const scatterRadius = 1.5 + Math.sin(scatter * Math.PI * 2) * 1; // Extremely tight
    const scatterAngle = scatter * Math.PI * 2;
    
    const baseX = Math.cos(totalAngle) * distanceFromCenter;
    const baseY = Math.sin(totalAngle) * distanceFromCenter;
    
    const scatterX = Math.cos(scatterAngle) * scatterRadius;
    const scatterY = Math.sin(scatterAngle) * scatterRadius;
    
    return {
      x: galaxy.centerX + baseX + scatterX,
      y: galaxy.centerY + baseY + scatterY,
      z: galaxy.centerZ + (Math.sin(scatter * Math.PI * 4) * 10)
    };
  }, []);

  // REALISTIC SPACE COLORS with BLACK HOLE LENSING - Match reference images!
  const getGalaxyColor = useCallback((distanceFromCenter: number, galaxyRadius: number, particleIndex: number, colorTheme: string, armIndex: number, orbitalAngle: number, lensingStrength: number = 0, isInPhotonSphere: boolean = false) => {
    const normalizedDistance = Math.min(distanceFromCenter / galaxyRadius, 1);
    const randomSeed = (particleIndex * 0.1) % 1;
    const shimmer = Math.sin(Date.now() * 0.001 + particleIndex * 0.1) * 0.05 + 0.95; // Subtle shimmer
    
    let r, g, b;
    
    // MATCH YOUR REFERENCE IMAGES
    if (normalizedDistance < 0.1) {
      // BRIGHT WHITE/PINK CORE like galaxy.jpg
      r = 1.0;
      g = 0.9 + randomSeed * 0.1;
      b = 0.8 + randomSeed * 0.2; // Pink tint
    } else if (normalizedDistance < 0.25) {
      // WARM CORE TRANSITION
      const t = (normalizedDistance - 0.1) / 0.15;
      r = 1.0 - t * 0.3;
      g = 0.9 - t * 0.2;
      b = 0.8 + t * 0.1;
    } else if (normalizedDistance < 0.45) {
      // RED/ORANGE DUST LANES like galaxy.jpg
      const t = (normalizedDistance - 0.25) / 0.2;
      const dustLaneEffect = Math.sin(orbitalAngle * 4 + armIndex * Math.PI) * 0.5 + 0.5;
      
      if (dustLaneEffect > 0.6) {
        // Dust lane regions
        r = 0.8 + t * 0.2;
        g = 0.4 + t * 0.3;
        b = 0.2 + t * 0.2;
      } else {
        // Between dust lanes - teal/cyan like galaxy.jpg
        r = 0.3 - t * 0.1;
        g = 0.7 + t * 0.2;
        b = 0.9 + t * 0.1;
      }
    } else if (normalizedDistance < 0.7) {
      // DEEP BLUE OUTER REGIONS like galaxy.jpg
      const t = (normalizedDistance - 0.45) / 0.25;
      r = 0.2 - t * 0.1;
      g = 0.4 + t * 0.2;
      b = 0.9 + t * 0.1;
    } else {
      // OUTER SPACE NEBULA like spacenebula.jpeg
      const nebulaPattern = Math.sin(orbitalAngle * 2 + particleIndex * 0.5) * 0.5 + 0.5;
      
      if (nebulaPattern > 0.5) {
        // Purple/magenta nebula regions
        r = 0.6 + randomSeed * 0.3;
        g = 0.2 + randomSeed * 0.3;
        b = 0.8 + randomSeed * 0.2;
      } else {
        // Blue nebula regions
        r = 0.1 + randomSeed * 0.2;
        g = 0.3 + randomSeed * 0.4;
        b = 0.9 + randomSeed * 0.1;
      }
    }
    
    // Add stellar brightness variation
    const stellarBrightness = Math.sin(particleIndex * 0.3) * 0.2 + 0.8;
    
    // Distance-based brightness (brighter toward center)
    const distanceBrightness = Math.max(0.3, 1.5 - normalizedDistance * 1.2);
    
    // GRAVITATIONAL LENSING EFFECTS - Light bending around black hole!
    let lensingEffect = 1;
    let redshift = 1;
    
    if (lensingStrength > 0) {
      // Light is being lensed - creates blue-shifting and brightening
      lensingEffect = 1 + lensingStrength * 2; // Lensing magnifies brightness
      redshift = 1 + lensingStrength * 0.3; // Blue-shift effect
      
      // Particles in photon sphere get special treatment
      if (isInPhotonSphere) {
        // Photons orbit multiple times - creates bright rings
        const photonRingEffect = Math.sin(orbitalAngle * 6) * 0.5 + 1.5;
        lensingEffect *= photonRingEffect;
        
        // Extreme time dilation effects - color shifting
        r = Math.min(1, r * 1.5); // Enhanced red
        g = Math.min(1, g * 1.3); // Moderate green  
        b = Math.min(1, b * 2.0); // Strong blue from blue-shifting
      }
    }
    
    // Accretion disk glow - super bright orange/white near event horizon
    if (normalizedDistance < 0.05) {
      // Accretion disk temperature effects
      const temperature = (0.05 - normalizedDistance) / 0.05;
      r = Math.min(1, r + temperature * 0.8); // Hot white/orange
      g = Math.min(1, g + temperature * 0.6);
      b = Math.min(1, b + temperature * 0.4);
      lensingEffect *= (1 + temperature * 3); // Extremely bright
    }
    
    // Combine all effects including lensing
    const finalR = Math.max(0, Math.min(1, r * distanceBrightness * stellarBrightness * shimmer * lensingEffect * redshift));
    const finalG = Math.max(0, Math.min(1, g * distanceBrightness * stellarBrightness * shimmer * lensingEffect * redshift));
    const finalB = Math.max(0, Math.min(1, b * distanceBrightness * stellarBrightness * shimmer * lensingEffect * redshift));
    
    return { r: finalR, g: finalG, b: finalB };
  }, []);

  // COSMIC GAS CLOUDS AND NEBULA - Beautiful volumetric effects!
  const createBackgroundNebula = useCallback(() => {
    const backgroundParticles = Math.floor(particleCount * 0.4); // 40% for richer background
    const backgroundPositions = new Float32Array(backgroundParticles * 3);
    const backgroundColors = new Float32Array(backgroundParticles * 3);
    
    // Create beautiful gas cloud formations
    const cloudCenters = [
      { x: -400, y: -200, type: 'purple', size: 300 },
      { x: 300, y: 150, type: 'blue', size: 250 },
      { x: -100, y: 300, type: 'magenta', size: 200 },
      { x: 450, y: -100, type: 'cyan', size: 180 },
      { x: -300, y: 100, type: 'violet', size: 220 }
    ];
    
    for (let i = 0; i < backgroundParticles; i++) {
      const particleType = Math.random();
      let x, y, z, r, g, b, intensity;
      
      if (particleType < 0.6) {
        // Gas cloud particles - form beautiful cloud formations
        const cloudIndex = Math.floor(Math.random() * cloudCenters.length);
        const cloud = cloudCenters[cloudIndex];
        
        // Gaussian distribution around cloud center for realistic cloud shape
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.abs(Math.random() + Math.random() - 1) * cloud.size; // Bell curve distribution
        
        x = cloud.x + Math.cos(angle) * distance;
        y = cloud.y + Math.sin(angle) * distance;
        z = (Math.random() - 0.5) * 150;
        
        // Cloud-specific colors with beautiful gradients
        switch (cloud.type) {
          case 'purple':
            r = 0.6 + Math.random() * 0.3;
            g = 0.2 + Math.random() * 0.3;
            b = 0.8 + Math.random() * 0.2;
            break;
          case 'blue':
            r = 0.1 + Math.random() * 0.3;
            g = 0.4 + Math.random() * 0.4;
            b = 0.9 + Math.random() * 0.1;
            break;
          case 'magenta':
            r = 0.8 + Math.random() * 0.2;
            g = 0.2 + Math.random() * 0.4;
            b = 0.9 + Math.random() * 0.1;
            break;
          case 'cyan':
            r = 0.1 + Math.random() * 0.2;
            g = 0.7 + Math.random() * 0.3;
            b = 0.9 + Math.random() * 0.1;
            break;
          case 'violet':
            r = 0.5 + Math.random() * 0.4;
            g = 0.1 + Math.random() * 0.2;
            b = 0.9 + Math.random() * 0.1;
            break;
          default:
            r = 0.5; g = 0.3; b = 0.8;
        }
        
        // Distance-based intensity for volumetric effect
        const distanceFromCenter = Math.sqrt((x - cloud.x) ** 2 + (y - cloud.y) ** 2);
        intensity = Math.max(0.1, 1 - (distanceFromCenter / cloud.size)) * (0.4 + Math.random() * 0.4);
        
      } else if (particleType < 0.85) {
        // Scattered nebula dust between clouds
        x = (Math.random() - 0.5) * 1200;
        y = (Math.random() - 0.5) * 800;
        z = (Math.random() - 0.5) * 200;
        
        // Subtle nebula colors
        const dustType = Math.random();
        if (dustType < 0.5) {
          r = 0.3 + Math.random() * 0.3;
          g = 0.1 + Math.random() * 0.2;
          b = 0.6 + Math.random() * 0.4;
        } else {
          r = 0.1 + Math.random() * 0.2;
          g = 0.3 + Math.random() * 0.3;
          b = 0.7 + Math.random() * 0.3;
        }
        
        intensity = 0.2 + Math.random() * 0.3;
      } else {
        // Scattered bright stars throughout space
        x = (Math.random() - 0.5) * 1400;
        y = (Math.random() - 0.5) * 900;
        z = (Math.random() - 0.5) * 300;
        
        // Bright stellar colors
        const starType = Math.random();
        if (starType < 0.3) {
          // Blue-white stars
          r = 0.8 + Math.random() * 0.2;
          g = 0.9 + Math.random() * 0.1;
          b = 1.0;
        } else if (starType < 0.6) {
          // White stars
          r = 0.9 + Math.random() * 0.1;
          g = 0.9 + Math.random() * 0.1;
          b = 0.9 + Math.random() * 0.1;
        } else {
          // Orange-red stars
          r = 1.0;
          g = 0.7 + Math.random() * 0.3;
          b = 0.4 + Math.random() * 0.4;
        }
        
        intensity = 0.6 + Math.random() * 0.4;
      }
      
      backgroundPositions[i * 3] = x;
      backgroundPositions[i * 3 + 1] = y;
      backgroundPositions[i * 3 + 2] = z;
      
      backgroundColors[i * 3] = r * intensity;
      backgroundColors[i * 3 + 1] = g * intensity;
      backgroundColors[i * 3 + 2] = b * intensity;
    }
    
    return { backgroundPositions, backgroundColors, backgroundParticles };
  }, [particleCount]);

  // REALISTIC Galaxy formation with COSMIC BACKGROUND
  const createFormation = useCallback((page: string): ParticleFormation => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount * 3);

    // Create galaxy system for this page
    const galaxySystem = createGalaxySystem(page);
    galaxySystemRef.current = galaxySystem;

    // Create background nebula
    const backgroundNebula = createBackgroundNebula();
    const galaxyParticles = particleCount - backgroundNebula.backgroundParticles;

    // First, add background nebula particles
    for (let i = 0; i < backgroundNebula.backgroundParticles; i++) {
      positions[i * 3] = backgroundNebula.backgroundPositions[i * 3];
      positions[i * 3 + 1] = backgroundNebula.backgroundPositions[i * 3 + 1];
      positions[i * 3 + 2] = backgroundNebula.backgroundPositions[i * 3 + 2];
      
      colors[i * 3] = backgroundNebula.backgroundColors[i * 3];
      colors[i * 3 + 1] = backgroundNebula.backgroundColors[i * 3 + 1];
      colors[i * 3 + 2] = backgroundNebula.backgroundColors[i * 3 + 2];
      
      speeds[i * 3] = 0;
      speeds[i * 3 + 1] = 0;
      speeds[i * 3 + 2] = 0;
    }

    // Then add galaxy particles
    for (let i = backgroundNebula.backgroundParticles; i < particleCount; i++) {
      const galaxyIndex = i % galaxySystem.galaxies.length;
      const orbitalDataIndex = i - backgroundNebula.backgroundParticles;
      const orbitalData = galaxySystem.particleOrbitalData[orbitalDataIndex];
      const galaxy = galaxySystem.galaxies[orbitalData.galaxyIndex];
      
      // Calculate position using stable orbital mechanics
      const spiralArmOffset = (orbitalData.armIndex / galaxy.armCount) * Math.PI * 2;
      const spiralAngle = spiralArmOffset + (orbitalData.orbitalRadius / galaxy.radius) * Math.PI * 1.5;
      const totalAngle = orbitalData.orbitalAngle + spiralAngle + galaxy.rotation;
      
      // Position on spiral arm with maximum density packing
      const armTightness = orbitalData.orbitalRadius < galaxy.radius * 0.6 ? 1 : 2; // Extremely tight arms
      const armDeviation = (Math.sin(i * 0.1) * armTightness);
      
      // Ultra-minimal variation for maximum density
      const densityVariation = Math.sin(orbitalData.orbitalRadius * 0.05) * 0.5;
      
      const x = galaxy.centerX + Math.cos(totalAngle) * orbitalData.orbitalRadius + 
                 Math.cos(totalAngle + Math.PI/2) * (armDeviation + densityVariation);
      const y = galaxy.centerY + Math.sin(totalAngle) * orbitalData.orbitalRadius + 
                 Math.sin(totalAngle + Math.PI/2) * (armDeviation + densityVariation);
      const z = galaxy.centerZ + Math.sin(i * 0.05) * 8; // Slightly more Z variation for depth
      
      // Rainbow spectrum colors with gravitational lensing effects
      const color = getGalaxyColor(
        orbitalData.orbitalRadius, 
        galaxy.radius, 
        i, 
        galaxy.colorTheme, 
        orbitalData.armIndex, 
        orbitalData.orbitalAngle,
        orbitalData.lensingStrength,
        orbitalData.isInPhotonSphere
      );
      let r = color.r;
      let g = color.g;
      let b = color.b;
      
      // EXTRA BRIGHT spiral arms for Guardians of Galaxy effect
      const armAlignment = Math.abs(Math.sin(spiralAngle)) * 0.7 + 0.6; // More pronounced
      r *= (1 + armAlignment * 1.2); // Enhanced brightness
      g *= (1 + armAlignment * 1.2);
      b *= (1 + armAlignment * 1.2);
      
      // BLAZING bright black hole center
      if (orbitalData.orbitalRadius < 30) {
        const coreIntensity = (30 - orbitalData.orbitalRadius) / 30;
        r = Math.min(1.0, r * (2 + coreIntensity * 2));
        g = Math.min(1.0, g * (2 + coreIntensity * 2));
        b = Math.min(1.0, b * (2 + coreIntensity * 2));
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;

      // No random speeds - pure orbital motion
      speeds[i * 3] = 0;
      speeds[i * 3 + 1] = 0;
      speeds[i * 3 + 2] = 0;
    }

    return {
      name: page,
      positions,
      colors,
      speeds
    };
  }, [createGalaxySystem, getGalaxyColor, particleCount]);

  // Transition to new formation
  const transitionToFormation = useCallback((newFormation: ParticleFormation) => {
    if (!particlesRef.current || transitioningRef.current) return;

    transitioningRef.current = true;
    targetFormationRef.current = newFormation;

  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!isVisible || !mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 300;
    
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    
    // Add click handler directly to canvas
    renderer.domElement.addEventListener('click', (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      explosionRef.current = {
        active: true,
        x: x * 600,
        y: y * 400,
        time: 0,
        strength: Math.random() * 80 + 120 // Stronger explosions
      };
    });

    sceneRef.current = scene;

    // Create initial formation
    const initialFormation = createFormation(pathname);
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(initialFormation.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(initialFormation.colors, 3));

    // Create constellation lines geometry
    const constellationGeometry = new THREE.BufferGeometry();
    const maxLines = 50; // Maximum constellation lines
    const linePositions = new Float32Array(maxLines * 6); // 2 points per line, 3 coords per point
    const lineColors = new Float32Array(maxLines * 6);
    
    constellationGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    constellationGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    
    const constellationMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      linewidth: 2, // Thicker lines
    });
    
    const constellationLines = new THREE.LineSegments(constellationGeometry, constellationMaterial);
    constellationLines.name = 'constellationLines';
    scene.add(constellationLines);

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
    

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;
    
    // Initialize particle velocities for physics
    particleVelocitiesRef.current = new Float32Array(particleCount * 3);
    
    // Create trail system for orbital effects
    const trailLength = 20; // Number of trail points per particle
    const totalTrailPoints = particleCount * trailLength;
    const trailPositions = new Float32Array(totalTrailPoints * 3);
    const trailColors = new Float32Array(totalTrailPoints * 3);
    
    // Initialize trail positions to particle positions
    for (let i = 0; i < particleCount; i++) {
      for (let t = 0; t < trailLength; t++) {
        const trailIndex = (i * trailLength + t) * 3;
        const particleIndex = i * 3;
        trailPositions[trailIndex] = initialFormation.positions[particleIndex];
        trailPositions[trailIndex + 1] = initialFormation.positions[particleIndex + 1];
        trailPositions[trailIndex + 2] = initialFormation.positions[particleIndex + 2];
        
        // Fade trail from bright to transparent
        const opacity = (t / trailLength) * 0.3;
        trailColors[trailIndex] = 1.0 * opacity;
        trailColors[trailIndex + 1] = 1.0 * opacity;
        trailColors[trailIndex + 2] = 1.0 * opacity;
      }
    }
    
    const trailGeometry = new THREE.BufferGeometry();
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
    
    const trailMaterial = new THREE.PointsMaterial({
      size: 1.5,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: false,
    });
    
    const trailSystem = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trailSystem);
    trailSystemRef.current = trailSystem;
    
    // Initialize trail history tracking
    trailHistoryRef.current = {
      positions: trailPositions,
      currentIndex: 0
    };
    

    // Animation loop with frame limiting for performance
    let animationFrameId: number;
    let lastTime = 0;
    const targetFPS = 30; // Limit to 30fps for better performance
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number = 0) => {
      if (!particlesRef.current) return;

      // Frame rate limiting
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastTime = currentTime - (deltaTime % frameInterval);

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
        // REALISTIC GALAXY ORBITAL MECHANICS - NO MORE MOSQUITOS!
        const time = Date.now() * 0.001;
        const mouseWorldX = mouseRef.current.x * 300; // Reduced mouse influence
        const mouseWorldY = mouseRef.current.y * 300;
        const galaxySystem = galaxySystemRef.current;
        
        if (!galaxySystem) return;
        
        // Update explosion
        if (explosionRef.current.active) {
          explosionRef.current.time += 0.016;
          if (explosionRef.current.time > 3) { // Longer disruption
            explosionRef.current.active = false;
          }
        }
        
        // Slow, realistic galaxy rotation
        galaxySystem.galaxies.forEach(galaxy => {
          galaxy.rotation += galaxy.rotationSpeed * 0.016;
        });
        
        const backgroundParticles = Math.floor(particleCount * 0.4);
        
        // Update galaxy particles only (background particles stay static)
        for (let i = backgroundParticles; i < particleCount; i++) {
          const i3 = i * 3;
          const orbitalDataIndex = i - backgroundParticles;
          const orbitalData = galaxySystem.particleOrbitalData[orbitalDataIndex];
          const galaxy = galaxySystem.galaxies[orbitalData.galaxyIndex];
          
          // Update orbital angle based on realistic speed
          orbitalData.orbitalAngle += orbitalData.orbitalSpeed;
          
          // Calculate stable orbital position with PARALLAX SCROLLING
          const spiralArmOffset = (orbitalData.armIndex / galaxy.armCount) * Math.PI * 2;
          const spiralAngle = spiralArmOffset + (orbitalData.orbitalRadius / galaxy.radius) * Math.PI * 1.5;
          const totalAngle = orbitalData.orbitalAngle + spiralAngle + galaxy.rotation;
          
          // Base orbital position with maximum density packing
          const armTightness = orbitalData.orbitalRadius < galaxy.radius * 0.6 ? 1 : 2;
          const armDeviation = Math.sin(i * 0.1) * armTightness;
          const densityVariation = Math.sin(orbitalData.orbitalRadius * 0.05) * 0.5;
          
          // Apply parallax scrolling based on depth layer - more pronounced
          const parallaxOffsetY = scrollY * galaxy.parallaxSpeed * 0.8; // More noticeable parallax
          const depthScale = 1 - (galaxy.depthLayer * 0.2); // More size difference
          
          let targetX = (galaxy.centerX + Math.cos(totalAngle) * orbitalData.orbitalRadius + 
                        Math.cos(totalAngle + Math.PI/2) * (armDeviation + densityVariation)) * depthScale;
          let targetY = (galaxy.centerY + Math.sin(totalAngle) * orbitalData.orbitalRadius + 
                        Math.sin(totalAngle + Math.PI/2) * (armDeviation + densityVariation) + parallaxOffsetY) * depthScale;
          let targetZ = galaxy.centerZ + Math.sin(i * 0.05) * 8;
          
          // VERY SUBTLE mouse influence (like dark matter)
          const mouseDistX = mouseWorldX - targetX;
          const mouseDistY = mouseWorldY - targetY;
          const mouseDistance = Math.sqrt(mouseDistX * mouseDistX + mouseDistY * mouseDistY);
          const mouseInfluence = Math.min(10 / (mouseDistance + 100), 0.2); // Extremely weak
          
          targetX += (mouseDistX / mouseDistance || 0) * mouseInfluence;
          targetY += (mouseDistY / mouseDistance || 0) * mouseInfluence;
          
          // Explosion can temporarily disrupt orbits
          if (explosionRef.current.active) {
            const expDistX = targetX - explosionRef.current.x;
            const expDistY = targetY - explosionRef.current.y;
            const expDistance = Math.sqrt(expDistX * expDistX + expDistY * expDistY);
            const expDecay = Math.max(0, 1 - explosionRef.current.time / 3);
            const expStrength = explosionRef.current.strength * expDecay / (expDistance + 50);
            
            targetX += (expDistX / expDistance || 0) * expStrength;
            targetY += (expDistY / expDistance || 0) * expStrength;
          }
          
          // GRAVITATIONAL LENSING - Light bending around black hole
          if (orbitalData.lensingStrength > 0) {
            // Calculate light deflection due to gravity
            const distToBlackHole = Math.sqrt((targetX - galaxy.centerX) ** 2 + (targetY - galaxy.centerY) ** 2);
            const deflectionAngle = orbitalData.lensingStrength * 0.1; // Lensing deflection
            
            // Bend light path - Einstein ring effects
            const angleToBlackHole = Math.atan2(targetY - galaxy.centerY, targetX - galaxy.centerX);
            const deflectionX = Math.cos(angleToBlackHole + deflectionAngle) * distToBlackHole;
            const deflectionY = Math.sin(angleToBlackHole + deflectionAngle) * distToBlackHole;
            
            targetX = galaxy.centerX + deflectionX;
            targetY = galaxy.centerY + deflectionY;
            
            // Photon sphere - extreme lensing creates multiple images
            if (orbitalData.isInPhotonSphere) {
              const multiImageEffect = Math.sin(orbitalData.orbitalAngle * 3) * 2;
              targetX += multiImageEffect;
              targetY += multiImageEffect * 0.5;
            }
          }
          
          // Smooth orbital motion - no violent forces
          positions[i3] += (targetX - positions[i3]) * 0.1;
          positions[i3 + 1] += (targetY - positions[i3 + 1]) * 0.1;
          positions[i3 + 2] += (targetZ - positions[i3 + 2]) * 0.05;
          
          // Keep rainbow spectrum colors with gravitational lensing
          const color = getGalaxyColor(
            orbitalData.orbitalRadius, 
            galaxy.radius, 
            i, 
            galaxy.colorTheme, 
            orbitalData.armIndex, 
            orbitalData.orbitalAngle,
            orbitalData.lensingStrength,
            orbitalData.isInPhotonSphere
          );
          let r = color.r;
          let g = color.g;
          let b = color.b;
          
          // EXTRA BRIGHT spiral arms for Guardians of Galaxy effect
          const armAlignment = Math.abs(Math.sin(spiralAngle)) * 0.7 + 0.6; // More pronounced
          r *= (1 + armAlignment * 1.2); // Enhanced brightness
          g *= (1 + armAlignment * 1.2);
          b *= (1 + armAlignment * 1.2);
          
          // BLAZING bright black hole center
          if (orbitalData.orbitalRadius < 30) {
            const coreIntensity = (30 - orbitalData.orbitalRadius) / 30;
            r = Math.min(1.0, r * (2 + coreIntensity * 2));
            g = Math.min(1.0, g * (2 + coreIntensity * 2));
            b = Math.min(1.0, b * (2 + coreIntensity * 2));
          }
          
          colors[i3] = r;
          colors[i3 + 1] = g;
          colors[i3 + 2] = b;
        }
      }

      // Update trails
      if (trailSystemRef.current && trailHistoryRef.current) {
        const trailLength = 20;
        const trailPositions = trailHistoryRef.current.positions;
        
        // Update trail history every few frames for performance
        if (trailHistoryRef.current.currentIndex % 3 === 0) {
          for (let i = 0; i < particleCount; i++) {
            const particleIndex = i * 3;
            const currentX = positions[particleIndex];
            const currentY = positions[particleIndex + 1];
            const currentZ = positions[particleIndex + 2];
            
            // Shift trail points backwards
            for (let t = trailLength - 1; t > 0; t--) {
              const currentTrailIndex = (i * trailLength + t) * 3;
              const prevTrailIndex = (i * trailLength + t - 1) * 3;
              
              trailPositions[currentTrailIndex] = trailPositions[prevTrailIndex];
              trailPositions[currentTrailIndex + 1] = trailPositions[prevTrailIndex + 1];
              trailPositions[currentTrailIndex + 2] = trailPositions[prevTrailIndex + 2];
            }
            
            // Add current particle position as newest trail point
            const headTrailIndex = i * trailLength * 3;
            trailPositions[headTrailIndex] = currentX;
            trailPositions[headTrailIndex + 1] = currentY;
            trailPositions[headTrailIndex + 2] = currentZ;
          }
        }
        
        trailHistoryRef.current.currentIndex++;
        trailSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Update constellation lines based on hover state
      if (galaxySystemRef.current?.constellations) {
        const constellationLinesGeometry = scene.getObjectByName('constellationLines') as THREE.LineSegments;
        if (constellationLinesGeometry) {
          const linePositions = constellationLinesGeometry.geometry.attributes.position.array as Float32Array;
          const lineColors = constellationLinesGeometry.geometry.attributes.color.array as Float32Array;
          
          let lineIndex = 0;
          
          galaxySystemRef.current.constellations.forEach((constellation, constIndex) => {
            // Always show constellations for now to test - later make it hover-based
            const isActive = true; // hoveredSection !== null || Math.sin(Date.now() * 0.001) > 0;
            
            if (isActive) {
              constellation.connections.forEach((connection, connIndex) => {
                if (lineIndex < 50) { // Max lines limit
                  const star1 = constellation.stars[connection.from];
                  const star2 = constellation.stars[connection.to];
                  
                  // Apply parallax to constellation positions
                  const parallaxOffset = scrollY * 0.1;
                  
                  // Start point
                  linePositions[lineIndex * 6] = star1.x;
                  linePositions[lineIndex * 6 + 1] = star1.y + parallaxOffset;
                  linePositions[lineIndex * 6 + 2] = 0; // Same Z as particles
                  
                  // End point  
                  linePositions[lineIndex * 6 + 3] = star2.x;
                  linePositions[lineIndex * 6 + 4] = star2.y + parallaxOffset;
                  linePositions[lineIndex * 6 + 5] = 0;
                  
                  // Line colors (bright cyan-white)
                  lineColors[lineIndex * 6] = 0.5;     // R - start point
                  lineColors[lineIndex * 6 + 1] = 1.0; // G - start point  
                  lineColors[lineIndex * 6 + 2] = 1.0; // B - start point
                  lineColors[lineIndex * 6 + 3] = 0.5; // R - end point
                  lineColors[lineIndex * 6 + 4] = 1.0; // G - end point
                  lineColors[lineIndex * 6 + 5] = 1.0; // B - end point
                  
                  lineIndex++;
                }
              });
            }
          });
          
          
          // Clear remaining lines
          for (let i = lineIndex * 6; i < linePositions.length; i++) {
            linePositions[i] = 0;
            lineColors[i] = 0;
          }
          
          constellationLinesGeometry.geometry.attributes.position.needsUpdate = true;
          constellationLinesGeometry.geometry.attributes.color.needsUpdate = true;
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