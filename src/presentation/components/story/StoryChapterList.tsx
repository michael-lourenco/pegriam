/**
 * Lista de capítulos no estilo pergaminho do mockup.
 */

'use client';

import Link from 'next/link';
import { Chapter } from '@/domain/entities/Chapter';
import { chapterRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface StoryChapterListProps {
  storyId: string;
  chapters: Chapter[];
  hasFullAccess: boolean;
  storyDescription?: string;
  className?: string;
}

export function StoryChapterList({
  storyId,
  chapters,
  hasFullAccess,
  storyDescription,
  className,
}: StoryChapterListProps) {
  if (chapters.length === 0) {
    return (
      <section className={cn(className)}>
        <ChapterHeading />
        <p className={cn('text-white/55 text-sm')}>
          Nenhum capítulo disponível ainda.
        </p>
      </section>
    );
  }

  return (
    <section className={cn('space-y-4', className)}>
      <ChapterHeading />
      <ul className={cn('space-y-3')}>
        {chapters.map((chapter) => {
          const isAccessible = chapter.isFree || hasFullAccess;
          const teaser =
            storyDescription && storyDescription.length > 120
              ? `${storyDescription.slice(0, 117).trim()}…`
              : storyDescription;

          const inner = (
            <div
              className={cn(
                'flex flex-col sm:flex-row sm:items-center gap-4',
                'rounded-lg border border-gold/25 bg-parchment p-4 md:p-5',
                'transition-transform',
                isAccessible && 'hover:-translate-y-0.5'
              )}
            >
              <div
                className={cn(
                  'flex h-14 w-14 flex-shrink-0 items-center justify-center',
                  'rounded-full border-2 border-gold/60',
                  'font-display text-xl font-bold text-[hsl(215_50%_14%)]',
                  'bg-[hsl(38_40%_88%)]'
                )}
                aria-hidden
              >
                {chapter.number}
              </div>

              <div className={cn('min-w-0 flex-1 space-y-1')}>
                <h3
                  className={cn(
                    'font-display text-lg font-bold',
                    'text-[hsl(215_50%_14%)]'
                  )}
                >
                  Capítulo {chapter.number}: {chapter.title}
                </h3>
                {teaser && (
                  <p className={cn('text-sm text-[hsl(215_35%_28%)] line-clamp-2')}>
                    {teaser}
                  </p>
                )}
                <p className={cn('text-xs text-[hsl(215_30%_35%)] pt-1')}>
                  {chapter.wordCount} palavras · {chapter.estimatedReadTime} min
                  {chapter.isFree && (
                    <span className={cn('ml-2 text-[hsl(150_40%_28%)]')}>Grátis</span>
                  )}
                  {!chapter.isFree && !isAccessible && (
                    <span className={cn('ml-2 text-[hsl(215_25%_40%)]')}>Pago</span>
                  )}
                </p>
              </div>

              <div className={cn('flex-shrink-0')}>
                {isAccessible ? (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-md px-4 py-2 text-sm font-medium',
                      'bg-[hsl(215_50%_18%)] text-[hsl(var(--parchment))]'
                    )}
                  >
                    Ler capítulo &rarr;
                  </span>
                ) : (
                  <Button size="sm" disabled variant="outline" className={cn('opacity-70')}>
                    Bloqueado
                  </Button>
                )}
              </div>
            </div>
          );

          if (!isAccessible) {
            return <li key={chapter.id}>{inner}</li>;
          }

          return (
            <li key={chapter.id}>
              <Link
                href={chapterRoute(storyId, String(chapter.id)) as string}
                className={cn('block')}
              >
                {inner}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function ChapterHeading() {
  return (
    <h2
      className={cn(
        'font-display text-sm font-bold tracking-[0.2em] uppercase',
        'text-gold flex items-center gap-2'
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      Capítulos
    </h2>
  );
}
