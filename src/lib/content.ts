import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from './mdx'

const projectFiles = [
  'ai-stock-prediction.md',
  'xv6-system-call-tracer.md',
  'deal-or-no-deal.md',
  'ai-cancer-diagnosis.md',
  'medical-ner.md',
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