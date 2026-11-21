export interface Entry {
  id: number
  title: string
  excerpt: string
  content: string
  source: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface EntryCreate {
  title: string
  excerpt: string
  content?: string
  source?: string
  category: string
  tags?: string[]
}

export interface EntryUpdate {
  title?: string
  excerpt?: string
  content?: string
  source?: string
  category?: string
  tags?: string[]
}

export interface AskResponse {
  answer: string
  sources: number[]
}
