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

export interface ContentType {
  projects: ContentItem[]
} 