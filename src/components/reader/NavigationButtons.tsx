'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Chapter } from '@/types/story'

interface NavigationButtonsProps {
  previousChapter?: Chapter
  nextChapter?: Chapter
  storyId: string
}

export function NavigationButtons({
  previousChapter,
  nextChapter,
  storyId,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center gap-4 p-6 border-t border-border bg-card">
      <div className="max-w-4xl mx-auto w-full flex justify-between">
        {/* Capítulo Anterior */}
        {previousChapter ? (
          <Link href={`/stories/${storyId}/chapter/${previousChapter.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Anterior</span>
                <span className="text-sm">{previousChapter.title}</span>
              </div>
            </Button>
          </Link>
        ) : (
          <div></div>
        )}

        {/* Capítulo Próximo */}
        {nextChapter ? (
          <Link href={`/stories/${storyId}/chapter/${nextChapter.id}`}>
            <Button variant="outline" className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-xs text-muted-foreground">Próximo</span>
                <span className="text-sm">{nextChapter.title}</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
}


