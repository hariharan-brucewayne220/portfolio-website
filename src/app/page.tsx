'use client'

import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Typewriter from './components/Typewriter'

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 7rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }

  .paragraph-style {
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    min-height: 6rem; /* Reserve space to prevent layout shift */
  }
`

const ContentSection = styled.div`
  flex: 1;
`

const ImageSection = styled(motion.div)`
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
  font-size: clamp(2.5rem, 8vw, 4rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  min-height: 4rem;
  
  @media (max-width: 768px) {
    text-align: center;
    min-height: auto;
  }
`

const Subtitle = styled.h2`
  font-size: clamp(1.2rem, 3.5vw, 1.5rem);
  color: #ffffff;
  font-weight: 500;
  margin-bottom: 2rem;
  min-height: 2rem;
  
  @media (max-width: 768px) {
    text-align: center;
    min-height: auto;
    margin-bottom: 1.5rem;
  }
`

const Section = styled(motion.div)`
  margin-bottom: 3rem;
`

const SectionTitle = styled.h3`
  font-size: clamp(1.1rem, 3vw, 1.25rem);
  color: var(--foreground);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.5rem;
  
  @media (max-width: 768px) {
    justify-content: center;
    min-height: auto;
  

  &::before {
    content: '';
    display: block;
    width: 1rem;
    height: 2px;
    background: var(--primary);
  }
`

const Paragraph = styled.p`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const ListItem = styled.li`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.5rem; /* Reserve space */

  &::before {
    content: '•';
    color: var(--primary);
  }
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

const LinksContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  color: var(--muted);
  flex-wrap: wrap;

  a {
    color: var(--primary);
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const aboutText1 = `As a computer science student and a full stack developer with over 3 years of work experience, I have honed my expertise in building scalable and efficient software solutions. My skill set includes proficiency in .NET, SQL, JavaScript, React, MongoDB, and Node.js.`;
  const aboutText2 = `As a Graduate student I am excited to deepen my understanding of emerging technologies, including cloud computing and artificial intelligence, while further refining my development skills. I'm driven by the challenge of building next-generation software solutions that integrate both traditional development practices and cutting-edge AI capabilities.`;
  const skills = ['JavaScript/TypeScript', 'React/Next.js', 'Node.js', '.NET Core', 'Python', 'SQL/MongoDB', 'Machine Learning', 'Cloud Computing'];

  return (
    <Container variants={containerVariants} initial="hidden" animate="visible">
      <ContentSection>
        <motion.div variants={itemVariants}>
          <Title><Typewriter text="Hariharan" wrapper="span" speed={30} /></Title>
          <Subtitle><Typewriter text="Full Stack Developer & AI Enthusiast" wrapper="span" speed={40} /></Subtitle>
        </motion.div>

        <Section id="about-section" variants={itemVariants}>
          <SectionTitle><Typewriter text="About" wrapper="span" speed={30} /></SectionTitle>
          <Typewriter text={aboutText1} speed={80} className="paragraph-style" />
          <Typewriter text={aboutText2} speed={80} className="paragraph-style" />
        </Section>

        <Section variants={itemVariants}>
          <SectionTitle><Typewriter text="Skills" wrapper="span" speed={30} /></SectionTitle>
          <List>
            {skills.map((skill) => (
              <ListItem key={skill}><Typewriter text={skill} wrapper="span" speed={50} /></ListItem>
            ))}
          </List>
        </Section>

        <Section variants={itemVariants}>
          <SectionTitle><Typewriter text="Education" wrapper="span" speed={30} /></SectionTitle>
          <Paragraph>
            <strong><Typewriter text="Master of Science in Computer Science" wrapper="span" speed={50} /></strong><br />
            <Typewriter text="New York University" wrapper="span" speed={50} /><br />
            <Typewriter text="2024 - Present" wrapper="span" speed={50} />
          </Paragraph>
          <Paragraph>
            <strong><Typewriter text="Bachelor of Technology in Information Technology" wrapper="span" speed={50} /></strong><br />
            <Typewriter text="Vellore Institute of Technology" wrapper="span" speed={50} /><br />
            <Typewriter text="2017 - 2021" wrapper="span" speed={50} showCursor={true} />
          </Paragraph>
        </Section>

        <LinksContainer variants={itemVariants}>
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
      <ImageSection variants={itemVariants}>
        <ProfileImage />
      </ImageSection>
    </Container>
  )
}
