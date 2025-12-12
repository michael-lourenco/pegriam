'use client'

import { useEffect, useState } from 'react'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { getStories } from '@/services/stories/getStories'
import type { Story } from '@/types/story'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingDefault } from '@/components/LoadingDefault'

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStories() {
      try {
        const data = await getStories(dbFirestore, { status: 'publishing' })
        setStories(data as Story[])
      } catch (error) {
        console.error('Erro ao buscar histórias:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingDefault />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Histórias de Pegriam
          </h1>
          <p className="text-muted-foreground">
            Explore as aventuras épicas narradas pelo bardo
          </p>
        </div>

        {stories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma história disponível no momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Card key={story.id} className="flex flex-col">
                {story.coverImage && (
                  <div className="aspect-[2/3] w-full overflow-hidden rounded-t-lg">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{story.title}</CardTitle>
                  <CardDescription>{story.author}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {story.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{story.metadata.totalChapters} capítulos</span>
                    <span>{story.metadata.estimatedReadTime} min</span>
                  </div>
                  <Link href={`/stories/${story.id}`}>
                    <Button className="w-full">Começar a Ler</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


