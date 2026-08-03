'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GetStoryUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter } from '@/domain/entities/Chapter';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { useStoryAccess } from '@/shared/hooks/useStoryAccess';
import { chapterRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PurchaseCard } from '@/presentation/components/purchase/PurchaseCard';
import { StoryHero } from '@/presentation/components/story/StoryHero';
import { StorySidebar } from '@/presentation/components/story/StorySidebar';
import { StoryChapterList } from '@/presentation/components/story/StoryChapterList';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { hasFullAccess, reason: accessReason, loading: accessLoading } = useStoryAccess(
    storyId,
    story?.pdfPrice ?? 0
  );

  useEffect(() => {
    async function loadStory() {
      try {
        setLoading(true);
        const storyRepository = new SupabaseStoryRepository();
        const chapterRepository = new SupabaseChapterRepository();

        const getStory = new GetStoryUseCase(storyRepository);
        const storyData = await getStory.execute(storyId as StoryId);

        if (!storyData) {
          setError('História não encontrada');
          return;
        }

        setStory(storyData);

        const chaptersList = await chapterRepository.findByStoryId(storyId as StoryId);
        setChapters(chaptersList);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar história');
      } finally {
        setLoading(false);
      }
    }

    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  const startHref = useMemo(() => {
    const firstAccessible = chapters.find((c) => c.isFree || hasFullAccess);
    if (!firstAccessible) return null;
    return chapterRoute(storyId, String(firstAccessible.id)) as string;
  }, [chapters, hasFullAccess, storyId]);

  if (loading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-[hsl(var(--navy-deep))]')}>
        <p className={cn('text-white/60')}>Carregando história...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-[hsl(var(--navy-deep))]')}>
        <div className={cn('text-center space-y-4')}>
          <p className={cn('text-destructive')}>{error || 'História não encontrada'}</p>
          <Button onClick={() => router.push('/stories')}>Voltar para Histórias</Button>
        </div>
      </div>
    );
  }

  const hasPaidContent = story.pdfPrice > 0;
  const showAccessCard = hasPaidContent || hasFullAccess;

  return (
    <div className={cn('min-h-screen bg-[hsl(var(--navy-deep))]')}>
      <div className={cn('container mx-auto px-4 py-8')}>
        <Link
          href="/stories"
          className={cn(
            'inline-flex items-center gap-2 text-sm text-gold/90',
            'hover:text-gold transition-colors mb-8'
          )}
        >
          <span aria-hidden>&larr;</span>
          Voltar para Histórias
        </Link>

        <div
          className={cn(
            'grid grid-cols-1 gap-10',
            'lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12'
          )}
        >
          <div className={cn('space-y-8 min-w-0')}>
            <StoryHero story={story} startHref={startHref} />

            {showAccessCard && !accessLoading && (
              <PurchaseCard
                story={story}
                hasAccess={hasFullAccess}
                accessReason={accessReason}
                isAuthenticated={!!user}
              />
            )}

            <StoryChapterList
              storyId={storyId}
              chapters={chapters}
              hasFullAccess={hasFullAccess}
              storyDescription={story.description}
            />
          </div>

          <StorySidebar
            description={story.description}
            tags={story.tags}
            className={cn('lg:sticky lg:top-24 self-start')}
          />
        </div>
      </div>
    </div>
  );
}
