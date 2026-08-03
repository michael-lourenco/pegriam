/**
 * Sidebar do verbete individual.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { GlossaryTerm } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES } from '@/shared/constants';
import { cn } from '@/lib/utils';

const PORTRAIT = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

interface GlossaryTermSidebarProps {
  term: GlossaryTerm;
  relatedNames: string[];
  className?: string;
}

export function GlossaryTermSidebar({
  term,
  relatedNames,
  className,
}: GlossaryTermSidebarProps) {
  return (
    <aside className={cn('space-y-4', className)}>
      <div className={cn('rounded-lg border border-gold/35 bg-navy p-4 space-y-3')}>
        <p className={cn('font-display text-xs tracking-[0.18em] uppercase text-gold')}>
          Guia do Bardo
        </p>
        <div className={cn('flex gap-3 items-start')}>
          <div className={cn('relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gold/40')}>
            <Image
              src={PORTRAIT}
              alt="Pegriam"
              fill
              sizes="56px"
              className={cn('object-cover object-[58%_18%]')}
            />
          </div>
          <p className={cn('font-display text-sm italic text-white/70 leading-relaxed')}>
            &ldquo;Antes de atravessar a porta, aprenda o nome do limiar.&rdquo;
          </p>
        </div>
        <button
          type="button"
          disabled
          className={cn(
            'w-full rounded-md border border-gold/40 px-3 py-2 text-xs text-gold/80',
            'opacity-70 cursor-not-allowed'
          )}
          title="Áudio em breve"
        >
          Ouvir Pegriam falar sobre {term.term}
        </button>
      </div>

      <div className={cn('rounded-lg border border-gold/30 bg-navy p-4 space-y-3')}>
        <h3 className={cn('font-display text-sm font-bold text-gold')}>
          Informações Rápidas
        </h3>
        <dl className={cn('space-y-2.5 text-sm')}>
          <InfoRow label="Tipo" value={GLOSSARY_CATEGORIES[term.category]} />
          {term.aliases.length > 0 && (
            <InfoRow label="Também conhecido" value={term.aliases.join(', ')} />
          )}
          {term.firstAppearanceStoryId && (
            <InfoRow label="Primeira menção" value="Registrada nas crônicas" />
          )}
          <InfoRow
            label="Relacionados"
            value={
              relatedNames.length > 0
                ? `${relatedNames.length} verbetes`
                : 'Nenhum ainda'
            }
          />
        </dl>
      </div>

      {relatedNames.length > 0 && (
        <div className={cn('rounded-lg border border-gold/30 bg-navy p-4 space-y-3')}>
          <h3 className={cn('font-display text-sm font-bold text-gold')}>
            Termos Relacionados
          </h3>
          <div className={cn('flex flex-wrap gap-2')}>
            {relatedNames.map((name) => (
              <span
                key={name}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full',
                  'border border-gold/30 text-[hsl(var(--parchment))]/90'
                )}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={cn('rounded-lg border border-gold/30 bg-navy p-4 space-y-3')}>
        <h3 className={cn('font-display text-sm font-bold text-gold')}>
          Explorar Verbetes
        </h3>
        <p className={cn('text-sm text-white/55')}>
          Volte ao glossário e continue mapeando Kontempler.
        </p>
        <Link
          href="/glossario"
          className={cn(
            'inline-flex text-sm text-gold hover:underline underline-offset-4'
          )}
        >
          Ver mais no Glossário &rarr;
        </Link>
      </div>

      <div className={cn('rounded-lg border border-gold/30 bg-navy p-4 space-y-3')}>
        <div className={cn('flex items-center gap-3')}>
          <div className={cn('relative h-10 w-10 overflow-hidden rounded-full border border-gold/40')}>
            <Image
              src={PORTRAIT}
              alt=""
              fill
              sizes="40px"
              className={cn('object-cover object-[58%_18%]')}
            />
          </div>
          <h3 className={cn('font-display text-sm font-bold text-gold')}>
            Nota de Pegriam
          </h3>
        </div>
        <p className={cn('text-sm italic text-white/65 leading-relaxed')}>
          Guarde este nome. Em Kontempler, lembrar é uma forma de magia.
        </p>
      </div>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className={cn('text-gold text-xs uppercase tracking-wide')}>{label}</dt>
      <dd className={cn('text-white/80 mt-0.5')}>{value}</dd>
    </div>
  );
}
