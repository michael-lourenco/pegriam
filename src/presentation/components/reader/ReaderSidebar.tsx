/**
 * Sidebar do leitor: progresso, índice de seções, temas e nota do bardo.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PORTRAIT = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

export interface ChapterSection {
  id: string;
  title: string;
}

interface ReaderSidebarProps {
  scrollPercentage: number;
  estimatedReadTime: number;
  sections: ChapterSection[];
  tags: string[];
  className?: string;
}

export function ReaderSidebar({
  scrollPercentage,
  estimatedReadTime,
  sections,
  tags,
  className,
}: ReaderSidebarProps) {
  const remaining = Math.max(
    1,
    Math.ceil(estimatedReadTime * (1 - scrollPercentage / 100))
  );
  const progress = Math.min(100, Math.max(0, Math.round(scrollPercentage)));

  return (
    <aside className={cn('space-y-4', className)}>
      {/* Sua Leitura */}
      <div
        className={cn(
          'rounded-lg border border-gold/30 bg-navy p-4 space-y-3'
        )}
      >
        <h3 className={cn('font-display text-sm font-bold text-gold')}>
          Sua Leitura
        </h3>
        <div className={cn('h-2 rounded-full bg-white/10 overflow-hidden')}>
          <div
            className={cn('h-full rounded-full bg-gold transition-all duration-300')}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={cn('text-xs text-white/60')}>
          {progress}% · {remaining} min restantes neste capítulo
        </p>
      </div>

      {/* Índice */}
      {sections.length > 0 && (
        <div
          className={cn(
            'rounded-lg border border-gold/30 bg-navy p-4 space-y-3'
          )}
        >
          <h3 className={cn('font-display text-sm font-bold text-gold')}>
            Índice do Capítulo
          </h3>
          <nav aria-label="Seções do capítulo">
            <ul className={cn('space-y-2')}>
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={cn(
                      'flex items-start gap-2 text-sm text-white/70',
                      'hover:text-gold transition-colors'
                    )}
                  >
                    <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full bg-gold/60 flex-shrink-0')} />
                    <span className={cn('leading-snug')}>{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Temas */}
      {tags.length > 0 && (
        <div
          className={cn(
            'rounded-lg border border-gold/30 bg-navy p-4 space-y-3'
          )}
        >
          <h3 className={cn('font-display text-sm font-bold text-gold')}>
            Temas deste Capítulo
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

      {/* Nota de Pegriam */}
      <div
        className={cn(
          'rounded-lg border border-gold/30 bg-navy p-4 space-y-3'
        )}
      >
        <div className={cn('flex items-center gap-3')}>
          <div
            className={cn(
              'relative h-10 w-10 overflow-hidden rounded-full border border-gold/40 flex-shrink-0'
            )}
          >
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
          Em cada conto há uma porta. Abra com calma — Kontempler espera do outro lado.
        </p>
        <Link
          href="/sobre"
          className={cn('text-xs text-gold hover:underline underline-offset-4')}
        >
          Mais notas de Pegriam &rarr;
        </Link>
      </div>
    </aside>
  );
}

/**
 * Extrai títulos h2/h3 do HTML renderizado para o índice lateral.
 */
export function extractSectionsFromHtml(html: string | null): ChapterSection[] {
  if (!html) return [];

  const sections: ChapterSection[] = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    const title = match[2].replace(/<[^>]+>/g, '').trim();
    if (!title) continue;
    index += 1;
    const id = `secao-${index}-${slugify(title)}`;
    sections.push({ id, title });
  }

  return sections;
}

/**
 * Injeta ids âncora nos h2/h3 do HTML para o índice funcionar.
 */
export function injectHeadingIds(html: string, sections: ChapterSection[]): string {
  if (!html || sections.length === 0) return html;

  let i = 0;
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (full, level, attrs, inner) => {
    const section = sections[i];
    i += 1;
    if (!section) return full;
    const withoutId = String(attrs).replace(/\s*id=["'][^"']*["']/i, '');
    return `<h${level}${withoutId} id="${section.id}">${inner}</h${level}>`;
  });
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}
