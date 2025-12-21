export interface ContentItem {
  title: string
  description: string
  date: string
  image?: string
  institution?: string
  tags: string[]
  slug: string
  content: string
  youtube?: string
  github?: string
  liveUrl?: string
  featured?: boolean
}

export interface ContentType {
  projects: ContentItem[]
} 