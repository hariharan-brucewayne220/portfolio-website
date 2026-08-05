'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

export const dynamic = 'force-static'

const ExperienceContainer = styled.div`
  min-height: 100vh;
  padding: 9rem 2rem 2rem;
  max-width: 900px;
  margin: 0 auto;
`

const Header = styled.div`
  margin-bottom: 4rem;
`

const Title = styled.h1`
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  color: var(--foreground);
  margin-bottom: 1rem;

  span {
    font-family: var(--font-mono-stack);
    font-size: 1.1rem;
    color: var(--primary);
    font-weight: 400;
    display: block;
    margin-bottom: 0.75rem;
  }
`

const Description = styled.p`
  color: var(--muted);
  font-size: 1.05rem;
  max-width: 640px;
`

const Timeline = styled.div`
  position: relative;
  padding-left: 1.75rem;
  border-left: 1px solid var(--border);
`

const ExperienceCard = styled(motion.div)`
  position: relative;
  background: var(--card-background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.75rem 2rem;
  margin-bottom: 2rem;
  transition: border-color 0.25s ease;

  &:hover {
    border-color: rgba(94, 234, 212, 0.35);
  }

  &::before {
    content: '';
    position: absolute;
    left: -2.1rem;
    top: 2.1rem;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--background);
    border: 2px solid var(--primary);
  }
`

const Role = styled.h2`
  font-size: 1.25rem;
  color: var(--foreground);
  margin-bottom: 0.35rem;

  span {
    color: var(--primary);
  }
`

const Meta = styled.div`
  font-family: var(--font-mono-stack);
  font-size: 0.8rem;
  color: var(--muted);
  margin-bottom: 1.25rem;
`

const Achievements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const Achievement = styled.li`
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.65;
  margin-bottom: 0.7rem;
  padding-left: 1.4rem;
  position: relative;

  &:before {
    content: '▹';
    color: var(--primary);
    position: absolute;
    left: 0;
  }
`

const experiences = [
  {
    role: 'Founding Software Engineer',
    company: 'CEART',
    location: 'Remote',
    duration: 'jun 2026 – present',
    achievements: [
      'Founding software engineer on CEARTscore, an AI-powered due-diligence and scoring platform for renewable energy developments.',
      'Own features end to end across a Next.js/Supabase scoring dashboard and a Python event-sourced analysis worker running on Railway.',
      'Built job control and crash recovery for the analysis pipeline: safe stop/terminate for long-running analyses, plus fixes for silent data-loss bugs in job reclaim and resume.',
      'Drove SOC 2 readiness work: moved databases off public TCP proxies onto private networking, added environment-credential isolation guardrails to the worker, and designed a tiered secret-rotation plan.',
      'Set up staging/production release isolation across both services, with main deploying to staging and a release branch to production, promoted by PR.',
      'Hardened row-level security policies and optimized SECURITY DEFINER RPCs and SQL migrations, with every change shipped through AI-assisted review and CI.',
    ],
  },
  {
    role: 'Founding Engineer',
    company: 'GeneGenius',
    location: 'Remote',
    duration: '2025 – present',
    achievements: [
      'Founding engineer at an early-stage AI platform for clinical genomic variant interpretation, spanning engineering, product strategy, and business development.',
      'Platform traction: 80 daily active researchers, two institutional LOIs, and NVIDIA Inception membership.',
      'Working across the stack on LLM-driven variant interpretation workflows and the ETHOS governance layer.',
    ],
  },
  {
    role: 'Software Engineer Intern',
    company: 'Block Convey',
    location: 'New York, NY',
    duration: 'oct 2025 – dec 2025',
    achievements: [
      'Built an automated GenAI security and evaluation platform: Next.js/FastAPI full stack, real-time WebSocket streaming, Plotly dashboards, and automated PDF reporting.',
      'Integrated OpenAI, Anthropic, and Google models behind a unified multi-provider inference layer with session isolation, rate limiting, and fault-tolerant retries.',
      'Implemented a composite NLP scoring pipeline (BLEU hallucination detection, VADER sentiment, sentence-transformer similarity) evaluating 13+ LLM configurations across 5 vulnerability categories.',
    ],
  },
  {
    role: 'Teaching Assistant',
    company: 'New York University',
    location: 'New York, NY',
    duration: 'sep 2025 – may 2026',
    achievements: [
      'Information Visualization (Spring 2026): guided 40+ graduate students through Python data-visualization projects with Matplotlib, Plotly, and D3.js.',
      'Information Security & Privacy (Fall 2025): mentored 30+ students on encryption, authentication, and network security.',
    ],
  },
  {
    role: 'Software Engineer',
    company: 'Zenoti',
    location: 'Hyderabad, India',
    duration: 'jul 2021 – jul 2024',
    achievements: [
      'Built and maintained high-throughput backend services in C#/.NET Core supporting 1,000+ globally distributed nodes with fault tolerance and graceful degradation.',
      'Architected Payroll V2 as a distributed multi-tenant microservice integrating with ADP, with strict data isolation across organizations.',
      'Implemented an event-driven pipeline with Kafka and Spark for employee lifecycle events, enabling real-time audit logging and cutting support escalations by 30%.',
      'Optimized SQL procedures and indexing for payroll computation, reducing API latency by 60%.',
      'Led a React/TypeScript UI revamp, cutting load times by 20% and lifting self-checkout adoption by 25% across 60+ locations.',
      'Mentored junior engineers and led incident response for production systems.',
    ],
  },
  {
    role: 'Full Stack Development Intern',
    company: 'Wabtec (formerly GE Transportation)',
    location: 'Bangalore, India',
    duration: 'feb 2021 – jun 2021',
    achievements: [
      'Developed APIs in Node.js for EdgeLINC data visualization, improving response time by 50%.',
      'Implemented Redis caching, reducing redundant API calls and boosting data retrieval speed by 40%.',
      'Enhanced UI with dynamic charts and real-time analytics, increasing visualization speed by 30%.',
    ],
  },
  {
    role: 'Web Development Intern',
    company: 'Xenovex Technologies',
    location: 'Chennai, India',
    duration: 'may 2019 – jun 2019',
    achievements: [
      'Managed the front-end of the EazyPM app using HTML, CSS, JavaScript, and AngularJS.',
      'Replaced traditional client-server communication with REST APIs built in Node.js and MongoDB, reducing load time by 50%.',
    ],
  },
]

export default function ExperiencePage() {
  return (
    <ExperienceContainer>
      <Header>
        <Title>
          <span>~/experience</span>
          Where I&apos;ve worked
        </Title>
        <Description>
          From backend systems at scale to founding-engineer roles in AI due diligence and genomics.
        </Description>
      </Header>

      <Timeline>
        {experiences.map((exp, index) => (
          <ExperienceCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
          >
            <Role>
              {exp.role} <span>@ {exp.company}</span>
            </Role>
            <Meta>
              {exp.duration} · {exp.location}
            </Meta>
            <Achievements>
              {exp.achievements.map((achievement, i) => (
                <Achievement key={i}>{achievement}</Achievement>
              ))}
            </Achievements>
          </ExperienceCard>
        ))}
      </Timeline>
    </ExperienceContainer>
  )
}
