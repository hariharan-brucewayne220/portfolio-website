'use client'

import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
`

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`

const NavLink = styled(motion(Link))`
  color: var(--foreground);
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`

export function Navigation() {
  return (
    <Nav>
      <Logo href="/">Portfolio</Logo>
      <NavLinks>
        <NavLink 
          href="/"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          About
        </NavLink>
        <NavLink 
          href="/projects"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Projects
        </NavLink>
        <NavLink 
          href="/blog"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Blog
        </NavLink>
        <NavLink 
          href="/experience"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          Experience
        </NavLink>
      </NavLinks>
    </Nav>
  )
} 