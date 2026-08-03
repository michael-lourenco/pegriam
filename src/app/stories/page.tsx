'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { GetAllStoriesUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { Story } from '@/domain/entities/Story';
import { Permission } from '@/domain/value-objects/Permission';
import { storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';

export default function StoriesPage() {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStories() {
      try {
        setLoading(true);
        const storyRepository = new SupabaseStoryRepository();
        const getAllStories = new GetAllStoriesUseCase(storyRepository);

        let storiesList: Story[];
        if (user && Permission.isAdmin(user)) {
          storiesList = await getAllStories.executeForAdmin();
        } else {
          storiesList = await getAllStories.execute();
        }

        setStories(storiesList);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar histórias');
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, [user]);

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando histórias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <div className={cn("text-center space-y-4")}>
          <p className={cn("text-destructive")}>{error}</p>
          <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8")}>
        <div className={cn("mb-8")}>
          <h1 className={cn("text-4xl font-bold text-foreground mb-2")}>
            Contos de Pegriam
          </h1>
          <p className={cn("text-muted-foreground")}>
            Explore as histórias do Bardo Multiversal
          </p>
        </div>

        {stories.length === 0 ? (
          <div className={cn("text-center py-12")}>
            <p className={cn("text-muted-foreground text-lg")}>
              Nenhuma história encontrada
            </p>
          </div>
        ) : (
          <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6")}>
            {stories.map((story) => (
              <Link key={story.id} href={storyRoute(String(story.id)) as any}>
                <Card className={cn("h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden")}>
                  <FeaturedCover
                    src={story.coverImage}
                    alt={story.title}
                    className={cn("rounded-t-lg")}
                  />
                  <CardHeader>
                    <CardTitle className={cn("line-clamp-2")}>{story.title}</CardTitle>
                    <CardDescription className={cn("line-clamp-2")}>
                      {story.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={cn("flex flex-wrap gap-2 mb-4")}>
                      {story.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className={cn("text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground")}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className={cn("flex items-center justify-between text-sm text-muted-foreground")}>
                      <span>{story.metadata.totalChapters} capítulos</span>
                      <span>{story.metadata.estimatedReadTime} min</span>
                    </div>
                    {story.status === 'draft' && (
                      <div className={cn("mt-2 text-xs text-muted-foreground")}>
                        Rascunho
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

