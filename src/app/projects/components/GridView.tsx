'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { ContentItem } from '../../../lib/mdx'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    border-radius: 8px;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`

const ProjectImage = styled.div<{ $image?: string }>`
  width: 100%;
  height: 200px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--primary)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--background);
  font-size: 1.2rem;
  font-weight: 500;
`

const ProjectContent = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const ProjectDate = styled.div`
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const ProjectTitle = styled.h3`
  font-size: clamp(1.2rem, 3.5vw, 1.5rem);
  margin-bottom: 1rem;
  color: var(--foreground);
  line-height: 1.3;
`

const ProjectDescription = styled.p`
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 1rem;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
  line-height: 1.5;
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
`

interface GridViewProps {
  projects: ContentItem[]
  onProjectClick: (project: ContentItem) => void
}

export function GridView({ projects, onProjectClick }: GridViewProps) {
  return (
    <Grid>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => onProjectClick(project)}
        >
          <ProjectImage $image={project.image}>
            {!project.image && project.title.split(' ')[0]}
          </ProjectImage>
          <ProjectContent>
            <ProjectDate>{project.date}</ProjectDate>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TagsContainer>
              {project.tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          </ProjectContent>
        </ProjectCard>
      ))}
    </Grid>
  )
} 