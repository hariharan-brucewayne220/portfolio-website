'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import { Github, Linkedin, Search, Menu, X } from 'lucide-react'

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(12px);
  background: rgba(10, 14, 20, 0.75);
  border-bottom: 1px solid var(--border);

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`

const Logo = styled(Link)`
  font-family: var(--font-mono-stack);
  font-size: 1rem;
  color: var(--foreground);

  span {
    color: var(--primary);
  }
`

const DesktopLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled(Link)<{ $active?: boolean }>`
  font-family: var(--font-mono-stack);
  font-size: 0.85rem;
  color: ${p => (p.$active ? 'var(--primary)' : 'var(--muted)')};
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }
`

const IconLink = styled.a`
  color: var(--muted);
  display: flex;
  align-items: center;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary);
  }

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`

const SearchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono-stack);
  font-size: 0.75rem;
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.35rem 0.6rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
    border-color: rgba(94, 234, 212, 0.4);
  }

  svg {
    width: 0.85rem;
    height: 0.85rem;
  }

  kbd {
    font-family: inherit;
    font-size: 0.7rem;
    padding: 0.05rem 0.3rem;
    border: 1px solid var(--border);
    border-radius: 4px;
  }
`

const MobileButton = styled.button`
  display: none;
  color: var(--foreground);

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`

const MobileMenu = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${p => (p.$open ? 'flex' : 'none')};
    position: fixed;
    top: 4rem;
    left: 0;
    right: 0;
    z-index: 999;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    background: rgba(10, 14, 20, 0.97);
    border-bottom: 1px solid var(--border);
  }
`

const links = [
  { href: '/', label: 'home' },
  { href: '/experience', label: 'experience' },
  { href: '/projects', label: 'projects' },
]

function openSearch() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
}

export function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <Nav>
        <Logo href="/">
          hariharan<span>.dev</span>
        </Logo>
        <DesktopLinks>
          {links.map(l => (
            <NavLink key={l.href} href={l.href} $active={pathname === l.href}>
              {l.label}
            </NavLink>
          ))}
          <SearchButton onClick={openSearch} aria-label="Search">
            <Search />
            <kbd>ctrl k</kbd>
          </SearchButton>
          <IconLink href="https://github.com/hariharan-brucewayne220" target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github />
          </IconLink>
          <IconLink
            href="https://linkedin.com/in/hariharan-loganathan-1615b7169"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin />
          </IconLink>
        </DesktopLinks>
        <MobileButton onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          {menuOpen ? <X /> : <Menu />}
        </MobileButton>
      </Nav>
      <MobileMenu $open={menuOpen}>
        {links.map(l => (
          <NavLink key={l.href} href={l.href} $active={pathname === l.href} onClick={() => setMenuOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <NavLink href="https://github.com/hariharan-brucewayne220" onClick={() => setMenuOpen(false)}>
          github
        </NavLink>
        <NavLink href="https://linkedin.com/in/hariharan-loganathan-1615b7169" onClick={() => setMenuOpen(false)}>
          linkedin
        </NavLink>
      </MobileMenu>
    </>
  )
}
