'use client'

import React from 'react'
import styled from 'styled-components'
import { GlobalSearch } from './GlobalSearch'
import { GlobalStyles } from '../styles/GlobalStyles'

const Main = styled.main`
  min-height: 100vh;
  background: transparent; /* Let particles show through */
`

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalStyles />
      <GlobalSearch />
      <Main>{children}</Main>
    </>
  )
} 