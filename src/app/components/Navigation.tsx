"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import RadialMenu from './RadialMenu'

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
  }
`

const Logo = styled.a`
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 700;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
`

const BurgerButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  
  &:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    width: 2.75rem;
    height: 2.75rem;
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    width: 3rem;
    height: 3rem;
    padding: 0.875rem;
  }
`

const BurgerLine = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  height: 2px;
  background: var(--foreground);
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
  
  &:nth-child(1) {
    transform: ${props => props.$isOpen ? 'rotate(45deg) translate(6px, 6px)' : 'rotate(0)'};
  }
  
  &:nth-child(2) {
    opacity: ${props => props.$isOpen ? '0' : '1'};
    transform: ${props => props.$isOpen ? 'translateX(20px)' : 'translateX(0)'};
  }
  
  &:nth-child(3) {
    transform: ${props => props.$isOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'rotate(0)'};
  }
  
  @media (max-width: 768px) {
    height: 3px;
    
    &:nth-child(1) {
      transform: ${props => props.$isOpen ? 'rotate(45deg) translate(7px, 7px)' : 'rotate(0)'};
    }
    
    &:nth-child(3) {
      transform: ${props => props.$isOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'rotate(0)'};
    }
  }
`

export function Navigation({ onLogoClick }: { onLogoClick: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onLogoClick()
  }

  return (
    <>
      <Nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link href="/" passHref legacyBehavior>
          <Logo onClick={handleLogoClick}>Portfolio</Logo>
        </Link>
        <BurgerButton
          onClick={() => setIsMenuOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BurgerLine $isOpen={isMenuOpen} />
          <BurgerLine $isOpen={isMenuOpen} />
          <BurgerLine $isOpen={isMenuOpen} />
        </BurgerButton>
      </Nav>
      <RadialMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  )
}
