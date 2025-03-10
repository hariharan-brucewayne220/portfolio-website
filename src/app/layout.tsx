'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import { createGlobalStyle } from 'styled-components'
import StyledComponentsRegistry from '../lib/registry'
import ClientLayout from './components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

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

export const metadata = {
  title: 'Portfolio',
  description: 'My Professional Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <ClientLayout>{children}</ClientLayout>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
} 