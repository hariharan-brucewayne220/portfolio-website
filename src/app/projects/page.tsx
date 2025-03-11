import { getContentByType } from '@/lib/content'
import ProjectsClient from './projects-client'

export default function ProjectsPage() {
  const projects = getContentByType('projects')
  return <ProjectsClient projects={projects} />
} 