'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { ContentItem } from '../../../lib/mdx'

const ProjectCard = styled(motion.div)<{ $isEven: boolean }>`
  position: relative;
  width: calc(50% - 2rem);
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: ${props => props.$isEven ? 'calc(50% + 2rem)' : '0'};

  /* Timeline dot */
  &::before {
    content: '';
    position: absolute;
    ${props => props.$isEven ? 'left: -2.5rem;' : 'right: -2.5rem;'};
    top: 50%;
    width: 12px;
    height: 12px;
    background: var(--primary);
    border-radius: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }

  /* Timeline connector line */
  &::after {
    content: '';
    position: absolute;
    ${props => props.$isEven ? 'left: -1.5rem;' : 'right: -1.5rem;'};
    top: 50%;
    width: 1rem;
    height: 2px;
    background: var(--primary);
    transform: translateY(-50%);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: ${props => props.$isEven ? 'translateX(-10px)' : 'translateX(10px)'};
    border-color: var(--primary);
  }
`

const Institution = styled.div`
  color: var(--primary);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
`

const ProjectDate = styled.span`
  color: var(--muted);
  font-size: 0.9rem;
  margin-left: 0.5rem;
`

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: var(--foreground);
`

const ProjectDescription = styled.p`
  color: var(--muted);
  margin: 0.5rem 0 1rem;
  line-height: 1.6;
`

const ProjectImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 1rem;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: var(--primary);
  color: var(--background);
  border-radius: 9999px;
  font-size: 0.875rem;
  opacity: 0.9;
`

interface TimelineProjectProps {
  project: ContentItem
  index: number
  onClick: () => void
}

export function TimelineProject({ project, index, onClick }: TimelineProjectProps) {
  const isEven = index % 2 === 0

  return (
    <ProjectCard
      $isEven={isEven}
      initial={{ opacity: 0, x: isEven ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
    >
      <Institution>
        {project.institution}
        <ProjectDate>- {project.date}</ProjectDate>
      </Institution>
      <ProjectTitle>{project.title}</ProjectTitle>
      {project.image && <ProjectImage $image={project.image} />}
      <ProjectDescription>{project.description}</ProjectDescription>
      <TagsContainer>
        {project.tags.map(tag => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </TagsContainer>
    </ProjectCard>
  )
} 