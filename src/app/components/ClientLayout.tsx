'use client'

import React from 'react'
import styled from 'styled-components'
import { GlobalSearch } from './GlobalSearch'
import { GlobalStyles } from '../styles/GlobalStyles'
import { Navigation } from './Navigation'

const Main = styled.main`
  min-height: 100vh;
  background: var(--background);
`

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalStyles />
      <Navigation />
      <GlobalSearch />
      <Main>{children}</Main>
    </>
  )
} 