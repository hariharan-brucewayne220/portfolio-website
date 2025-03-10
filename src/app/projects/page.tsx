'use client'

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { GridView } from './components/GridView'
import { TimelineProject } from './components/TimelineProject'
import type { ContentItem } from '../api/content/route'
import { ProjectModal } from '../components/ProjectModal'

const ProjectsContainer = styled.div`
  min-height: 100vh;
  padding: 8rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`

const Header = styled.div`
  margin-bottom: 4rem;
`

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Description = styled.p`
  color: var(--muted);
  font-size: 1.2rem;
  max-width: 800px;
  line-height: 1.6;
`

const ViewToggle = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem auto;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  width: fit-content;
`

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--background)' : 'var(--foreground)'};
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  }
`

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 9999px;
  width: fit-content;
  margin: 2rem auto;
`

const FilterTab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--background)' : 'var(--foreground)'};
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)'};
  }
`

const TimelineContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
  height: auto;
  min-height: calc(100vh - 400px);
  overflow-y: auto;

  /* Center line */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 2rem;
    width: 2px;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-50%);
    z-index: 1;
    height: auto;
  }

  /* Hide default scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const TimelineScroll = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 2rem;
  width: 6px;
  transform: translateX(-50%);
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  height: auto;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    background: var(--primary);
    border-radius: 3px;
    transform: scaleY(var(--scroll-scale, 0));
    transform-origin: top;
  }
`

const TimelineView = styled.div`
  position: relative;
  padding: 0 2rem;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

export default function ProjectsPage() {
  const [view, setView] = useState<'timeline' | 'grid'>('timeline')
  const [filter, setFilter] = useState<'all' | 'software' | 'ai'>('all')
  const [projects, setProjects] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ContentItem | null>(null)
  const timelineRef = React.useRef<HTMLDivElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  let scrollTimeout: NodeJS.Timeout

  // Handle scroll events
  const handleScroll = () => {
    if (!timelineRef.current || !scrollRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = timelineRef.current
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
    const scrollScale = clientHeight / scrollHeight
    
    scrollRef.current.style.setProperty('--scroll-scale', scrollScale.toString())
    scrollRef.current.style.top = `${scrollTop}px`
    scrollRef.current.style.opacity = '1'

    // Clear the previous timeout
    clearTimeout(scrollTimeout)
    
    // Set a new timeout
    scrollTimeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.style.opacity = '0'
      }
    }, 1000)
  }

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/content?type=projects')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true
    return project.tags.includes(filter.toLowerCase())
  })

  const handleProjectClick = (project: ContentItem) => {
    setSelectedProject(project)
  }

  if (loading) {
    return (
      <ProjectsContainer>
        <Header>
          <Title>Projects</Title>
          <Description>Loading...</Description>
        </Header>
      </ProjectsContainer>
    )
  }

  return (
    <ProjectsContainer>
      <Header>
        <Title>Projects</Title>
        <Description>
          A showcase of my work in Software Development and Artificial Intelligence.
          Each project demonstrates practical applications of cutting-edge technology.
        </Description>
      </Header>

      <FilterTabs>
        <FilterTab 
          active={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          All
        </FilterTab>
        <FilterTab 
          active={filter === 'software'} 
          onClick={() => setFilter('software')}
        >
          Software
        </FilterTab>
        <FilterTab 
          active={filter === 'ai'} 
          onClick={() => setFilter('ai')}
        >
          AI
        </FilterTab>
      </FilterTabs>

      <ViewToggle>
        <ToggleButton 
          active={view === 'timeline'} 
          onClick={() => setView('timeline')}
        >
          Timeline
        </ToggleButton>
        <ToggleButton 
          active={view === 'grid'} 
          onClick={() => setView('grid')}
        >
          Grid
        </ToggleButton>
      </ViewToggle>

      {view === 'timeline' ? (
        <TimelineContainer ref={timelineRef} onScroll={handleScroll}>
          <TimelineScroll ref={scrollRef} />
          <TimelineView>
            {filteredProjects.map((project, index) => (
              <TimelineProject
                key={project.slug}
                project={project}
                index={index}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </TimelineView>
        </TimelineContainer>
      ) : (
        <GridView 
          projects={filteredProjects} 
          onProjectClick={handleProjectClick}
        />
      )}

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </ProjectsContainer>
  )
} 