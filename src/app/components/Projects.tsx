'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { ContentItem } from '../../lib/mdx'

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
`

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
  }
`

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`

const ProjectContent = styled.div`
  padding: 1.5rem;
`

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--foreground);
`

const ProjectDescription = styled.p`
  color: var(--muted);
  margin-bottom: 1rem;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const Tag = styled.span`
  background: var(--primary);
  color: var(--background);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`

interface ProjectsProps {
  projects: ContentItem[]
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <ProjectsGrid>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {project.image && <ProjectImage src={project.image} alt={project.title} />}
          <ProjectContent>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TagsContainer>
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          </ProjectContent>
        </ProjectCard>
      ))}
    </ProjectsGrid>
  )
} 