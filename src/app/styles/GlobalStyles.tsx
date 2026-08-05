'use client'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --background: #0a0e14;
    --surface: #0d1219;
    --foreground: #e6edf3;
    --muted: #8b949e;
    --primary: #5eead4;
    --secondary: #7dd3fc;
    --accent: #5eead4;
    --border: rgba(230, 237, 243, 0.08);
    --card-background: rgba(230, 237, 243, 0.03);
    --tag-background: rgba(94, 234, 212, 0.08);
    --tag-foreground: #5eead4;
    --font-sans-stack: var(--font-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono-stack: var(--font-mono), 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  html,
  body {
    max-width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans-stack);
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: rgba(94, 234, 212, 0.25);
    color: var(--foreground);
  }

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: var(--background);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(230, 237, 243, 0.15);
    border-radius: 5px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
    font-family: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  p {
    line-height: 1.7;
  }

  code, pre, kbd {
    font-family: var(--font-mono-stack);
  }
`
