/**
 * Card de verbete na listagem do glossário.
 */

'use client';

import Link from 'next/link';
import { GlossaryTerm } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES } from '@/shared/constants';
import { categoryPillClass } from '@/presentation/components/glossary/glossaryUi';
import { SafeImage } from '@/presentation/components/shared/SafeImage';
import { cn } from '@/lib/utils';

const FALLBACK = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

interface GlossaryTermCardProps {
  term: GlossaryTerm;
  view?: 'grid' | 'list';
}

export function GlossaryTermCard({ term, view = 'grid' }: GlossaryTermCardProps) {
  return (
    <Link
      href={`/glossario/${term.id}`}
      className={cn(
        'group block h-full rounded-lg border border-gold/25 bg-navy',
        'hover:border-gold/60 hover:shadow-[0_0_24px_hsl(38_72%_52%_/_0.12)]',
        'transition-all duration-200 p-3'
      )}
    >
      <div className={cn('flex gap-3 h-full', view === 'list' && 'sm:items-center')}>
        <div
          className={cn(
            'relative flex-shrink-0 overflow-hidden rounded-md border border-white/10',
            'bg-[hsl(var(--navy-deep))]',
            view === 'grid' ? 'h-16 w-16' : 'h-14 w-14 sm:h-16 sm:w-16'
          )}
        >
          <SafeImage
            src={term.imageUrl || FALLBACK}
            alt=""
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              !term.imageUrl && 'object-[58%_18%] opacity-80'
            )}
          />
        </div>

        <div className={cn('min-w-0 flex-1 flex flex-col')}>
          <div className={cn('flex items-start justify-between gap-2')}>
            <h2
              className={cn(
                'font-display text-lg font-bold text-[hsl(var(--parchment))]',
                'group-hover:text-gold transition-colors line-clamp-1'
              )}
            >
              {term.term}
            </h2>
            <span
              className={cn(
                'text-gold opacity-0 group-hover:opacity-100 transition-opacity'
              )}
              aria-hidden
            >
              →
            </span>
          </div>
          <span className={cn(categoryPillClass(term.category), 'mt-1 w-fit')}>
            {GLOSSARY_CATEGORIES[term.category]}
          </span>
          <p className={cn('mt-2 text-sm text-white/55 line-clamp-2 flex-1')}>
            {term.shortDescription}
          </p>
        </div>
      </div>
    </Link>
  );
}
