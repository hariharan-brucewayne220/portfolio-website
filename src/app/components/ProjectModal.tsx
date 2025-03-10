'use client'

import React from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { ContentItem } from '../api/content/route'

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 5vh 2rem;
`

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 800px;
  background: var(--background);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
`

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--foreground);
  }
`

const Header = styled.div`
  padding: 1.5rem 3rem 1.5rem 1.5rem;
`

const ProjectDate = styled.div`
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`

const ProjectTitle = styled.h2`
  font-size: 2rem;
  margin: 0;
  color: var(--foreground);
`

const Content = styled.div`
  padding: 0 1.5rem 1.5rem;
`

const Description = styled.div`
  color: var(--muted);
  line-height: 1.6;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const Tag = styled.span`
  padding: 0.25rem 0.75rem;
  background: var(--primary);
  color: var(--background);
  border-radius: 9999px;
  font-size: 0.875rem;
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
        <ModalContainer
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>
            <X size={14} />
          </CloseButton>
          <Header>
            <ProjectDate>- {project.date}</ProjectDate>
            <ProjectTitle>{project.title}</ProjectTitle>
          </Header>
          <Content>
            <Description>{project.description}</Description>
            <TagsContainer>
              {project.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagsContainer>
          </Content>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  )
} 