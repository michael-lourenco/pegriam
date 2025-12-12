'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { getStory } from '@/services/stories/getStory'
import { getChapters } from '@/services/chapters/getChapters'
import type { Story, Chapter } from '@/types/story'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingDefault } from '@/components/LoadingDefault'

export default function StoryPage() {
  const params = useParams()
  const storyId = params.storyId as string

  const [story, setStory] = useState<Story | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [storyData, chaptersData] = await Promise.all([
          getStory(dbFirestore, storyId),
          getChapters(dbFirestore, storyId, { includeContent: false }),
        ])

        setStory(storyData)
        setChapters(chaptersData)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    if (storyId) {
      fetchData()
    }
  }, [storyId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingDefault />
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">História não encontrada.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const freeChapters = chapters.filter(ch => ch.isFree)
  const paidChapters = chapters.filter(ch => !ch.isFree)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header da História */}
        <div className="mb-8">
          {story.coverImage && (
            <div className="mb-6">
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-primary mb-2">{story.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{story.author}</p>
          <p className="text-foreground mb-6">{story.description}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{story.metadata.totalChapters} capítulos</span>
            <span>•</span>
            <span>{story.metadata.estimatedReadTime} min de leitura</span>
          </div>
        </div>

        {/* Capítulos Gratuitos */}
        {freeChapters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Capítulos Gratuitos
            </h2>
            <div className="space-y-2">
              {freeChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/stories/${storyId}/chapter/${chapter.id}`}
                >
                  <Card className="hover:bg-accent transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-primary">
                            Capítulo {chapter.number}: {chapter.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {chapter.estimatedReadTime} min • {chapter.wordCount.toLocaleString()} palavras
                          </p>
                        </div>
                        <Button variant="ghost">Ler →</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Capítulos Pagos */}
        {paidChapters.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Continue a História
            </h2>
            <Card className="bg-card border-primary/20">
              <CardContent className="py-6">
                <p className="text-muted-foreground mb-4">
                  {paidChapters.length} capítulos restantes estão disponíveis no livro completo em PDF.
                </p>
                <Link href={`/stories/${storyId}/purchase`}>
                  <Button className="w-full">Comprar PDF Completo - R$ 29,90</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


