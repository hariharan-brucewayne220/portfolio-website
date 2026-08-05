'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from './Navigation'
import { GlobalSearch } from './GlobalSearch'
import { GlobalStyles } from '../styles/GlobalStyles'

const NetworkBackground = dynamic(() => import('./NetworkBackground'), {
  ssr: false,
  loading: () => null,
})

const Content = styled.div`
  position: relative;
  z-index: 1;
`

const Footer = styled.footer`
  position: relative;
  z-index: 1;
  padding: 2.5rem 2rem;
  text-align: center;
  font-family: var(--font-mono-stack);
  font-size: 0.75rem;
  color: var(--muted);

  a {
    color: var(--primary);
  }
`

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <GlobalStyles />
      <NetworkBackground />
      <GlobalSearch />
      <Navigation />
      <Content>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Content>
      <Footer>
        built by <a href="https://github.com/hariharan-brucewayne220">hariharan loganathan</a>
      </Footer>
    </>
  )
}
