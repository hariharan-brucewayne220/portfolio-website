import { getContentByType } from '@/lib/content'
import ProjectsClient from './projects-client'

export const dynamic = 'force-static'

export default function ProjectsPage() {
  const projects = getContentByType('projects')
  return <ProjectsClient projects={projects} />
} 