"use client"

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

// --- Component Props & Menu Items ---
interface RadialMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Projects', path: '/projects' },
  { name: 'Experience', path: '/experience' },
  { name: 'About', path: '/#about-section' },
  { name: 'Contact', path: '/contact' },
];

// --- Styled Components ---
const RadialMenuContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(8px);
`;

const WheelContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const SvgPath = styled.path`
  cursor: pointer;
  transition: fill 0.2s ease-in-out;
  filter: drop-shadow(0 0 8px rgba(0, 112, 243, 0.3));
`;

const SvgText = styled.text`
  fill: white;
  font-size: 1.2rem;
  font-weight: 500;
  pointer-events: none;
  text-anchor: middle;
  dominant-baseline: middle;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

// --- SVG & Geometry Helpers ---
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeAnnularSector = (x: number, y: number, outerRadius: number, innerRadius: number, startAngle: number, endAngle: number) => {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
};

// --- Main Component ---
const RadialMenu: React.FC<RadialMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement>(null);
  const swooshAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (tickAudioRef.current) tickAudioRef.current.volume = 0.1;
    if (swooshAudioRef.current) swooshAudioRef.current.volume = 0.2;
  }, []);

  const playTick = () => tickAudioRef.current?.play().catch(() => {
    // Audio play failed - this can happen due to browser autoplay restrictions
  });
  const playSwoosh = () => swooshAudioRef.current?.play().catch(() => {
    // Audio play failed - this can happen due to browser autoplay restrictions
  });

  const handleMenuItemClick = (path: string) => {
    playSwoosh();
    onClose();
    if (path.startsWith('/#')) {
      sessionStorage.setItem('skipIntroOnce', 'true');
      router.push('/');
      setTimeout(() => {
        const targetId = path.substring(2);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      router.push(path);
    }
  };

  // Responsive sizing based on screen size
  const getResponsiveSize = () => {
    if (typeof window === 'undefined') return 500;
    const width = window.innerWidth;
    if (width <= 480) return Math.min(width - 40, 280); // Small phones
    if (width <= 768) return Math.min(width - 60, 400); // Tablets
    return 500; // Desktop
  };
  
  const size = getResponsiveSize();
  const center = size / 2;
  const outerRadius = size / 2 - 10;
  const innerRadius = Math.max(size * 0.2, 60); // Responsive inner radius
  const segmentAngle = 360 / menuItems.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <RadialMenuContainer 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
        >
          <audio ref={tickAudioRef} src="/sounds/tick.mp3" preload="auto" />
          <audio ref={swooshAudioRef} src="/sounds/swoosh.wav" preload="auto" />
          <WheelContainer
            initial={{ 
              scale: 0.1, 
              opacity: 0,
              x: typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.3, 200) : 200,
              rotate: 90
            }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: 0, // Center position
              rotate: 0,
              transition: { 
                duration: 0.6, 
                ease: 'backOut',
                scale: { duration: 0.5, ease: 'backOut' },
                x: { duration: 0.4, ease: 'easeOut' },
                rotate: { duration: 0.5, ease: 'easeOut' }
              } 
            }}
            exit={{ 
              scale: 0.1, 
              opacity: 0,
              x: typeof window !== 'undefined' ? -Math.min(window.innerWidth * 0.3, 200) : -200,
              rotate: -90,
              transition: { 
                duration: 0.4, 
                ease: 'easeIn',
                scale: { duration: 0.3, ease: 'easeIn' },
                x: { duration: 0.4, ease: 'easeIn' },
                rotate: { duration: 0.3, ease: 'easeIn' }
              } 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg 
              width={size} 
              height={size} 
              viewBox={`0 0 ${size} ${size}`}
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            >
              <g>
                {menuItems.map((item, index) => {
                  const startAngle = index * segmentAngle;
                  const endAngle = startAngle + segmentAngle;
                  const pathData = describeAnnularSector(center, center, outerRadius, innerRadius, startAngle, endAngle);
                  const midAngle = startAngle + segmentAngle / 2;
                  const textRadius = innerRadius + (outerRadius - innerRadius) / 2;
                  const { x, y } = polarToCartesian(center, center, textRadius, midAngle);

                  return (
                    <g key={item.name}>
                      <SvgPath
                        d={pathData}
                        fill={activeIndex === index ? 'rgba(0, 112, 243, 0.8)' : 'rgba(255, 255, 255, 0.05)'}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="2"
                        onMouseEnter={() => { playTick(); setActiveIndex(index); }}
                        onMouseLeave={() => setActiveIndex(null)}
                        onClick={() => handleMenuItemClick(item.path)}
                      />
                      <SvgText x={x} y={y}>{item.name}</SvgText>
                    </g>
                  );
                })}
              </g>
              <SvgText 
                x={center} 
                y={center} 
                fontSize={size <= 280 ? '1.2rem' : size <= 400 ? '1.5rem' : '1.8rem'} 
                fontWeight="bold"
              >
                Menu
              </SvgText>
            </svg>
          </WheelContainer>
        </RadialMenuContainer>
      )}
    </AnimatePresence>
  );
};

export default RadialMenu;