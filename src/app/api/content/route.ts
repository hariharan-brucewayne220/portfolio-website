import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ContentType = 'blog' | 'projects' | 'experience'

export interface ContentItem {
  title: string
  description: string
  date: string
  image?: string
  institution?: string
  tags: string[]
  slug: string
  content: string
}

async function getContentByType(type: ContentType): Promise<ContentItem[]> {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') as ContentType

  if (!type) {
    return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 })
  }

  try {
    const content = await getContentByType(type)
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
} 