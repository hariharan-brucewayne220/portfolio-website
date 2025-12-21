'use client'

import React from 'react'
import Image from 'next/image'
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

const ProjectCard = styled(motion.div)<{ $featured?: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.$featured ? 'rgba(0, 122, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  position: relative;

  ${props => props.$featured && `
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 12px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(0, 122, 255, 0.5), rgba(88, 86, 214, 0.5));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
  `}

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.08);
    border-color: var(--primary);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 122, 255, 0.15);
  }

  @media (max-width: 768px) {
    border-radius: 8px;

    &:hover {
      transform: translateY(-4px);
    }
  }
`

const FeaturedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #007AFF, #5856D6);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 122, 255, 0.4);
`

const ProjectImageContainer = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  background: var(--primary);
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

const Tag = styled.span<{ $category?: string }>`
  padding: 0.25rem 0.75rem;
  background: ${props => {
    const tag = props.$category?.toLowerCase() || ''
    if (tag.includes('ai') || tag.includes('llm') || tag.includes('ml')) return 'linear-gradient(135deg, #10B981, #059669)'
    if (tag.includes('react') || tag.includes('next') || tag.includes('typescript')) return 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
    if (tag.includes('python') || tag.includes('django') || tag.includes('flask')) return 'linear-gradient(135deg, #F59E0B, #D97706)'
    if (tag.includes('security') || tag.includes('cyber')) return 'linear-gradient(135deg, #EF4444, #DC2626)'
    if (tag.includes('full-stack') || tag.includes('fullstack')) return 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
    return 'var(--primary)'
  }};
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

const LinksContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: var(--foreground);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

interface GridViewProps {
  projects: ContentItem[]
  onProjectClick: (project: ContentItem) => void
}

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

export function GridView({ projects, onProjectClick }: GridViewProps) {
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Grid>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.slug}
          $featured={project.featured}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => onProjectClick(project)}
        >
          {project.featured && <FeaturedBadge>Featured</FeaturedBadge>}
          <ProjectImageContainer>
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 350px"
                style={{ objectFit: 'cover' }}
                loading="lazy"
              />
            ) : (
              project.title.split(' ')[0]
            )}
          </ProjectImageContainer>
          <ProjectContent>
            <ProjectDate>{project.date}</ProjectDate>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectDescription>{project.description}</ProjectDescription>
            <TagsContainer>
              {project.tags.map((tag: string) => (
                <Tag key={tag} $category={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
            {(project.github || project.liveUrl) && (
              <LinksContainer>
                {project.github && (
                  <LinkButton
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                  >
                    <GitHubIcon />
                    GitHub
                  </LinkButton>
                )}
                {project.liveUrl && (
                  <LinkButton
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                  >
                    <ExternalLinkIcon />
                    Live Demo
                  </LinkButton>
                )}
              </LinksContainer>
            )}
          </ProjectContent>
        </ProjectCard>
      ))}
    </Grid>
  )
} 