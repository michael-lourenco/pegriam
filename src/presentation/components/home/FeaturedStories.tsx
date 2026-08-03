/**
 * Componente: FeaturedStories
 *
 * Histórias em destaque na home — fundo pergaminho, cards escuros, capas 16:9.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetAllStoriesUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { Story } from '@/domain/entities/Story';
import { storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';

const MAX_FEATURED_STORIES = 4;
const MAX_VISIBLE_TAGS = 3;

function StoriesLoadingSkeleton() {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5')}>
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className={cn('animate-pulse overflow-hidden rounded-lg bg-[hsl(var(--navy))]')}
        >
          <div className={cn('w-full aspect-video bg-white/10')} />
          <div className={cn('p-4 space-y-3')}>
            <div className={cn('h-5 bg-white/10 rounded w-3/4')} />
            <div className={cn('h-4 bg-white/10 rounded w-full')} />
            <div className={cn('h-3 bg-white/10 rounded w-1/2')} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={storyRoute(String(story.id)) as string} className={cn('group block h-full')}>
      <article
        className={cn(
          'h-full overflow-hidden rounded-lg',
          'bg-[hsl(var(--navy))] border border-white/10',
          'transition-transform duration-300 group-hover:-translate-y-1',
          'shadow-md shadow-black/20'
        )}
      >
        <FeaturedCover
          src={story.coverImage}
          alt={story.title}
          className={cn('rounded-none rounded-t-lg')}
        />
        <div className={cn('p-4 space-y-3')}>
          <h3
            className={cn(
              'font-display text-lg font-bold line-clamp-2',
              'text-[hsl(var(--parchment))] group-hover:text-gold transition-colors'
            )}
          >
            {story.title}
          </h3>
          <p className={cn('text-sm text-white/60 line-clamp-2 leading-relaxed')}>
            {story.description}
          </p>
          <div className={cn('flex flex-wrap gap-1.5')}>
            {story.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
              <span
                key={tag}
                className={cn(
                  'text-[11px] px-2 py-0.5 rounded-full',
                  'bg-white/8 text-gold/90 border border-gold/20'
                )}
              >
                #{tag}
              </span>
            ))}
          </div>
          <div
            className={cn(
              'flex items-center justify-between pt-1',
              'text-xs text-white/45'
            )}
          >
            <span>{story.metadata.totalChapters} capítulos</span>
            <span>{story.metadata.estimatedReadTime} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function EmptyStoriesMessage() {
  return (
    <div className={cn('text-center py-12')}>
      <p className={cn('text-[hsl(var(--navy))]/70 text-lg font-display')}>
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
    <section className={cn('bg-parchment py-14 md:py-16')} aria-labelledby="featured-heading">
      <div className={cn('container mx-auto px-4 space-y-8')}>
        <div className={cn('flex items-end justify-between gap-4')}>
          <div>
            <p className={cn('text-sm uppercase tracking-[0.18em] text-[hsl(var(--navy))]/50 mb-2')}>
              Biblioteca
            </p>
            <h2
              id="featured-heading"
              className={cn(
                'font-display text-3xl md:text-4xl font-bold',
                'text-[hsl(var(--navy))]'
              )}
            >
              Histórias em Destaque
            </h2>
          </div>
          {stories.length > MAX_FEATURED_STORIES && (
            <Link href="/stories" className={cn('hidden sm:block')}>
              <Button
                variant="ghost"
                size="sm"
                className={cn('text-[hsl(var(--navy))] hover:text-gold hover:bg-[hsl(var(--navy))]/5')}
              >
                Ver todas &rarr;
              </Button>
            </Link>
          )}
        </div>

        {loading && <StoriesLoadingSkeleton />}
        {!loading && stories.length === 0 && <EmptyStoriesMessage />}
        {!loading && stories.length > 0 && (
          <>
            <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5')}>
              {stories.slice(0, MAX_FEATURED_STORIES).map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
            {stories.length > MAX_FEATURED_STORIES && (
              <div className={cn('text-center pt-2 sm:hidden')}>
                <Link href="/stories">
                  <Button
                    variant="outline"
                    className={cn('border-[hsl(var(--navy))]/30 text-[hsl(var(--navy))]')}
                  >
                    Ver Todas as Histórias
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
