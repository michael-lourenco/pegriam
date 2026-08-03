/**
 * Componente: HomeSecondary
 *
 * Três painéis: Quem é Pegriam, citação do Bardo e Último conto.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetAllStoriesUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { Story } from '@/domain/entities/Story';
import { storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';

const HERO_IMAGE = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

const BARDO_QUOTE =
  'Toda cidade guarda um segredo. Em Kontempler, os segredos pedem para ser cantados.';

export function HomeSecondary() {
  const [latestStory, setLatestStory] = useState<Story | null>(null);

  useEffect(() => {
    async function loadLatest() {
      try {
        const storyRepository = new SupabaseStoryRepository();
        const getAllStories = new GetAllStoriesUseCase(storyRepository);
        const stories = await getAllStories.execute();
        if (stories.length > 0) {
          const latest = [...stories].sort(
            (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
          )[0];
          setLatestStory(latest);
        }
      } catch (error) {
        console.error('Erro ao carregar último conto:', error);
      }
    }

    loadLatest();
  }, []);

  return (
    <section
      className={cn('bg-[hsl(var(--navy-deep))] py-14 md:py-16')}
      aria-label="Sobre Pegriam e último conto"
    >
      <div
        className={cn(
          'container mx-auto px-4',
          'grid grid-cols-1 md:grid-cols-3 gap-6'
        )}
      >
        {/* Quem é Pegriam */}
        <article
          className={cn(
            'overflow-hidden rounded-lg border border-white/10',
            'bg-navy flex flex-col'
          )}
        >
          <div className={cn('relative aspect-[4/5] overflow-hidden')}>
            <Image
              src={HERO_IMAGE}
              alt="Pegriam, o Bardo Multiversal"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={cn('object-cover object-[58%_20%]')}
            />
            <div
              className={cn(
                'absolute inset-0',
                'bg-gradient-to-t from-[hsl(var(--navy))] via-transparent to-transparent'
              )}
            />
          </div>
          <div className={cn('p-5 space-y-3 flex-1 flex flex-col')}>
            <h3 className={cn('font-display text-xl font-bold text-[hsl(var(--parchment))]')}>
              Quem é Pegriam?
            </h3>
            <p className={cn('text-sm text-white/60 leading-relaxed flex-1')}>
              O Bardo Multiversal atravessa reinos para reunir contos, mapas e memórias de Kontempler.
            </p>
            <Link href="/sobre" className={cn('pt-1')}>
              <Button
                size="sm"
                className={cn('bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90')}
              >
                Conhecer o Bardo
              </Button>
            </Link>
          </div>
        </article>

        {/* Palavras do Bardo */}
        <article
          className={cn(
            'rounded-lg border border-[hsl(var(--parchment-deep))]',
            'bg-parchment flex flex-col justify-center p-8 md:p-10 min-h-[320px]'
          )}
        >
          <p
            className={cn(
              'text-xs uppercase tracking-[0.2em] text-[hsl(var(--navy))]/45 mb-6'
            )}
          >
            Palavras do Bardo
          </p>
          <blockquote
            className={cn(
              'font-display text-xl md:text-2xl font-bold leading-snug',
              'text-[hsl(var(--navy))]'
            )}
          >
            &ldquo;{BARDO_QUOTE}&rdquo;
          </blockquote>
          <p className={cn('mt-8 text-sm text-[hsl(var(--navy))]/55')}>— Pegriam</p>
        </article>

        {/* Último conto */}
        <article
          className={cn(
            'overflow-hidden rounded-lg border border-white/10',
            'bg-navy flex flex-col'
          )}
        >
          <div className={cn('p-5 pb-3')}>
            <p className={cn('text-xs uppercase tracking-[0.18em] text-gold/80')}>
              Último conto
            </p>
          </div>
          {latestStory ? (
            <>
              <FeaturedCover
                src={latestStory.coverImage}
                alt={latestStory.title}
                className={cn('rounded-none')}
              />
              <div className={cn('p-5 space-y-3 flex-1 flex flex-col')}>
                <h3
                  className={cn(
                    'font-display text-xl font-bold text-[hsl(var(--parchment))] line-clamp-2'
                  )}
                >
                  {latestStory.title}
                </h3>
                <p className={cn('text-sm text-white/60 line-clamp-3 flex-1')}>
                  {latestStory.description}
                </p>
                <Link
                  href={storyRoute(String(latestStory.id)) as string}
                  className={cn(
                    'inline-flex items-center text-sm font-medium text-gold',
                    'hover:underline underline-offset-4'
                  )}
                >
                  Ler agora &rarr;
                </Link>
              </div>
            </>
          ) : (
            <div className={cn('p-5 flex-1 flex items-center')}>
              <p className={cn('text-sm text-white/50')}>
                Em breve, um novo conto chegará à taverna.
              </p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
