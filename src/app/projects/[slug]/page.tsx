import { getContentByType } from '@/lib/content'
import { notFound } from 'next/navigation'
import ProjectDetailClient from './project-detail-client'

export const dynamicParams = true

export async function generateStaticParams() {
  const projects = getContentByType('projects')
  console.log('Generated static params:', projects.map(p => ({ slug: p.slug })))
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  console.log('Project page params:', params)
  const projects = getContentByType('projects')
  console.log('All projects:', projects.map(p => p.slug))
  const project = projects.find(p => p.slug === params.slug)
  console.log('Found project:', project?.title || 'NOT FOUND')
  
  if (!project) {
    console.log('Project not found for slug:', params.slug)
    notFound()
  }

  return <ProjectDetailClient project={project} />
}