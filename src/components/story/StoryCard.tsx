'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Story } from '@/types/story'

interface StoryCardProps {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
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
        <CardTitle className="text-2xl line-clamp-2">{story.title}</CardTitle>
        <CardDescription>{story.author}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
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
  )
}


