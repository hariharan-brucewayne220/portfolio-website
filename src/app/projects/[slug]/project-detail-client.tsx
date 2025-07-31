'use client'

import React, { useEffect } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { IoArrowBack, IoCalendar, IoLocationOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import type { ContentItem } from '../../../lib/mdx'
import ReactMarkdown from 'react-markdown'

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const FixedHeader = styled(motion.div)`
  position: fixed;
  top: 6rem;
  left: 2rem;
  right: 2rem;
  z-index: 10000;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    top: 5rem;
    left: 1rem;
    right: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary);
  border: 2px solid var(--primary);
  color: var(--background);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;

  &:hover {
    background: transparent;
    color: var(--primary);
    transform: translateX(-2px) scale(1.05);
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`

const ProjectTitleFixed = styled.div`
  color: var(--foreground);
  font-size: 1.2rem;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
    margin-top: 0.5rem;
  }
`

const ProjectHeader = styled(motion.div)`
  margin-bottom: 3rem;
`

const ProjectTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
`

const ProjectMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  color: #ffffff;
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    width: 1rem;
    height: 1rem;
    opacity: 0.8;
  }
`

const ProjectDescription = styled.div`
  color: #ffffff;
  font-weight: 500;
  font-size: clamp(1.1rem, 3vw, 1.2rem);
  line-height: 1.8;
  margin-bottom: 2rem;
`

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`

const Tag = styled.span`
  background: var(--primary);
  color: var(--background);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: lowercase;
`

const MediaContainer = styled(motion.div)`
  width: 100%;
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`

const ProjectImage = styled.div<{ $image?: string }>`
  width: 100%;
  height: 400px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--card-background)'};
  background-size: cover;
  background-position: center;
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
`

const VideoContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
`

const ContentSection = styled(motion.div)`
  color: #ffffff;
  font-weight: 500;
  font-size: clamp(1rem, 2.8vw, 1.1rem);
  line-height: 1.8;

  h1, h2, h3 {
    color: var(--foreground);
    margin: 2rem 0 1rem;
    font-size: clamp(1.3rem, 4vw, 1.6rem);
  }

  h1 {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }

  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }

  li {
    margin: 0.75rem 0;
  }

  p {
    margin: 1.5rem 0;
  }

  blockquote {
    border-left: 3px solid var(--primary);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    opacity: 0.9;
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
  }
  
  @media (max-width: 768px) {
    ul, ol {
      padding-left: 1.5rem;
    }
  }
`

interface ProjectDetailClientProps {
  project: ContentItem
}

// Simplified page transition variants for better performance
const pageVariants = {
  initial: {
    opacity: 0,
    x: 50
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const router = useRouter()

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}?rel=0&modestbranding=1`
    }
    return null
  }

  // Handle back navigation with smooth scroll restoration
  const handleBack = () => {
    // Store that we're navigating back
    sessionStorage.setItem('navigatingBack', 'true')
    router.back()
  }

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      sessionStorage.setItem('navigatingBack', 'true')
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <>
      <FixedHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BackButton
          onClick={handleBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <IoArrowBack />
          Back to Projects
        </BackButton>
        <ProjectTitleFixed>
          {project.title}
        </ProjectTitleFixed>
      </FixedHeader>

      <Container
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ paddingTop: '10rem' }}
      >

      <ProjectHeader
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <ProjectTitle>{project.title}</ProjectTitle>
        
        <ProjectMeta>
          <MetaItem>
            <IoCalendar />
            {new Date(project.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </MetaItem>
          {project.institution && (
            <MetaItem>
              <IoLocationOutline />
              {project.institution}
            </MetaItem>
          )}
        </ProjectMeta>

        <ProjectDescription>
          {project.description}
        </ProjectDescription>

        <TagsContainer>
          {project.tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
      </ProjectHeader>

      <MediaContainer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {project.youtube ? (
          <VideoContainer>
            <iframe
              src={getYouTubeEmbedUrl(project.youtube) || ''}
              title={`${project.title} - Video Demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoContainer>
        ) : project.image && (
          <ProjectImage $image={project.image} />
        )}
      </MediaContainer>

      <ContentSection
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <ReactMarkdown>{project.content}</ReactMarkdown>
      </ContentSection>
      </Container>
    </>
  )
}