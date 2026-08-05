'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 9rem 2rem 4rem;
  max-width: 1100px;
  margin: 0 auto;
`

const Kicker = styled.p`
  font-family: var(--font-mono-stack);
  font-size: 0.9rem;
  color: var(--primary);
  margin-bottom: 1.25rem;
`

const Title = styled.h1`
  font-size: clamp(2.5rem, 7vw, 4.25rem);
  color: var(--foreground);
  margin-bottom: 0.75rem;
`

const Subtitle = styled.h2`
  font-size: clamp(1.5rem, 4.5vw, 2.5rem);
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 2rem;
`

const Lede = styled.p`
  color: var(--muted);
  font-size: 1.05rem;
  max-width: 600px;
  margin-bottom: 2.5rem;

  strong {
    color: var(--foreground);
    font-weight: 500;
  }

  a {
    color: var(--primary);
  }
`

const CtaRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 6rem;
`

const PrimaryCta = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono-stack);
  font-size: 0.9rem;
  color: var(--primary);
  border: 1px solid rgba(94, 234, 212, 0.4);
  border-radius: 6px;
  padding: 0.8rem 1.4rem;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(94, 234, 212, 0.08);
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`

const GhostCta = styled.a`
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono-stack);
  font-size: 0.9rem;
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.8rem 1.4rem;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary);
    border-color: rgba(94, 234, 212, 0.4);
  }
`

const Section = styled(motion.section)`
  margin-bottom: 5rem;
`

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.35rem;
  color: var(--foreground);
  margin-bottom: 1.75rem;

  span {
    font-family: var(--font-mono-stack);
    font-size: 0.95rem;
    color: var(--primary);
    font-weight: 400;
  }

  &::after {
    content: '';
    flex: 1;
    max-width: 240px;
    height: 1px;
    background: var(--border);
  }
`

const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 3.5rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Paragraph = styled.p`
  color: var(--muted);
  font-size: 1rem;
  margin-bottom: 1.25rem;

  strong {
    color: var(--foreground);
    font-weight: 500;
  }

  a {
    color: var(--primary);
  }
`

const PhotoFrame = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 4 / 5;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  filter: saturate(0.9);
  transition: filter 0.3s ease, border-color 0.3s ease;

  &:hover {
    filter: saturate(1);
    border-color: rgba(94, 234, 212, 0.4);
  }

  @media (max-width: 900px) {
    margin: 0 auto;
  }
`

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1.25rem;
`

const SkillGroup = styled.div`
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem;
  background: var(--card-background);

  h4 {
    font-family: var(--font-mono-stack);
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--primary);
    margin-bottom: 0.9rem;
  }

  ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  li {
    font-family: var(--font-mono-stack);
    font-size: 0.75rem;
    color: var(--muted);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
  }
`

const EduItem = styled.div`
  margin-bottom: 1.5rem;

  strong {
    color: var(--foreground);
    font-weight: 500;
  }

  p {
    color: var(--muted);
    font-size: 0.95rem;
  }

  .meta {
    font-family: var(--font-mono-stack);
    font-size: 0.8rem;
    color: var(--primary);
  }
`

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

const skillGroups = [
  {
    name: '// ai + llm',
    items: ['LangChain', 'LangGraph', 'RAG', 'OpenAI', 'Anthropic', 'Gemini Live', 'pgvector', 'PyTorch'],
  },
  {
    name: '// languages',
    items: ['Python', 'TypeScript', 'Go', 'C#', 'SQL', 'JavaScript'],
  },
  {
    name: '// backend + data',
    items: ['FastAPI', 'Next.js', '.NET Core', 'PostgreSQL', 'Redis', 'Kafka', 'Spark', 'gRPC'],
  },
  {
    name: '// cloud + ops',
    items: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Prometheus', 'GitHub Actions', 'MLflow'],
  },
]

export default function HomePage() {
  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Kicker>hi, my name is</Kicker>
        <Title>Hariharan Loganathan.</Title>
        <Subtitle>I build AI systems that make it to production.</Subtitle>
        <Lede>
          AI engineer and founding engineer at <strong>GeneGenius</strong>, an early-stage platform for
          clinical genomic variant interpretation. Previously three years of backend engineering at{' '}
          <strong>Zenoti</strong>, now finishing my MS in Computer Science at <strong>NYU</strong>. I work
          on agentic LLM systems, retrieval pipelines, and the infrastructure that keeps them reliable.
        </Lede>
        <CtaRow>
          <PrimaryCta href="/projects">
            view my work <ArrowRight />
          </PrimaryCta>
          <GhostCta href="mailto:hariharan.poru@gmail.com">get in touch</GhostCta>
        </CtaRow>
      </motion.div>

      <Section variants={itemVariants}>
        <SectionTitle>
          <span>01.</span> about
        </SectionTitle>
        <AboutGrid>
          <div>
            <Paragraph>
              My path runs from high-throughput payroll microservices serving <strong>1,000+ globally
              distributed nodes</strong> at Zenoti, through GenAI security evaluation at Block Convey, to
              building an AI platform for genomics as a founding engineer. Along the way I picked up a
              habit: treating LLM features like production software, with retrieval quality, latency
              budgets, observability, and failure modes all accounted for.
            </Paragraph>
            <Paragraph>
              Lately that means multimodal voice+vision agents on Gemini Live, hybrid-retrieval RAG with
              LangGraph, and Go services that monitor model-serving fleets. I also contribute to{' '}
              <a href="https://github.com/stanfordnlp/dspy" target="_blank" rel="noreferrer">
                DSPy
              </a>{' '}
              and TA two graduate courses at NYU.
            </Paragraph>
          </div>
          <PhotoFrame>
            <Image
              src="/profile.jpeg"
              alt="Hariharan Loganathan"
              fill
              sizes="(max-width: 900px) 100vw, 320px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </PhotoFrame>
        </AboutGrid>
      </Section>

      <Section variants={itemVariants}>
        <SectionTitle>
          <span>02.</span> skills
        </SectionTitle>
        <SkillsGrid>
          {skillGroups.map(group => (
            <SkillGroup key={group.name}>
              <h4>{group.name}</h4>
              <ul>
                {group.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SkillGroup>
          ))}
        </SkillsGrid>
      </Section>

      <Section variants={itemVariants}>
        <SectionTitle>
          <span>03.</span> education
        </SectionTitle>
        <EduItem>
          <strong>M.S. in Computer Science</strong>
          <p>New York University</p>
          <p className="meta">2024 – 2026 · GPA 3.72/4.0 · TA, Information Visualization & Information Security</p>
        </EduItem>
        <EduItem>
          <strong>B.Tech. in Information Technology</strong>
          <p>Vellore Institute of Technology</p>
          <p className="meta">2017 – 2021</p>
        </EduItem>
      </Section>
    </Container>
  )
}
