import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentItem } from './mdx'

export function getContentByType(type: 'blog' | 'projects' | 'experience'): ContentItem[] {
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