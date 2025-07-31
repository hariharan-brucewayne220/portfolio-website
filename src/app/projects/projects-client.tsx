'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { BsGrid, BsListUl } from 'react-icons/bs'
import { useRouter } from 'next/navigation'
import type { ContentItem } from '../../lib/mdx'

// --- Styled Components ---
const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: 8rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`

const Header = styled.div`
  margin-bottom: 4rem;
  text-align: center;
`

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Description = styled.p`
  color: #ffffff;
  font-weight: 500;
  font-size: 1.2rem;
  max-width: 800px;
  line-height: 1.6;
  margin: 0 auto;
`

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  gap: 2rem;
  flex-wrap: wrap;
  position: relative;
`

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem;
  border-radius: 8px;
`

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem;
  border-radius: 6px;
  background: ${props => props.$active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.$active ? 'var(--background)' : 'var(--foreground)'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  }
  svg { width: 1.2rem; height: 1.2rem; }
`

const FilterTabs = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
`

const FilterTab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  background: ${props => props.$active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.$active ? 'var(--background)' : 'var(--foreground)'};
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  &:hover {
    background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  }
`

const TimelineContainer = styled.div`
  position: relative;
  padding: 2rem 0;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: var(--border);
  }
`

const TimelineProject = styled(motion.div)<{ $isLeft: boolean }>`
  width: calc(50% - 2rem);
  margin: ${props => props.$isLeft ? '0 auto 4rem 0' : '0 0 4rem auto'};
  position: relative;
  &::before, &::after {
    content: '';
    position: absolute;
    background: var(--primary);
    z-index: 2;
  }
  &::before {
    top: 1.5rem;
    ${props => props.$isLeft ? 'right: -2.5rem' : 'left: -2.5rem'};
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
  }
  &::after {
    top: 1.875rem;
    ${props => props.$isLeft ? 'right: -1.5rem' : 'left: -1.5rem'};
    width: 1rem;
    height: 2px;
  }
`

const ProjectGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
`

const ProjectCard = styled.div`
  background: rgba(17, 17, 17, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--primary);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--card-background)'};
  background-size: cover;
  background-position: center;
`

const ProjectInfo = styled.div`
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`
const ProjectTitle = styled.h3`
  margin: 0;
  font-size: clamp(1.1rem, 3vw, 1.25rem);
  color: var(--foreground);
  line-height: 1.3;
`
const ProjectMeta = styled.div` margin-top: 0.5rem; font-size: 0.875rem; color: #ffffff; font-weight: 500; `
const ProjectDescription = styled.p`
  margin: 1rem 0;
  color: #ffffff;
  font-weight: 500;
  font-size: clamp(0.8rem, 2.2vw, 0.875rem);
  line-height: 1.5;
`
const TagsContainer = styled.div` display: flex; gap: 0.5rem; flex-wrap: wrap; `
const Tag = styled.span`
  background: var(--primary);
  color: var(--background);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`

// --- Reusable Project Card Component ---
const ProjectCardContent = ({ project, onSelect }: { project: ContentItem, onSelect: () => void }) => (
  <ProjectCard onClick={onSelect}>
    {project.image && <ProjectImage $image={project.image} />}
    <ProjectInfo>
      <ProjectTitle>{project.title || 'Untitled Project'}</ProjectTitle>
      <ProjectMeta>
        {project.institution && `${project.institution} • `}
        {project.date && new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
      </ProjectMeta>
      <ProjectDescription>{project.description || 'No description available.'}</ProjectDescription>
      {project.tags && project.tags.length > 0 && (
        <TagsContainer>
          {project.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </TagsContainer>
      )}
    </ProjectInfo>
  </ProjectCard>
);

// --- Main Client Component ---
export default function ProjectsClient({ projects }: { projects: ContentItem[] }) {
  const [filter, setFilter] = useState<'all' | 'software' | 'ai'>('all')
  const [view, setView] = useState<'grid' | 'timeline'>('timeline')
  const router = useRouter()

  // Restore scroll position when navigating back
  useEffect(() => {
    const wasNavigatingBack = sessionStorage.getItem('navigatingBack')
    const savedScrollPosition = sessionStorage.getItem('projectsScrollPosition')
    
    if (wasNavigatingBack && savedScrollPosition) {
      const scrollY = parseInt(savedScrollPosition, 10)
      window.scrollTo({ top: scrollY, behavior: 'smooth' })
      sessionStorage.removeItem('navigatingBack')
      sessionStorage.removeItem('projectsScrollPosition')
    }
  }, [])

  // Save scroll position before navigating to project detail
  const handleProjectClick = (projectSlug: string) => {
    sessionStorage.setItem('projectsScrollPosition', window.scrollY.toString())
    // Use window.location for now to ensure proper page load
    window.location.href = `/projects/${projectSlug}`
  }

  const filteredProjects = React.useMemo(() => 
    projects.filter(project => {
      if (filter === 'all') return true
      // Safely check if tags exist and include the filter
      return project.tags?.map(t => t.toLowerCase()).includes(filter.toLowerCase()) ?? false
    }), [projects, filter])

  return (
    <ProjectsContainer>
      <Header>
        <Title>Projects</Title>
        <Description>
          A showcase of my work in Software Development and Artificial Intelligence.
          Each project demonstrates practical applications of cutting-edge technology.
        </Description>
      </Header>

      <Controls>
        <FilterTabs>
          <FilterTab $active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterTab>
          <FilterTab $active={filter === 'software'} onClick={() => setFilter('software')}>Software</FilterTab>
          <FilterTab $active={filter === 'ai'} onClick={() => setFilter('ai')}>AI</FilterTab>
        </FilterTabs>
        <ViewToggle>
          <ViewButton $active={view === 'grid'} onClick={() => setView('grid')} title="Grid View"><BsGrid /></ViewButton>
          <ViewButton $active={view === 'timeline'} onClick={() => setView('timeline')} title="Timeline View"><BsListUl /></ViewButton>
        </ViewToggle>
      </Controls>

      <AnimatePresence mode="wait">
        {view === 'timeline' ? (
          <TimelineContainer key="timeline">
            {filteredProjects.map((project, index) => (
              <TimelineProject
                key={project.slug}
                $isLeft={index % 2 === 0}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCardContent 
                  project={project} 
                  onSelect={() => handleProjectClick(project.slug)} 
                />
              </TimelineProject>
            ))}
          </TimelineContainer>
        ) : (
          <ProjectGrid
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProjectCardContent 
                  project={project} 
                  onSelect={() => handleProjectClick(project.slug)} 
                />
              </motion.div>
            ))}
          </ProjectGrid>
        )}
      </AnimatePresence>

    </ProjectsContainer>
  )
}