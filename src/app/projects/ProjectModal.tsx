'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import type { ContentItem } from '../../lib/mdx'
import ReactMarkdown from 'react-markdown'

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`

const Modal = styled(motion.div)`
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  
  @media (max-width: 768px) {
    max-height: 90vh;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    max-height: 95vh;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--foreground);
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  @media (max-width: 768px) {
    width: 3rem;
    height: 3rem;
    top: 0.5rem;
    right: 0.5rem;
    
    svg {
      width: 1.8rem;
      height: 1.8rem;
    }
  }
`

const ProjectImage = styled.div<{ $image?: string }>`
  width: 100%;
  height: 300px;
  background: ${props => props.$image ? `url(${props.$image})` : 'var(--card-background)'};
  background-size: cover;
  background-position: center;
`

const ProjectContent = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`

const ProjectHeader = styled.div`
  margin-bottom: 2rem;
`

const ProjectTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
`

const ProjectMeta = styled.div`
  color: #ffffff;
  font-weight: 500;
  font-size: clamp(0.9rem, 2.5vw, 1rem);
`

const ProjectDescription = styled.div`
  color: #ffffff;
  font-weight: 500;
  font-size: clamp(1rem, 2.8vw, 1.1rem);
  line-height: 1.8;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`

const TagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`

const Tag = styled.span`
  background: var(--primary);
  color: var(--background);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: lowercase;
`

const MarkdownContent = styled.div`
  color: #ffffff;
  font-weight: 500;
  font-size: clamp(1rem, 2.8vw, 1.1rem);
  line-height: 1.8;
  margin: 2rem 0;

  h1, h2, h3 {
    color: var(--foreground);
    margin: 1.5rem 0 1rem;
    font-size: clamp(1.2rem, 3.5vw, 1.5rem);
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
  }

  p {
    margin: 1rem 0;
  }
  
  @media (max-width: 768px) {
    margin: 1.5rem 0;
    
    ul, ol {
      padding-left: 1rem;
    }
  }
`

interface ProjectModalProps {
  project: ContentItem | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])
  
  
  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          // Only close if clicking directly on the overlay, not the modal content
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        <Modal
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <IoClose />
          </CloseButton>
          
          {project.image && (
            <ProjectImage $image={project.image} />
          )}
          
          <ProjectContent>
            <ProjectHeader>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectMeta>
                {project.institution && `${project.institution} • `}
                {new Date(project.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </ProjectMeta>
            </ProjectHeader>

            <MarkdownContent>
              <ReactMarkdown>{project.content}</ReactMarkdown>
            </MarkdownContent>

            <TagsContainer>
              {project.tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          </ProjectContent>
        </Modal>
      </Overlay>
    </AnimatePresence>
  )
} 