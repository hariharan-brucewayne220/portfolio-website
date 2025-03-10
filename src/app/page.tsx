'use client'

import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const Container = styled.div`
  min-height: 100vh;
  padding: 8rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

const ContentSection = styled.div`
  flex: 1;
`

const ImageSection = styled.div`
  flex: 0 0 400px;
  position: sticky;
  top: 8rem;

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
`

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 2rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Paragraph = styled.p`
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`

const ProfileImage = styled.div`
  width: 100%;
  height: 500px;
  background-image: url('/profile.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const LinkText = styled.a`
  color: var(--primary);
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`

const LinksContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  color: var(--muted);

  a {
    color: var(--primary);
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`

export default function HomePage() {
  return (
    <Container>
      <ContentSection>
        <Title>Hariharan</Title>
        <Paragraph>
          As a computer science student and a full stack developer with over 3 years of work experience, 
          I have honed my expertise in building scalable and efficient software solutions. My skill set 
          includes proficiency in .NET, SQL, JavaScript, React, MongoDB, and Node.js.
        </Paragraph>
        <Paragraph>
          As a Graduate student I am excited to deepen my understanding of emerging technologies, 
          including cloud computing and artificial intelligence, while further refining my development skills. 
          I'm driven by the challenge of building next-generation software solutions that integrate both 
          traditional development practices and cutting-edge AI capabilities.
        </Paragraph>
        <LinksContainer>
          <Link href="/cv.pdf">CV</Link>
          <span>/</span>
          <Link href="https://scholar.google.com">Google Scholar</Link>
          <span>/</span>
          <Link href="mailto:your.email@example.com">Email</Link>
          <span>/</span>
          <Link href="https://github.com/hariharan-brucewayne220">Github</Link>
          <span>/</span>
          <Link href="https://www.linkedin.com/in/hariharan-logan/">LinkedIn</Link>
        </LinksContainer>
      </ContentSection>
      <ImageSection>
        <ProfileImage />
      </ImageSection>
    </Container>
  )
} 