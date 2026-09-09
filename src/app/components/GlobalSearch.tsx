'use client'

import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Command } from 'cmdk'
import { Search, FileText, User, Briefcase, FolderOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const SearchWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20vh;
  z-index: 1000;
  backdrop-filter: blur(4px);
`

const SearchContent = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  background: var(--background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  max-height: 60vh;
`

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 0.75rem;
`

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--foreground);
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: var(--muted);
  }
`

const SearchResults = styled.div`
  max-height: 40vh;
  overflow-y: auto;
`

const SearchItem = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-left: 3px solid transparent;
  background: ${props => props.$isSelected ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  border-left-color: ${props => props.$isSelected ? 'var(--primary)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-left-color: var(--primary);
  }
`

const SearchItemIcon = styled.div`
  color: var(--muted);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

const SearchItemContent = styled.div`
  flex: 1;
  min-width: 0;
`

const SearchItemTitle = styled.div`
  color: var(--foreground);
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const SearchItemDescription = styled.div`
  color: var(--muted);
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.25rem;
`

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
`

interface SearchResult {
  id: string
  title: string
  description: string
  path: string
  type: 'page' | 'project' | 'section'
  icon: React.ReactNode
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()

  // Static search data
  const searchData = useMemo<SearchResult[]>(() => [
    {
      id: 'home',
      title: 'Home',
      description: 'Welcome page with introduction and overview',
      path: '/',
      type: 'page',
      icon: <User size={16} />
    },
    {
      id: 'about',
      title: 'About Section',
      description: 'Learn more about my background and experience',
      path: '/#about-section',
      type: 'section',
      icon: <User size={16} />
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Browse my portfolio of projects and work',
      path: '/projects',
      type: 'page',
      icon: <FolderOpen size={16} />
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'Professional experience and work history',
      path: '/experience',
      type: 'page',
      icon: <Briefcase size={16} />
    },
    // Keep in sync with projectFiles in src/lib/content.ts.
    {
      id: 'rv-tsfm-bench',
      title: 'Time-Series Foundation Models vs HAR',
      description: 'Realized-volatility benchmark of Chronos-Bolt and Granite TTM against HAR and GARCH',
      path: '/projects#rv-tsfm-bench',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'github-ecosystem-analytics',
      title: 'GitHub Developer Ecosystem Analytics',
      description: 'Lambda-architecture platform on Spark, Kafka and Airflow predicting viral repositories',
      path: '/projects#github-ecosystem-analytics',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'sentinel-agent',
      title: 'Sentinel – Autonomous Agent with On-Chain Guardrails',
      description: 'LangGraph trading agent whose limits are enforced by a smart contract, not a prompt',
      path: '/projects#sentinel-agent',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'city-witness',
      title: 'City Witness',
      description: 'Real-time voice and vision agent over NYC open data, built on Gemini Live',
      path: '/projects#city-witness',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'macrodash',
      title: 'MacroDash',
      description: 'Macroeconomic and markets dashboard with scheduled LLM analyst agents',
      path: '/projects#macrodash',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'revlens',
      title: 'RevLens',
      description: 'Multi-tenant sales call intelligence with a Whisper to GPT-4o event pipeline',
      path: '/projects#revlens',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'ai-financial-advisor',
      title: 'AI Financial Advisor',
      description: 'Hybrid-retrieval RAG with LangGraph agents and PII redaction before indexing',
      path: '/projects#ai-financial-advisor',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'sentinel-mlops',
      title: 'Sentinel – End-to-End MLOps Pipeline',
      description: 'Anomaly detection through MLflow tracking, Evidently drift monitoring and CI',
      path: '/projects#sentinel-mlops',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'llm-red-team',
      title: 'LLM Red Team Platform',
      description: 'Adversarial assessment harness across five attack categories with live streaming',
      path: '/projects#llm-red-team',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'distributed-api-monitor',
      title: 'API Monitor',
      description: 'Go health checker with Postgres history and locally hosted LLM insights',
      path: '/projects#distributed-api-monitor',
      type: 'project',
      icon: <FileText size={16} />
    },
    {
      id: 'multimodal-gaming-controller',
      title: 'Multimodal Gaming Controller',
      description: 'Hand-gesture and voice control for PC games using MediaPipe and offline speech',
      path: '/projects#multimodal-gaming-controller',
      type: 'project',
      icon: <FileText size={16} />
    }
  ], [])

  const filteredResults = useMemo(() => {
    if (!query.trim()) return searchData.slice(0, 8)
    
    return searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    )
  }, [query, searchData])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
      
      if (open) {
        if (e.key === 'Escape') {
          setOpen(false)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        } else if (e.key === 'Enter') {
          e.preventDefault()
          if (filteredResults[selectedIndex]) {
            handleSelect(filteredResults[selectedIndex])
          }
        }
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, filteredResults, selectedIndex])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    
    if (result.path.includes('#')) {
      const [path, hash] = result.path.split('#')
      router.push(path || '/')
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      router.push(result.path)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }

  return (
    <AnimatePresence>
      {open && (
        <SearchWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <SearchContent
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchInputContainer>
              <SearchItemIcon>
                <Search size={16} />
              </SearchItemIcon>
              <SearchInput
                placeholder="Search pages, projects, and sections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                ⌘K
              </div>
            </SearchInputContainer>
            
            <SearchResults>
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <SearchItem
                    key={result.id}
                    $isSelected={index === selectedIndex}
                    onClick={() => handleSelect(result)}
                  >
                    <SearchItemIcon>{result.icon}</SearchItemIcon>
                    <SearchItemContent>
                      <SearchItemTitle>{result.title}</SearchItemTitle>
                      <SearchItemDescription>{result.description}</SearchItemDescription>
                    </SearchItemContent>
                  </SearchItem>
                ))
              ) : (
                <EmptyState>
                  No results found for "{query}"
                </EmptyState>
              )}
            </SearchResults>
          </SearchContent>
        </SearchWrapper>
      )}
    </AnimatePresence>
  )
} 