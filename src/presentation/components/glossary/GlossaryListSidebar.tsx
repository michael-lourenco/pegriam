/**
 * Sidebar da listagem do glossário.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PORTRAIT = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

interface GlossaryListSidebarProps {
  className?: string;
}

export function GlossaryListSidebar({ className }: GlossaryListSidebarProps) {
  return (
    <aside className={cn('space-y-4', className)}>
      <div className={cn('rounded-lg border border-gold/30 bg-navy p-4 space-y-3')}>
        <div className={cn('flex items-center gap-3')}>
          <div className={cn('relative h-12 w-12 overflow-hidden rounded-full border border-gold/40')}>
            <Image
              src={PORTRAIT}
              alt=""
              fill
              sizes="48px"
              className={cn('object-cover object-[58%_18%]')}
            />
          </div>
          <h3 className={cn('font-display text-sm font-bold text-gold')}>
            Notas de Pegriam
          </h3>
        </div>
        <p className={cn('text-sm italic text-white/65 leading-relaxed')}>
          &ldquo;Um glossário é uma taverna de nomes — entre e ouça o que cada um tem a contar.&rdquo;
        </p>
        <Link href="/sobre" className={cn('text-xs text-gold hover:underline underline-offset-4')}>
          Ver mais notas do bardo &rarr;
        </Link>
      </div>

      <div className={cn('rounded-lg border border-gold/30 bg-navy p-4 space-y-3')}>
        <h3 className={cn('font-display text-sm font-bold text-gold')}>
          Como usar o Glossário
        </h3>
        <ul className={cn('space-y-2.5 text-sm text-white/65')}>
          <li className={cn('flex gap-2')}>
            <span className={cn('text-gold')}>⌕</span>
            Busque pelo nome ou por um detalhe da descrição.
          </li>
          <li className={cn('flex gap-2')}>
            <span className={cn('text-gold')}>☰</span>
            Filtre por categoria ou pule pelo índice A–Z.
          </li>
          <li className={cn('flex gap-2')}>
            <span className={cn('text-gold')}>→</span>
            Abra um verbete para ler a história completa do termo.
          </li>
        </ul>
      </div>

      <div className={cn('rounded-lg border border-gold/30 bg-navy p-4 space-y-2')}>
        <h3 className={cn('font-display text-sm font-bold text-gold flex items-center gap-2')}>
          <span aria-hidden>✦</span> Explore por Categoria
        </h3>
        <p className={cn('text-sm text-white/55 leading-relaxed')}>
          Personagens, lugares, magias e muito mais — o mapa de Kontempler começa pelos nomes.
        </p>
      </div>
    </aside>
  );
}
