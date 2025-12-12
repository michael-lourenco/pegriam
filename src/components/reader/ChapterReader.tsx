'use client'

import { useEffect, useRef } from 'react'
import { parseMarkdownToHTML } from '@/lib/markdown/parser'
import type { Chapter } from '@/types/story'

interface ChapterReaderProps {
  chapter: Chapter
  onScroll?: (progress: number) => void
}

export function ChapterReader({ chapter, onScroll }: ChapterReaderProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !onScroll) return

      const element = contentRef.current
      const scrollTop = element.scrollTop
      const scrollHeight = element.scrollHeight - element.clientHeight
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0

      onScroll(progress)
    }

    const element = contentRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
  }, [onScroll])

  const htmlContent = parseMarkdownToHTML(chapter.content)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header do Capítulo */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {chapter.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Capítulo {chapter.number}</span>
            <span>•</span>
            <span>{chapter.estimatedReadTime} min de leitura</span>
            <span>•</span>
            <span>{chapter.wordCount.toLocaleString()} palavras</span>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <article className="max-w-4xl mx-auto px-6 py-12">
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-primary
              prose-p:text-foreground prose-p:leading-relaxed prose-p:text-lg
              prose-strong:text-primary prose-strong:font-semibold
              prose-em:text-primary prose-em:italic
              prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
              prose-hr:border-border prose-hr:my-8
              prose-headings:mb-4 prose-headings:mt-8"
            style={{
              fontFamily: '"Georgia", "Times New Roman", serif',
              maxWidth: '65ch',
            }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </div>
  )
}

