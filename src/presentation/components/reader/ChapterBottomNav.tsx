/**
 * Navegação inferior do capítulo (anterior / próximo).
 * Centro decorativo no espírito do mockup (sem áudio nesta versão).
 */

'use client';

import Link from 'next/link';
import { Chapter } from '@/domain/entities/Chapter';
import { chapterRoute, storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';

interface ChapterBottomNavProps {
  storyId: string;
  previousChapter: Chapter | null;
  nextChapter: Chapter | null;
  className?: string;
}

export function ChapterBottomNav({
  storyId,
  previousChapter,
  nextChapter,
  className,
}: ChapterBottomNavProps) {
  return (
    <nav
      aria-label="Navegação entre capítulos"
      className={cn(
        'border-t border-gold/20 bg-[hsl(var(--navy-deep))]',
        className
      )}
    >
      <div
        className={cn(
          'container mx-auto px-4 py-5',
          'grid grid-cols-1 md:grid-cols-3 gap-4 items-center'
        )}
      >
        <div className={cn('flex justify-start')}>
          {previousChapter ? (
            <Link
              href={chapterRoute(storyId, String(previousChapter.id)) as string}
              className={cn(
                'group max-w-full rounded-lg border border-white/10 bg-navy px-4 py-3',
                'hover:border-gold/40 transition-colors'
              )}
            >
              <span className={cn('block text-xs text-white/45 mb-1')}>
                &larr; Capítulo anterior
              </span>
              <span
                className={cn(
                  'block font-display text-sm text-[hsl(var(--parchment))]',
                  'group-hover:text-gold truncate'
                )}
              >
                Cap. {previousChapter.number}: {previousChapter.title}
              </span>
            </Link>
          ) : (
            <Link
              href={storyRoute(storyId) as string}
              className={cn('text-sm text-white/45 hover:text-gold transition-colors')}
            >
              &larr; Voltar à história
            </Link>
          )}
        </div>

        <div className={cn('flex flex-col items-center text-center gap-1 px-2')}>
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-gold/80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <p className={cn('font-display text-sm text-[hsl(var(--parchment))]')}>
            Deixe as palavras te conduzirem
          </p>
          <p className={cn('text-xs text-white/40')}>
            Áudio narrado em breve
          </p>
        </div>

        <div className={cn('flex justify-end')}>
          {nextChapter ? (
            <Link
              href={chapterRoute(storyId, String(nextChapter.id)) as string}
              className={cn(
                'group max-w-full rounded-lg border border-white/10 bg-navy px-4 py-3 text-right',
                'hover:border-gold/40 transition-colors'
              )}
            >
              <span className={cn('block text-xs text-white/45 mb-1')}>
                Próximo capítulo &rarr;
              </span>
              <span
                className={cn(
                  'block font-display text-sm text-[hsl(var(--parchment))]',
                  'group-hover:text-gold truncate'
                )}
              >
                Cap. {nextChapter.number}: {nextChapter.title}
              </span>
            </Link>
          ) : (
            <Link
              href={storyRoute(storyId) as string}
              className={cn('text-sm text-white/45 hover:text-gold transition-colors')}
            >
              Fim · Ver história &rarr;
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
