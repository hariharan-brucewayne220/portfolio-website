'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SearchWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
  z-index: 1000;
`

const SearchContent = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  background: var(--background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
`

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  color: var(--foreground);
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: var(--muted);
  }
`

export function GlobalSearch() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <SearchWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <SearchContent
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Command>
              <SearchInput
                placeholder="Search..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false)
                }}
              />
            </Command>
          </SearchContent>
        </SearchWrapper>
      )}
    </AnimatePresence>
  )
} 