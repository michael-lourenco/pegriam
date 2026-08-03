/**
 * Hero da listagem do glossário.
 */

'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

const PORTRAIT = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

interface GlossaryHeroProps {
  termsCount: number;
  className?: string;
}

export function GlossaryHero({ termsCount, className }: GlossaryHeroProps) {
  return (
    <header
      className={cn(
        'grid grid-cols-1 md:grid-cols-[1fr_auto_minmax(200px,260px)]',
        'gap-6 md:gap-8 items-center mb-10',
        className
      )}
    >
      <div className={cn('space-y-3 order-2 md:order-1')}>
        <h1
          className={cn(
            'font-display text-4xl md:text-5xl font-bold text-gold'
          )}
        >
          Glossário de Pegriam
        </h1>
        <p className={cn('text-white/65 max-w-xl leading-relaxed')}>
          Explore personagens, lugares, magias e conceitos do universo de Kontempler.
          {termsCount > 0 && (
            <span className={cn('text-white/45')}> {termsCount} verbetes catalogados.</span>
          )}
        </p>
      </div>

      <div
        className={cn(
          'relative mx-auto order-1 md:order-2',
          'h-36 w-36 md:h-44 md:w-44'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full border border-gold/40',
            'shadow-[0_0_40px_hsl(38_72%_52%_/_0.15)]'
          )}
          aria-hidden
        />
        <div
          className={cn(
            'absolute inset-2 overflow-hidden rounded-full border border-gold/25'
          )}
        >
          <Image
            src={PORTRAIT}
            alt="Pegriam"
            fill
            sizes="176px"
            className={cn('object-cover object-[58%_18%]')}
          />
        </div>
      </div>

      <aside
        className={cn(
          'order-3 rounded-lg border border-gold/35 bg-navy p-4 space-y-2',
          'md:self-stretch md:flex md:flex-col md:justify-center'
        )}
      >
        <p className={cn('font-display text-xs tracking-[0.18em] uppercase text-gold flex items-center gap-2')}>
          <span aria-hidden>♪</span> Guia do Bardo
        </p>
        <p className={cn('font-display text-sm italic text-white/70 leading-relaxed')}>
          &ldquo;Todo nome guarda uma história. Consulte o glossário como quem abre um mapa.&rdquo;
        </p>
      </aside>
    </header>
  );
}
