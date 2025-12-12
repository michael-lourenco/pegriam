'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { getChapter } from '@/services/chapters/getChapter'
import { getChapters } from '@/services/chapters/getChapters'
import type { Chapter } from '@/types/story'
import { ChapterReader } from '@/components/reader/ChapterReader'
import { NavigationButtons } from '@/components/reader/NavigationButtons'
import { ReaderControls } from '@/components/reader/ReaderControls'
import { ProgressBar } from '@/components/reader/ProgressBar'
import { LoadingDefault } from '@/components/LoadingDefault'

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const storyId = params.storyId as string
  const chapterId = params.chapterId as string

  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [allChapters, setAllChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const [chapterData, chaptersData] = await Promise.all([
          getChapter(dbFirestore, chapterId),
          getChapters(dbFirestore, storyId, { includeContent: false }),
        ])

        if (!chapterData) {
          router.push(`/stories/${storyId}`)
          return
        }

        setChapter(chapterData)
        setAllChapters(chaptersData)
      } catch (error) {
        console.error('Erro ao buscar capítulo:', error)
      } finally {
        setLoading(false)
      }
    }

    if (storyId && chapterId) {
      fetchData()
    }
  }, [storyId, chapterId, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingDefault />
      </div>
    )
  }

  if (!chapter) {
    return null
  }

  // Encontrar capítulos anterior e próximo
  const currentIndex = allChapters.findIndex(ch => ch.id === chapterId)
  const previousChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : undefined
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : undefined

  return (
    <div className="relative">
      <ProgressBar progress={scrollProgress} />
      
      <ChapterReader
        chapter={chapter}
        onScroll={setScrollProgress}
      />
      
      <NavigationButtons
        previousChapter={previousChapter}
        nextChapter={nextChapter}
        storyId={storyId}
      />

      <ReaderControls />
    </div>
  )
}

