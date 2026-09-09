import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from './mdx'

// Kept deliberately short: a handful of projects that each show something the
// CEART and Zenoti roles do not, rather than everything ever built. Cut entries
// are recoverable from git history.
const projectFiles = [
  'rv-tsfm-bench.md',
  'github-ecosystem-analytics.md',
  'sentinel-agent.md',
  'city-witness.md',
  'macrodash.md',
  'multimodal-gaming-controller.md',
]

export function getContentByType(type: 'blog' | 'projects' | 'experience'): ContentItem[] {
  if (type === 'projects') {
    const contentDirectory = path.join(process.cwd(), 'src/content/projects')
    return projectFiles
      .map((file) => {
        const filePath = path.join(contentDirectory, file)
        const fileContent = fs.readFileSync(filePath, 'utf8')
        const { data, content } = matter(fileContent)
        const slug = file.replace(/\.mdx?$/, '')

        return {
          ...data,
          slug,
          content,
        } as ContentItem
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Fallback to filesystem for other types (only used in development)
  const contentDirectory = path.join(process.cwd(), 'src/content', type)
  const files = fs.readdirSync(contentDirectory)

  return files
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(contentDirectory, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContent)
      const slug = file.replace(/\.mdx?$/, '')

      return {
        ...data,
        slug,
        content,
      } as ContentItem
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
} 