"use client"

import React, { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import StyledComponentsRegistry from '../lib/registry'
import { Providers } from './providers'
import ParticleBackground from './components/ParticleBackground'
import DynamicParticleBackground from './components/DynamicParticleBackground'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from './components/Navigation'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Default to `true` to prevent content flash. The intro will only be set to `false` on the client-side.
  const [introComplete, setIntroComplete] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // On the first visit to the site, if the user lands on the homepage,
    // we decide to play the intro.
    const hasPlayedIntro = sessionStorage.getItem('introPlayed') === 'true'
    const shouldSkipOnce = sessionStorage.getItem('skipIntroOnce') === 'true'
    
    if (!hasPlayedIntro && !shouldSkipOnce && pathname === '/') {
      setIntroComplete(false)
    } else {
      // Clean up skip flag after using it
      sessionStorage.removeItem('skipIntroOnce')
    }
  }, [pathname])

  const handleAnimationComplete = () => {
    setIntroComplete(true)
    sessionStorage.setItem('introPlayed', 'true')
  }

  // This function provides a robust way to reset the intro by clearing the flag
  // and forcing a reload, which guarantees a clean state.
  const handleResetIntro = () => {
    sessionStorage.clear() // Clear all session storage
    setIntroComplete(false) // Reset state immediately
    window.location.reload() // Force a complete reload
  }

  // The intro should only be shown if we are on the client and the state is explicitly set to play.
  const shouldShowIntro = isMounted && !introComplete

  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <AnimatePresence>
            {shouldShowIntro && (
              <ParticleBackground onAnimationComplete={handleAnimationComplete} />
            )}
          </AnimatePresence>
          
          {/* Dynamic background particles for all pages */}
          <DynamicParticleBackground isIntroComplete={introComplete} />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isMounted ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative', zIndex: 100 }}
          >
            <Navigation onLogoClick={handleResetIntro} />
            {/* Only render the main content if the intro is complete or was never shown */}
            {(introComplete || !shouldShowIntro) && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.3,
                    rotateX: -90,
                    z: -500,
                    filter: 'blur(10px)'
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotateX: 0,
                    z: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1], // Custom bezier for smooth emergence
                      scale: { duration: 0.6, ease: 'backOut' },
                      rotateX: { duration: 0.7, ease: 'easeOut' },
                      filter: { duration: 0.4, delay: 0.3 }
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.1,
                    rotateX: 90,
                    z: -800,
                    filter: 'blur(8px)',
                    transition: {
                      duration: 0.5,
                      ease: 'easeIn',
                      scale: { duration: 0.4, ease: [0.4, 0, 0.6, 1] }, // Fast shrink
                      rotateX: { duration: 0.4, ease: 'easeIn' },
                      filter: { duration: 0.2 }
                    }
                  }}
                  style={{ 
                    position: 'relative', 
                    zIndex: 100,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 0 40px rgba(0, 112, 243, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)',
                    background: 'rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(2px)',
                    overflow: 'hidden'
                  }}
                >
                  <Providers>{children}</Providers>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}