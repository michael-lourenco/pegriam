'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { GetAllStoriesUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { Story } from '@/domain/entities/Story';
import { adminStoryRoute, storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useRequireAdmin();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    totalChapters: 0,
  });

  useEffect(() => {
    if (!isAdmin) return;

    async function loadData() {
      try {
        const storyRepository = new SupabaseStoryRepository();
        const chapterRepository = new SupabaseChapterRepository();
        const getAllStories = new GetAllStoriesUseCase(storyRepository);

        const allStories = await getAllStories.executeForAdmin();
        setStories(allStories);

        // Calcular estatísticas
        const published = allStories.filter(s => s.status === 'publishing').length;
        const drafts = allStories.filter(s => s.status === 'draft').length;
        
        let totalChapters = 0;
        for (const story of allStories) {
          const count = await chapterRepository.countByStoryId(story.id);
          totalChapters += count;
        }

        setStats({
          totalStories: allStories.length,
          publishedStories: published,
          draftStories: drafts,
          totalChapters,
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isAdmin]);

  if (!isAdmin) {
    return null; // Será redirecionado automaticamente
  }

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8")}>
        <div className={cn("mb-8")}>
          <h1 className={cn("text-4xl font-bold text-foreground mb-2")}>
            Painel Administrativo
          </h1>
          <p className={cn("text-muted-foreground")}>
            Gerencie histórias, capítulos e conteúdo
          </p>
        </div>

        {/* Estatísticas */}
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4 mb-8")}>
          <Card>
            <CardHeader className={cn("pb-2")}>
              <CardDescription>Total de Histórias</CardDescription>
              <CardTitle className={cn("text-3xl")}>{stats.totalStories}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className={cn("pb-2")}>
              <CardDescription>Publicadas</CardDescription>
              <CardTitle className={cn("text-3xl text-green-600")}>
                {stats.publishedStories}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className={cn("pb-2")}>
              <CardDescription>Rascunhos</CardDescription>
              <CardTitle className={cn("text-3xl text-yellow-600")}>
                {stats.draftStories}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className={cn("pb-2")}>
              <CardDescription>Total de Capítulos</CardDescription>
              <CardTitle className={cn("text-3xl")}>{stats.totalChapters}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className={cn("mb-8")}>
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("flex flex-wrap gap-4")}>
                <Link href="/admin/stories/new">
                  <Button>Nova História</Button>
                </Link>
                <Link href="/admin/stories">
                  <Button variant="outline">Gerenciar Histórias</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Histórias Recentes */}
        <div>
          <h2 className={cn("text-2xl font-bold text-foreground mb-4")}>
            Histórias Recentes
          </h2>
          
          {stories.length === 0 ? (
            <Card>
              <CardContent className={cn("py-8 text-center")}>
                <p className={cn("text-muted-foreground")}>
                  Nenhuma história cadastrada ainda.
                </p>
                <Link href="/admin/stories/new">
                  <Button className={cn("mt-4")}>Criar Primeira História</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className={cn("space-y-4")}>
              {stories.slice(0, 5).map((story) => (
                <Card key={story.id} className={cn("hover:shadow-md transition-shadow")}>
                  <CardContent className={cn("p-4")}>
                    <div className={cn("flex items-center justify-between")}>
                      <div className={cn("flex-1")}>
                        <Link href={adminStoryRoute(String(story.id)) as any}>
                          <h3 className={cn("font-semibold text-foreground hover:text-primary")}>
                            {story.title}
                          </h3>
                        </Link>
                        <p className={cn("text-sm text-muted-foreground mt-1")}>
                          {story.description}
                        </p>
                        <div className={cn("flex items-center gap-4 mt-2 text-xs text-muted-foreground")}>
                          <span>Status: {story.status}</span>
                          <span>{story.metadata.totalChapters} capítulos</span>
                          <span>Criada em {new Date(story.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className={cn("flex gap-2")}>
                        <Link href={adminStoryRoute(String(story.id)) as any}>
                          <Button variant="outline" size="sm">Editar</Button>
                        </Link>
                        <Link href={storyRoute(String(story.id)) as any}>
                          <Button variant="ghost" size="sm">Ver</Button>
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
    </div>
  );
}

