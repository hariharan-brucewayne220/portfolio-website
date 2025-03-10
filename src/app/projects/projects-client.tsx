'use client'

import React from 'react'
import styled from 'styled-components'
import { Projects } from '../components/Projects'
import type { ContentItem } from '../../lib/mdx'

const ProjectsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`

const ProjectsHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`

interface ProjectsClientProps {
  projects: ContentItem[]
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  return (
    <ProjectsContainer>
      <ProjectsHeader>
        <h1>My Projects</h1>
        <p>A collection of my work, side projects, and experiments.</p>
      </ProjectsHeader>
      <Projects projects={projects} />
    </ProjectsContainer>
  )
} 