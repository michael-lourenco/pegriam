/**
 * Componente: CategoryStrip
 *
 * Faixa de categorias simbólicas abaixo do hero.
 * Links apontam para rotas existentes (sem filtro por tags nesta versão).
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  {
    label: 'Histórias Épicas',
    href: '/stories',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    label: 'Locais Incríveis',
    href: '/glossario',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 2 3 7l9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </svg>
    ),
  },
  {
    label: 'Lendas Antigas',
    href: '/stories',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    label: 'Contado por Pegriam',
    href: '/sobre',
    icon: (
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
] as const;

export function CategoryStrip() {
  return (
    <section
      className={cn('bg-navy border-y border-white/10')}
      aria-label="Categorias"
    >
      <div
        className={cn(
          'container mx-auto px-4',
          'grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10'
        )}
      >
        {CATEGORIES.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'group flex flex-col items-center justify-center gap-3',
              'px-4 py-8 text-center transition-colors',
              'hover:bg-white/5'
            )}
          >
            <span className={cn('text-gold transition-transform group-hover:scale-110')}>
              {item.icon}
            </span>
            <span
              className={cn(
                'font-display text-sm md:text-base text-[hsl(var(--parchment))]',
                'group-hover:text-gold transition-colors'
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
