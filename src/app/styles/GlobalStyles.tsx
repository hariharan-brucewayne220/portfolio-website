'use client'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  :root {
    --background: #000000;
    --foreground: #ffffff;
    --primary: #007AFF;
    --secondary: #5856D6;
    --accent: #FF2D55;
    --muted: #86868b;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    min-height: 100vh;
    overflow-x: hidden;
    background: var(--background);
    color: var(--foreground);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  #__next {
    min-height: 100vh;
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
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
  }

  p {
    line-height: 1.6;
  }
` 