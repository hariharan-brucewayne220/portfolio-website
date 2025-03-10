'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { ContentItem } from '../../lib/mdx'

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

const ProjectCard = styled(motion.div)`
  background: var(--card-background);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`

const ProjectImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background: var(--background);
`

const ProjectInfo = styled.div`
  padding: 1.5rem;
`

const ProjectTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: var(--foreground);
`

const ProjectMeta = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--muted);
`

const ProjectDescription = styled.p`
  margin: 1rem 0;
  color: var(--muted);
  font-size: 0.875rem;
  line-height: 1.5;
`

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const Tag = styled.span`
  background: var(--tag-background);
  color: var(--tag-foreground);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`

interface ProjectsProps {
  projects: ContentItem[]
  onProjectClick?: (project: ContentItem) => void
}

export function Projects({ projects = [], onProjectClick }: ProjectsProps) {
  if (!projects || projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
        No projects found.
      </div>
    )
  }

  return (
    <ProjectsGrid>
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          onClick={() => onProjectClick?.(project)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {project.image && (
            <ProjectImage>
              <Image
                src={project.image}
                alt={project.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </ProjectImage>
          )}
          <ProjectInfo>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectMeta>
              {project.institution && `${project.institution} • `}
              {new Date(project.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </ProjectMeta>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TagsContainer>
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          </ProjectInfo>
        </ProjectCard>
      ))}
    </ProjectsGrid>
  )
} 