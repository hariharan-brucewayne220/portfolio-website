'use client'

import React from 'react'
import { createGlobalStyle } from 'styled-components'
import ClientLayout from './components/ClientLayout'

const GlobalStyle = createGlobalStyle`
  :root {
    --background: #000;
    --foreground: #fff;
    --primary: #0070f3;
    --muted: #888;
    --border: rgba(255, 255, 255, 0.1);
    --card-background: rgba(255, 255, 255, 0.05);
    --tag-background: rgba(0, 112, 243, 0.1);
    --tag-foreground: #0070f3;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    background: var(--background);
    color: var(--foreground);
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalStyle />
      <ClientLayout>{children}</ClientLayout>
    </>
  )
} 