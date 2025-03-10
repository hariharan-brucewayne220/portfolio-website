'use client'

import React from 'react'
import { GlobalSearch } from './components/GlobalSearch'
import { GlobalStyles } from './styles/GlobalStyles'

interface LayoutClientProps {
  children: React.ReactNode
  className?: string
}

export default function LayoutClient({ children, className }: LayoutClientProps) {
  return (
    <div className={className}>
      <GlobalStyles />
      <GlobalSearch />
      {children}
    </div>
  )
} 