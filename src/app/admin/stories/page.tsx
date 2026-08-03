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
import { AdminLoadingState, AdminPageHeader, AdminShell } from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminGhostBtn,
  adminListItem,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
  adminStatusPill,
} from '@/presentation/components/admin/adminUi';

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

  if (!isAdmin) return null;

  if (loading) {
    return <AdminLoadingState message="Carregando histórias..." />;
  }

  return (
    <AdminShell>
      <AdminPageHeader
        backHref="/admin"
        backLabel="Painel Admin"
        title="Gerenciar Histórias"
        description="Crie, edite e gerencie suas histórias"
        actions={
          <Link href="/admin/stories/new">
            <Button className={cn(adminPrimaryBtn)}>Nova História</Button>
          </Link>
        }
      />

      {stories.length === 0 ? (
        <Card className={cn(adminCard)}>
          <CardContent className={cn('py-12 text-center')}>
            <p className={cn(adminMuted, 'mb-4')}>Nenhuma história cadastrada ainda.</p>
            <Link href="/admin/stories/new">
              <Button className={cn(adminPrimaryBtn)}>Criar Primeira História</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className={cn('space-y-3')}>
          {stories.map((story) => (
            <div key={story.id} className={cn(adminListItem, 'p-5')}>
              <div className={cn('flex items-start justify-between gap-4')}>
                <div className={cn('flex-1 min-w-0')}>
                  <div className={cn('flex flex-wrap items-center gap-3 mb-2')}>
                    <Link href={adminStoryRoute(String(story.id)) as string}>
                      <h3
                        className={cn(
                          'font-display text-xl font-semibold text-[hsl(var(--parchment))]',
                          'hover:text-gold transition-colors'
                        )}
                      >
                        {story.title}
                      </h3>
                    </Link>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        adminStatusPill(story.status)
                      )}
                    >
                      {story.status === 'publishing' && 'Publicada'}
                      {story.status === 'draft' && 'Rascunho'}
                      {story.status === 'completed' && 'Completa'}
                    </span>
                  </div>
                  <p className={cn('text-white/55 mb-3 line-clamp-2')}>{story.description}</p>
                  <div className={cn('flex flex-wrap items-center gap-4 text-sm text-white/45')}>
                    <span>Autor: {story.author}</span>
                    <span>{story.metadata.totalChapters} capítulos</span>
                    <span>{story.freeChapters} gratuitos</span>
                    <span>{story.metadata.estimatedReadTime} min</span>
                    <span>
                      Criada: {new Date(story.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {story.tags.length > 0 && (
                    <div className={cn('flex flex-wrap gap-2 mt-3')}>
                      {story.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            'border border-gold/25 bg-gold/10 text-gold/90'
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={cn('flex flex-col gap-2 flex-shrink-0')}>
                  <Link href={adminStoryRoute(String(story.id)) as string}>
                    <Button variant="outline" size="sm" className={cn(adminOutlineBtn, 'w-full')}>
                      Editar
                    </Button>
                  </Link>
                  <Link href={storyRoute(String(story.id)) as string}>
                    <Button variant="ghost" size="sm" className={cn(adminGhostBtn, 'w-full')}>
                      Visualizar
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
