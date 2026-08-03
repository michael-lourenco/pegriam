/**
 * Banner "Contado por Pegriam" — intro do bardo no leitor.
 */

'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const PORTRAIT = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

const DEFAULT_QUOTE =
  'Reuni estas histórias como quem recolhe ecos do tempo. Escute com atenção, pois em cada palavra mora um fragmento de Pegriam.';

interface BardIntroBannerProps {
  className?: string;
  quote?: string;
}

export function BardIntroBanner({
  className,
  quote = DEFAULT_QUOTE,
}: BardIntroBannerProps) {
  return (
    <aside
      className={cn(
        'relative overflow-hidden rounded-lg',
        'bg-navy border border-gold/40',
        'px-4 py-4 md:px-6 md:py-5',
        className
      )}
    >
      <div className={cn('flex items-center gap-4 md:gap-6')}>
        <div
          className={cn(
            'relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden',
            'rounded-full border-2 border-gold/50'
          )}
        >
          <Image
            src={PORTRAIT}
            alt="Pegriam"
            fill
            sizes="80px"
            className={cn('object-cover object-[58%_18%]')}
          />
        </div>

        <div className={cn('min-w-0 flex-1')}>
          <p
            className={cn(
              'font-display text-xs md:text-sm tracking-[0.2em] uppercase text-gold mb-2'
            )}
          >
            Contado por Pegriam
          </p>
          <p
            className={cn(
              'font-display text-sm md:text-base italic leading-relaxed',
              'text-[hsl(var(--parchment))]/90'
            )}
          >
            &ldquo;{quote}&rdquo;
            <span className={cn('not-italic text-white/50 text-xs md:text-sm block mt-2')}>
              — Pegriam, o Bardo de Kontempler
            </span>
          </p>
        </div>

        <div
          className={cn('hidden sm:flex flex-shrink-0 text-gold/70')}
          aria-hidden
        >
          <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="24" cy="24" r="18" />
            <circle cx="24" cy="24" r="6" />
            <path d="M24 6v6M24 36v6M6 24h6M36 24h6" />
            <path d="m12 12 4 4M32 32l4 4M32 12l-4 4M16 32l-4 4" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
