/**
 * Sidebar da página da história: Pegriam, sobre e temas.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PORTRAIT = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

interface StorySidebarProps {
  description: string;
  tags: string[];
  className?: string;
}

export function StorySidebar({ description, tags, className }: StorySidebarProps) {
  return (
    <aside className={cn('space-y-4', className)}>
      {/* Contado por Pegriam */}
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-gold/35 bg-navy'
        )}
      >
        <div className={cn('relative aspect-[4/3]')}>
          <Image
            src={PORTRAIT}
            alt="Pegriam"
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className={cn('object-cover object-[58%_18%]')}
          />
          <div
            className={cn(
              'absolute inset-0',
              'bg-gradient-to-t from-[hsl(var(--navy))] via-transparent to-transparent'
            )}
          />
        </div>
        <div className={cn('p-4 space-y-3')}>
          <p className={cn('font-display text-xs tracking-[0.18em] uppercase text-gold')}>
            Contado por Pegriam
          </p>
          <p className={cn('font-display text-sm italic text-white/70 leading-relaxed')}>
            &ldquo;Cada história é uma canção, cada canção é uma memória. Escute com atenção.&rdquo;
            <span className={cn('not-italic text-white/45 text-xs block mt-2')}>
              — Pegriam, o Bardo de Kontempler
            </span>
          </p>
          <Link
            href="/sobre"
            className={cn('text-xs text-gold hover:underline underline-offset-4')}
          >
            Conhecer mais sobre Pegriam &rarr;
          </Link>
        </div>
      </div>

      {/* Sobre esta história — pergaminho */}
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border border-gold/30',
          'bg-parchment p-5'
        )}
      >
        <h3
          className={cn(
            'font-display text-sm font-bold tracking-wide uppercase mb-3',
            'text-[hsl(215_50%_14%)]'
          )}
        >
          Sobre Esta História
        </h3>
        <p
          className={cn(
            'text-sm leading-relaxed',
            'text-[hsl(215_45%_18%)]'
          )}
        >
          {description}
        </p>
        <span
          className={cn(
            'pointer-events-none absolute bottom-2 right-2',
            'text-[hsl(215_50%_14%)]/10 text-4xl'
          )}
          aria-hidden
        >
          ✦
        </span>
      </div>

      {/* Temas */}
      {tags.length > 0 && (
        <div
          className={cn(
            'rounded-lg border border-gold/30 bg-navy p-4 space-y-3'
          )}
        >
          <h3 className={cn('font-display text-sm font-bold text-gold flex items-center gap-2')}>
            <span aria-hidden>✦</span>
            Temas Desta História
          </h3>
          <div className={cn('flex flex-wrap gap-2')}>
            {tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full',
                  'border border-gold/25 bg-gold/10 text-[hsl(var(--parchment))]'
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className={cn('px-1 pt-2 text-xs text-white/40 leading-relaxed')}>
        <span className={cn('text-gold')}>✦</span> Contos que atravessam reinos —
        leia com calma, pois Kontempler guarda segredos entre as linhas.
      </p>
    </aside>
  );
}
