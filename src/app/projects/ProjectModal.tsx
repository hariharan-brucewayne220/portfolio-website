'use client'

import React from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { IoClose } from 'react-icons/io5'
import type { ContentItem } from '../../lib/mdx'
import ReactMarkdown from 'react-markdown'

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const Modal = styled(motion.div)`
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
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
`

const ProjectHeader = styled.div`
  margin-bottom: 2rem;
`

const ProjectTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ProjectMeta = styled.div`
  color: var(--muted);
  font-size: 1rem;
`

const ProjectDescription = styled.div`
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
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
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 2rem 0;

  h1, h2, h3 {
    color: var(--foreground);
    margin: 1.5rem 0 1rem;
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
`

interface ProjectModalProps {
  project: ContentItem | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
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