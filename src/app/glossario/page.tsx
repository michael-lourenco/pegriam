'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/shared/container';
import { GlossaryTerm } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/shared/constants';
import { Breadcrumbs } from '@/presentation/components/shared/Breadcrumbs';
import { GlossaryHero } from '@/presentation/components/glossary/GlossaryHero';
import { GlossaryTermCard } from '@/presentation/components/glossary/GlossaryTermCard';
import { GlossaryListSidebar } from '@/presentation/components/glossary/GlossaryListSidebar';
import { ALPHABET, letterOf } from '@/presentation/components/glossary/glossaryUi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GlossarioPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');
  const [activeLetter, setActiveLetter] = useState<string | 'all'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { glossaryRepository } = Container.getRepositories();
        const all = await glossaryRepository.findAll();
        setTerms(all);
      } catch (error) {
        console.error('Erro ao carregar glossario:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...terms];

    if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.aliases.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (activeLetter !== 'all') {
      result = result.filter((t) => letterOf(t.term) === activeLetter);
    }

    return result.sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
  }, [terms, activeCategory, search, activeLetter]);

  const presentLetters = useMemo(() => {
    const set = new Set(terms.map((t) => letterOf(t.term)));
    return set;
  }, [terms]);

  const categories = Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, string][];

  if (loading) {
    return (
      <div className={cn('min-h-screen bg-[hsl(var(--navy-deep))]')}>
        <div className={cn('container mx-auto px-4 py-8')}>
          <div className={cn('h-10 w-64 bg-white/10 animate-pulse rounded mb-8')} />
          <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4')}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn('h-28 bg-white/10 animate-pulse rounded-lg')} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-[hsl(var(--navy-deep))]')}>
      <div className={cn('container mx-auto px-4 py-8')}>
        <Breadcrumbs
          items={[{ label: 'Glossário' }]}
          className={cn(
            'mb-6 text-white/50',
            '[&_a]:text-white/55 [&_a:hover]:text-gold',
            '[&_span.text-foreground]:text-[hsl(var(--parchment))]'
          )}
        />

        <GlossaryHero termsCount={terms.length} />

        <div
          className={cn(
            'grid grid-cols-1 gap-10',
            'lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12'
          )}
        >
          <div className={cn('min-w-0 space-y-6')}>
            {/* Search + filters */}
            <div className={cn('space-y-4')}>
              <div className={cn('flex flex-col sm:flex-row gap-3')}>
                <Input
                  placeholder="Buscar termos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    'max-w-md bg-navy border-gold/25 text-[hsl(var(--parchment))]',
                    'placeholder:text-white/35'
                  )}
                />
                <div className={cn('flex items-center gap-2 ml-auto')}>
                  <Button
                    type="button"
                    size="sm"
                    variant={view === 'grid' ? 'default' : 'outline'}
                    onClick={() => setView('grid')}
                    className={cn(
                      view === 'grid'
                        ? 'bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90'
                        : 'border-gold/40 text-gold'
                    )}
                    aria-label="Visualização em grade"
                  >
                    Grade
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={view === 'list' ? 'default' : 'outline'}
                    onClick={() => setView('list')}
                    className={cn(
                      view === 'list'
                        ? 'bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90'
                        : 'border-gold/40 text-gold'
                    )}
                    aria-label="Visualização em lista"
                  >
                    Lista
                  </Button>
                </div>
              </div>

              <div className={cn('flex flex-wrap gap-2')}>
                <FilterChip
                  active={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                  label={`Todos (${terms.length})`}
                />
                {categories.map(([key, label]) => {
                  const count = terms.filter((t) => t.category === key).length;
                  if (count === 0) return null;
                  return (
                    <FilterChip
                      key={key}
                      active={activeCategory === key}
                      onClick={() => setActiveCategory(key)}
                      label={`${label} (${count})`}
                    />
                  );
                })}
              </div>

              {/* A-Z */}
              <div
                className={cn(
                  'flex flex-wrap gap-1 border border-gold/20 rounded-lg p-2 bg-navy/60'
                )}
                role="navigation"
                aria-label="Índice alfabético"
              >
                <LetterChip
                  active={activeLetter === 'all'}
                  disabled={false}
                  onClick={() => setActiveLetter('all')}
                  label="Todos"
                />
                {ALPHABET.map((letter) => (
                  <LetterChip
                    key={letter}
                    active={activeLetter === letter}
                    disabled={!presentLetters.has(letter)}
                    onClick={() => setActiveLetter(letter)}
                    label={letter}
                  />
                ))}
              </div>
            </div>

            {/* Results */}
            {filtered.length === 0 ? (
              <div
                className={cn(
                  'rounded-lg border border-gold/25 bg-navy py-12 text-center px-4'
                )}
              >
                <p className={cn('text-white/65 text-lg mb-2')}>
                  {terms.length === 0
                    ? 'O glossário ainda está vazio.'
                    : 'Nenhum termo encontrado para esta busca.'}
                </p>
                {terms.length === 0 && (
                  <p className={cn('text-sm text-white/45')}>
                    Os termos serão adicionados conforme as histórias forem publicadas.
                  </p>
                )}
              </div>
            ) : (
              <div
                className={cn(
                  view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                    : 'flex flex-col gap-3'
                )}
              >
                {filtered.map((term) => (
                  <GlossaryTermCard key={term.id} term={term} view={view} />
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div
              className={cn(
                'mt-4 flex flex-col sm:flex-row items-center justify-between gap-4',
                'rounded-lg border border-gold/25 bg-navy px-5 py-4'
              )}
            >
              <p className={cn('text-sm text-white/60 text-center sm:text-left')}>
                ✦ O glossário cresce a cada conto. Faltou um nome?
              </p>
              <Link href="/sobre">
                <Button
                  variant="outline"
                  className={cn('border-gold/50 text-gold hover:bg-gold/10')}
                >
                  Sugerir um novo termo
                </Button>
              </Link>
            </div>
          </div>

          <GlossaryListSidebar className={cn('lg:sticky lg:top-24 self-start')} />
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-xs px-3 py-1.5 rounded-full border transition-colors',
        active
          ? 'bg-gold text-[hsl(var(--navy-deep))] border-gold font-semibold'
          : 'border-gold/30 text-white/70 hover:border-gold/55 hover:text-gold'
      )}
    >
      {label}
    </button>
  );
}

function LetterChip({
  active,
  disabled,
  onClick,
  label,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'min-w-[1.75rem] px-1.5 py-1 rounded text-xs transition-colors',
        disabled && 'opacity-25 cursor-not-allowed',
        !disabled && active && 'bg-gold text-[hsl(var(--navy-deep))] font-bold',
        !disabled && !active && 'text-white/55 hover:text-gold'
      )}
    >
      {label}
    </button>
  );
}
