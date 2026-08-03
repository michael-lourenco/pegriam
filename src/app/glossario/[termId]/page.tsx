'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/shared/container';
import { GlossaryTerm, GlossaryTermId } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES } from '@/shared/constants';
import { Breadcrumbs } from '@/presentation/components/shared/Breadcrumbs';
import { GlossaryTermSidebar } from '@/presentation/components/glossary/GlossaryTermSidebar';
import { GlossaryTermCard } from '@/presentation/components/glossary/GlossaryTermCard';
import { categoryPillClass } from '@/presentation/components/glossary/glossaryUi';
import { SafeImage } from '@/presentation/components/shared/SafeImage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const FALLBACK = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

export default function GlossaryTermPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params.termId as string;

  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [relatedTerms, setRelatedTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { glossaryRepository } = Container.getRepositories();
        const data = await glossaryRepository.findById(termId as GlossaryTermId);
        if (!data) {
          setError('Termo não encontrado');
          return;
        }
        setTerm(data);

        if (data.relatedTerms.length > 0) {
          const allTerms = await glossaryRepository.findAll();
          const related = allTerms.filter((t) => data.relatedTerms.includes(t.id));
          setRelatedTerms(related);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar termo');
      } finally {
        setLoading(false);
      }
    }
    if (termId) load();
  }, [termId]);

  const sections = useMemo(() => {
    if (!term) return [];
    const paragraphs = term.fullDescription
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      return [{ title: 'Visão geral', body: term.fullDescription }];
    }

    const titles = [
      'Visão geral',
      'Características',
      'Importância em Kontempler',
      'Histórias relacionadas',
    ];

    return paragraphs.slice(0, 4).map((body, i) => ({
      title: titles[i] || `Nota ${i + 1}`,
      body,
    }));
  }, [term]);

  if (loading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-[hsl(var(--navy-deep))]')}>
        <div className={cn('h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent')} />
      </div>
    );
  }

  if (error || !term) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-[hsl(var(--navy-deep))]')}>
        <div className={cn('text-center space-y-4')}>
          <p className={cn('text-destructive')}>{error || 'Termo não encontrado'}</p>
          <Button onClick={() => router.push('/glossario')}>Voltar ao Glossário</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-[hsl(var(--navy-deep))]')}>
      <div className={cn('container mx-auto px-4 py-8')}>
        <Breadcrumbs
          items={[
            { label: 'Glossário', href: '/glossario' },
            { label: term.term },
          ]}
          className={cn(
            'mb-8 text-white/50',
            '[&_a]:text-white/55 [&_a:hover]:text-gold',
            '[&_span.text-foreground]:text-[hsl(var(--parchment))]'
          )}
        />

        <div
          className={cn(
            'grid grid-cols-1 gap-10',
            'lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12'
          )}
        >
          <div className={cn('min-w-0 space-y-8')}>
            <header className={cn('space-y-4')}>
              <div className={cn('flex flex-wrap items-center gap-3')}>
                <h1
                  className={cn(
                    'font-display text-4xl md:text-5xl font-bold',
                    'text-[hsl(var(--parchment))]'
                  )}
                >
                  {term.term}
                </h1>
                <span className={cn(categoryPillClass(term.category))}>
                  {GLOSSARY_CATEGORIES[term.category]}
                </span>
              </div>
              {term.aliases.length > 0 && (
                <p className={cn('text-sm text-white/50')}>
                  Também conhecido como:{' '}
                  <strong className={cn('text-white/75')}>{term.aliases.join(', ')}</strong>
                </p>
              )}
              <p
                className={cn(
                  'font-display italic text-lg text-white/70 max-w-3xl leading-relaxed'
                )}
              >
                &ldquo;{term.shortDescription}&rdquo;
              </p>
            </header>

            <div
              className={cn(
                'relative overflow-hidden rounded-xl',
                'border-2 border-gold/40 shadow-xl shadow-black/25'
              )}
            >
              <div className={cn('relative aspect-[16/9] bg-navy')}>
                {term.imageUrl ? (
                  <SafeImage
                    src={term.imageUrl}
                    alt={term.term}
                    className={cn('absolute inset-0 h-full w-full object-cover')}
                  />
                ) : (
                  <Image
                    src={FALLBACK}
                    alt={term.term}
                    fill
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    className={cn('object-cover object-[58%_20%] opacity-90')}
                    priority
                  />
                )}
                <div
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2',
                    'hidden sm:flex writing-mode-vertical items-center',
                    'rounded border border-gold/50 bg-[hsl(var(--navy-deep))]/80',
                    'px-2 py-3'
                  )}
                >
                  <span
                    className={cn(
                      'font-display text-xs tracking-[0.25em] uppercase text-gold',
                      '[writing-mode:vertical-rl] rotate-180'
                    )}
                  >
                    {term.term}
                  </span>
                </div>
              </div>
            </div>

            {/* Parchment description */}
            <article
              className={cn(
                'rounded-xl border border-gold/30 bg-parchment',
                'px-5 py-7 md:px-8 md:py-9 space-y-7'
              )}
            >
              {sections.map((section, index) => (
                <section key={section.title} className={cn('space-y-2')}>
                  <h2
                    className={cn(
                      'font-display text-lg font-bold',
                      'text-[hsl(215_50%_14%)] flex items-center gap-2'
                    )}
                  >
                    <span className={cn('text-gold text-sm')} aria-hidden>
                      {index + 1}.
                    </span>
                    {section.title}
                  </h2>
                  <p
                    className={cn(
                      'text-[hsl(215_45%_18%)] leading-relaxed whitespace-pre-wrap'
                    )}
                  >
                    {section.body}
                  </p>
                </section>
              ))}
            </article>

            {relatedTerms.length > 0 && (
              <section className={cn('space-y-4')}>
                <h2
                  className={cn(
                    'font-display text-sm font-bold tracking-[0.18em] uppercase text-gold'
                  )}
                >
                  Histórias e verbetes relacionados
                </h2>
                <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3')}>
                  {relatedTerms.map((rt) => (
                    <GlossaryTermCard key={rt.id} term={rt} view="list" />
                  ))}
                </div>
              </section>
            )}

            <Link href="/glossario">
              <Button
                variant="outline"
                className={cn('border-gold/40 text-gold hover:bg-gold/10')}
              >
                &larr; Voltar ao Glossário
              </Button>
            </Link>
          </div>

          <GlossaryTermSidebar
            term={term}
            relatedNames={relatedTerms.map((t) => t.term)}
            className={cn('lg:sticky lg:top-24 self-start')}
          />
        </div>
      </div>
    </div>
  );
}
