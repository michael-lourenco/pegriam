/**
 * Componente: FeaturedStories
 * 
 * Exibe as histórias publicadas em destaque na página inicial.
 * Responsável por carregar e apresentar as histórias com seus
 * covers, tags e metadados de forma atrativa.
 * 
 * Segue o princípio de responsabilidade única (SRP):
 * apenas busca e renderiza as histórias em destaque.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetAllStoriesUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { Story } from '@/domain/entities/Story';
import { storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCover } from '@/presentation/components/shared/BookCover';

const MAX_FEATURED_STORIES = 6;
const MAX_VISIBLE_TAGS = 3;

function StoriesLoadingSkeleton() {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")}>
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} className={cn("animate-pulse")}>
          <div className={cn("w-full h-48 bg-muted rounded-t-lg")} />
          <CardHeader>
            <div className={cn("h-6 bg-muted rounded w-3/4")} />
            <div className={cn("h-4 bg-muted rounded w-full mt-2")} />
          </CardHeader>
          <CardContent>
            <div className={cn("h-4 bg-muted rounded w-1/2")} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={storyRoute(String(story.id)) as string}>
      <Card className={cn("h-full hover:shadow-lg transition-shadow cursor-pointer")}>
        <div className={cn("w-full flex justify-center p-4 bg-muted rounded-t-lg")}>
          <BookCover
            src={story.coverImage}
            alt={story.title}
            size="lg"
            className={cn("shadow-md")}
          />
        </div>
        <CardHeader>
          <CardTitle className={cn("line-clamp-2 text-lg")}>{story.title}</CardTitle>
          <CardDescription className={cn("line-clamp-2")}>
            {story.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={cn("flex flex-wrap gap-2 mb-4")}>
            {story.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  "bg-secondary text-secondary-foreground"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className={cn("flex items-center justify-between text-sm text-muted-foreground")}>
            <span>{story.metadata.totalChapters} capítulos</span>
            <span>{story.metadata.estimatedReadTime} min de leitura</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyStoriesMessage() {
  return (
    <div className={cn("text-center py-12")}>
      <p className={cn("text-muted-foreground text-lg")}>
        Em breve, novas histórias serão publicadas.
      </p>
    </div>
  );
}

export function FeaturedStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublishedStories() {
      try {
        const storyRepository = new SupabaseStoryRepository();
        const getAllStories = new GetAllStoriesUseCase(storyRepository);
        const publishedStories = await getAllStories.execute();
        setStories(publishedStories);
      } catch (error) {
        console.error('Erro ao carregar histórias em destaque:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPublishedStories();
  }, []);

  return (
    <section className={cn("space-y-6")}>
      <div className={cn("flex items-center justify-between")}>
        <h2 className={cn("text-2xl font-bold text-foreground")}>
          Histórias em Destaque
        </h2>
        {stories.length > MAX_FEATURED_STORIES && (
          <Link href="/stories">
            <Button variant="ghost" size="sm">Ver todas &rarr;</Button>
          </Link>
        )}
      </div>

      {loading && <StoriesLoadingSkeleton />}

      {!loading && stories.length === 0 && <EmptyStoriesMessage />}

      {!loading && stories.length > 0 && (
        <>
          <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")}>
            {stories.slice(0, MAX_FEATURED_STORIES).map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {stories.length > MAX_FEATURED_STORIES && (
            <div className={cn("text-center pt-4")}>
              <Link href="/stories">
                <Button variant="outline" size="lg">Ver Todas as Histórias</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
