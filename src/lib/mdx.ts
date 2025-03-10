import { compileMDX } from 'next-mdx-remote/rsc'
import path from 'path'
import fs from 'fs'

export interface ContentItem {
  title: string
  date: string
  institution?: string
  description: string
  image?: string
  tags: string[]
  slug: string
  content?: string
}

export async function getContentItems(directory: string): Promise<ContentItem[]> {
  const contentDir = path.join(process.cwd(), 'src/content', directory)
  const files = fs.readdirSync(contentDir)
  
  const items = await Promise.all(
    files
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async file => {
        const filePath = path.join(contentDir, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const slug = file.replace(/\.mdx?$/, '')
        
        // Extract frontmatter using regex
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
        const frontmatter = frontmatterMatch ? frontmatterMatch[1] : ''
        
        // Parse frontmatter
        const metadata: Partial<ContentItem> = {}
        frontmatter.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':')
          if (key && valueParts.length) {
            const value = valueParts.join(':').trim()
            if (key === 'tags') {
              metadata[key] = value.replace(/[\[\]']/g, '').split(',').map(tag => tag.trim())
            } else {
              metadata[key] = value
            }
          }
        })
        
        return {
          ...metadata,
          slug,
          content: content.replace(frontmatterMatch?.[0] ?? '', '').trim()
        } as ContentItem
      })
  )
  
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
} 