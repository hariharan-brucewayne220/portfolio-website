'use client'

import React, { useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import type { ContentItem } from '../../lib/mdx'
import { ProjectModal } from '../projects/ProjectModal'

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

const ProjectImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
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
}

export function Projects({ projects }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<ContentItem | null>(null)

  if (!projects || projects.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
        No projects found.
      </div>
    )
  }

  return (
    <>
      <ProjectsGrid>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedProject(project)}
          >
            {project.image && (
              <ProjectImage src={project.image} alt={project.title} />
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

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </>
  )
} 