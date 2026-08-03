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
import { AdminLoadingState, AdminPageHeader, AdminShell } from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminListItem,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
  adminStatusPill,
} from '@/presentation/components/admin/adminUi';

export default function AdminDashboardPage() {
  const { isAdmin, loading: authLoading } = useRequireAdmin();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStories: 0,
    publishedStories: 0,
    draftStories: 0,
    totalChapters: 0,
  });

  useEffect(() => {
    if (authLoading || !isAdmin) return;

    async function loadData() {
      try {
        const storyRepository = new SupabaseStoryRepository();
        const chapterRepository = new SupabaseChapterRepository();
        const getAllStories = new GetAllStoriesUseCase(storyRepository);

        const allStories = await getAllStories.executeForAdmin();
        setStories(allStories);

        const published = allStories.filter((s) => s.status === 'publishing').length;
        const drafts = allStories.filter((s) => s.status === 'draft').length;

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
  }, [isAdmin, authLoading]);

  if (authLoading) {
    return <AdminLoadingState message="Verificando autenticação..." />;
  }

  if (!isAdmin) return null;

  if (loading) {
    return <AdminLoadingState message="Carregando dashboard..." />;
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Painel Administrativo"
        description="Gerencie histórias, capítulos e conteúdo"
      />

      <div className={cn('grid grid-cols-1 md:grid-cols-4 gap-4 mb-8')}>
        <StatCard label="Total de Histórias" value={stats.totalStories} />
        <StatCard
          label="Publicadas"
          value={stats.publishedStories}
          valueClassName="text-emerald-300"
        />
        <StatCard
          label="Rascunhos"
          value={stats.draftStories}
          valueClassName="text-amber-200"
        />
        <StatCard label="Total de Capítulos" value={stats.totalChapters} />
      </div>

      <Card className={cn(adminCard, 'mb-8')}>
        <CardHeader>
          <CardTitle className={cn('font-display text-gold')}>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn('flex flex-wrap gap-3')}>
            <Link href="/admin/stories/new">
              <Button className={cn(adminPrimaryBtn)}>Nova História</Button>
            </Link>
            <Link href="/admin/stories">
              <Button variant="outline" className={cn(adminOutlineBtn)}>
                Gerenciar Histórias
              </Button>
            </Link>
            <Link href="/admin/glossario">
              <Button variant="outline" className={cn(adminOutlineBtn)}>
                Gerenciar Glossário
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <h2 className={cn('font-display text-2xl font-bold text-[hsl(var(--parchment))] mb-4')}>
        Histórias Recentes
      </h2>

      {stories.length === 0 ? (
        <Card className={cn(adminCard)}>
          <CardContent className={cn('py-8 text-center')}>
            <p className={cn(adminMuted)}>Nenhuma história cadastrada ainda.</p>
            <Link href="/admin/stories/new">
              <Button className={cn(adminPrimaryBtn, 'mt-4')}>Criar Primeira História</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className={cn('space-y-3')}>
          {stories.slice(0, 5).map((story) => (
            <div key={story.id} className={cn(adminListItem)}>
              <div className={cn('flex items-center justify-between gap-4')}>
                <div className={cn('flex-1 min-w-0')}>
                  <Link href={adminStoryRoute(String(story.id)) as string}>
                    <h3
                      className={cn(
                        'font-display font-semibold text-[hsl(var(--parchment))]',
                        'hover:text-gold transition-colors'
                      )}
                    >
                      {story.title}
                    </h3>
                  </Link>
                  <p className={cn('text-sm text-white/55 mt-1 line-clamp-2')}>
                    {story.description}
                  </p>
                  <div className={cn('flex flex-wrap items-center gap-3 mt-2 text-xs text-white/45')}>
                    <span className={cn('px-2 py-0.5 rounded-full', adminStatusPill(story.status))}>
                      {story.status}
                    </span>
                    <span>{story.metadata.totalChapters} capítulos</span>
                    <span>
                      Criada em {new Date(story.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className={cn('flex gap-2 flex-shrink-0')}>
                  <Link href={adminStoryRoute(String(story.id)) as string}>
                    <Button variant="outline" size="sm" className={cn(adminOutlineBtn)}>
                      Editar
                    </Button>
                  </Link>
                  <Link href={storyRoute(String(story.id)) as string}>
                    <Button variant="ghost" size="sm" className={cn('text-white/60 hover:text-gold')}>
                      Ver
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

function StatCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <Card className={cn(adminCard)}>
      <CardHeader className={cn('pb-2')}>
        <CardDescription className={cn(adminMuted)}>{label}</CardDescription>
        <CardTitle
          className={cn(
            'font-display text-3xl text-[hsl(var(--parchment))]',
            valueClassName
          )}
        >
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
