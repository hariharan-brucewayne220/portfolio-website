'use client'

import React from 'react'
import styled from 'styled-components'

const ImageContainer = styled.div<{ $color: string }>`
  width: 100%;
  height: 200px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--background);
  font-size: 1.2rem;
  font-weight: 500;
`

export function ProjectImage({ title }: { title: string }) {
  // Generate a consistent color based on the title
  const hash = title.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  const color = `hsl(${hash % 360}, 70%, 50%)`

  return (
    <ImageContainer $color={color}>
      {title.split(' ')[0]}
    </ImageContainer>
  )
} 