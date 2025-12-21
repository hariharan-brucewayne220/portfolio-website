import { getContentByType } from '@/lib/content'
import { notFound } from 'next/navigation'
import ProjectDetailClient from './project-detail-client'

export const dynamicParams = true

export async function generateStaticParams() {
  const projects = getContentByType('projects')
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const projects = getContentByType('projects')
  const project = projects.find(p => p.slug === params.slug)
  
  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}