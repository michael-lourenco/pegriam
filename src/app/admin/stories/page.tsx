'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { GetAllStoriesUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { Story } from '@/domain/entities/Story';
import { adminStoryRoute, storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminStoriesPage() {
  const { isAdmin } = useRequireAdmin();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    async function loadStories() {
      try {
        const storyRepository = new SupabaseStoryRepository();
        const getAllStories = new GetAllStoriesUseCase(storyRepository);
        const allStories = await getAllStories.executeForAdmin();
        setStories(allStories);
      } catch (error) {
        console.error('Erro ao carregar histórias:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStories();
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando histórias...</p>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8")}>
        <div className={cn("flex items-center justify-between mb-8")}>
          <div>
            <h1 className={cn("text-4xl font-bold text-foreground mb-2")}>
              Gerenciar Histórias
            </h1>
            <p className={cn("text-muted-foreground")}>
              Crie, edite e gerencie suas histórias
            </p>
          </div>
          <Link href="/admin/stories/new">
            <Button>Nova História</Button>
          </Link>
        </div>

        {stories.length === 0 ? (
          <Card>
            <CardContent className={cn("py-12 text-center")}>
              <p className={cn("text-muted-foreground mb-4")}>
                Nenhuma história cadastrada ainda.
              </p>
              <Link href="/admin/stories/new">
                <Button>Criar Primeira História</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className={cn("space-y-4")}>
            {stories.map((story) => (
              <Card key={story.id} className={cn("hover:shadow-md transition-shadow")}>
                <CardContent className={cn("p-6")}>
                  <div className={cn("flex items-start justify-between")}>
                    <div className={cn("flex-1")}>
                      <div className={cn("flex items-center gap-3 mb-2")}>
                        <Link href={adminStoryRoute(String(story.id)) as any}>
                          <h3 className={cn("text-xl font-semibold text-foreground hover:text-primary")}>
                            {story.title}
                          </h3>
                        </Link>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            story.status === 'publishing' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                            story.status === 'draft' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                            story.status === 'completed' && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          )}
                        >
                          {story.status === 'publishing' && 'Publicada'}
                          {story.status === 'draft' && 'Rascunho'}
                          {story.status === 'completed' && 'Completa'}
                        </span>
                      </div>
                      <p className={cn("text-muted-foreground mb-3")}>
                        {story.description}
                      </p>
                      <div className={cn("flex flex-wrap items-center gap-4 text-sm text-muted-foreground")}>
                        <span>Autor: {story.author}</span>
                        <span>{story.metadata.totalChapters} capítulos</span>
                        <span>{story.freeChapters} gratuitos</span>
                        <span>{story.metadata.estimatedReadTime} min</span>
                        <span>Criada: {new Date(story.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {story.tags.length > 0 && (
                        <div className={cn("flex flex-wrap gap-2 mt-3")}>
                          {story.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cn("text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground")}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className={cn("flex flex-col gap-2 ml-4")}>
                      <Link href={adminStoryRoute(String(story.id)) as any}>
                        <Button variant="outline" size="sm">Editar</Button>
                      </Link>
                      <Link href={storyRoute(String(story.id)) as any}>
                        <Button variant="ghost" size="sm">Visualizar</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

