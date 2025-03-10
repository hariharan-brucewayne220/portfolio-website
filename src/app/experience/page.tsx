'use client'

import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

const ExperienceContainer = styled.div`
  min-height: 100vh;
  padding: 8rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  margin-bottom: 4rem;
`

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--foreground), var(--primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Description = styled.p`
  color: var(--muted);
  font-size: 1.2rem;
  max-width: 800px;
  line-height: 1.6;
`

const ExperienceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--primary);
  }
`

const Role = styled.h2`
  font-size: 1.5rem;
  color: var(--foreground);
  margin-bottom: 0.5rem;
`

const CompanyInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Company = styled.h3`
  font-size: 1.2rem;
  color: var(--primary);
  font-weight: 500;
`

const Duration = styled.span`
  color: var(--muted);
  font-size: 0.9rem;
`

const Location = styled.span`
  color: var(--muted);
  font-size: 0.9rem;
  margin-left: 1rem;
`

const Achievements = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const Achievement = styled.li`
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;

  &:before {
    content: '•';
    color: var(--primary);
    position: absolute;
    left: 0;
  }
`

const experiences = [
  {
    role: 'Software Engineer',
    company: 'Zenoti',
    location: 'Hyderabad, India',
    duration: 'Jul. 2021 - Jul. 2024',
    achievements: [
      'Revamped RESTful APIs and microservices in .NET and Node.js, optimizing payroll processing by 75% and improving accuracy by 35%.',
      'Automated API security testing, reducing manual testing time by 60% and increasing system robustness.',
      'Enhanced Employee module functionalities, decreasing bug reports by 25% and improving user satisfaction.',
      'Designed and integrated webhooks for Employee CRUD APIs, enabling bulk operations and reducing workflow execution time by 50%.',
      'Built a real-time analytics pipeline using Kafka and Spark, cutting query processing time by 40%'
    ]
  },
  {
    role: 'Full Stack Development Intern',
    company: 'Wabtec (Formerly GE Transportation)',
    location: 'Bangalore, India',
    duration: 'Feb. 2021 - Jun. 2021',
    achievements: [
      'Developed APIs in Node.js for EdgeLINC data visualization, improving response time by 50%.',
      'Implemented Redis caching, reducing redundant API calls and boosting data retrieval speed by 40%.',
      'Enhanced UI with dynamic charts and real-time analytics, increasing visualization speed by 30%.'
    ]
  },
  {
    role: 'Web Development Intern',
    company: 'Xenovex Technologies',
    location: 'Chennai, India',
    duration: 'May 2019 - Jun. 2019',
    achievements: [
      'Managed the front-end of the EazyPM app using HTML, CSS, JavaScript, and AngularJs.',
      'Replaced traditional client-server communication methods with REST APIs built in Node.js and MongoDB, improving data handling and reducing load time by 50%.'
    ]
  }
]

export default function ExperiencePage() {
  return (
    <ExperienceContainer>
      <Header>
        <Title>Experience</Title>
        <Description>
          My professional journey and contributions in software development and engineering.
        </Description>
      </Header>

      {experiences.map((exp, index) => (
        <ExperienceCard
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Role>{exp.role}</Role>
          <CompanyInfo>
            <Company>{exp.company}</Company>
            <div>
              <Duration>{exp.duration}</Duration>
              <Location>{exp.location}</Location>
            </div>
          </CompanyInfo>
          <Achievements>
            {exp.achievements.map((achievement, i) => (
              <Achievement key={i}>{achievement}</Achievement>
            ))}
          </Achievements>
        </ExperienceCard>
      ))}
    </ExperienceContainer>
  )
} 