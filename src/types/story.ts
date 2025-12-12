export interface Story {
  id: string
  title: string
  description: string
  author: string
  coverImage?: string
  publishedAt: Date
  status: 'draft' | 'publishing' | 'completed'
  freeChapters: number // Quantos primeiros capítulos são gratuitos
  pdfPrice: number // Preço em centavos (2990 = R$ 29,90)
  pdfUrl?: string // URL do PDF no S3
  tags: string[]
  metadata: {
    totalChapters: number
    estimatedReadTime: number // em minutos
  }
}

export interface Chapter {
  id: string
  storyId: string
  number: number
  title: string
  content: string // Markdown ou HTML processado
  publishedAt: Date
  isFree: boolean
  estimatedReadTime: number // em minutos
  wordCount: number
  order: number
}

export interface StoryWithChapters extends Story {
  chapters: Chapter[]
}


