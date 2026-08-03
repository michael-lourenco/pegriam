'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GetChapterUseCase } from '@/application/use-cases';
import { Container } from '@/shared/container';
import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { Story, StoryId } from '@/domain/entities/Story';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { ContentBlockRenderer } from '@/presentation/components/reader/ContentBlockRenderer';
import { ReadingToolbar } from '@/presentation/components/reader/ReadingToolbar';
import { ScrollProgress } from '@/presentation/components/reader/ScrollProgress';
import { BackToTop } from '@/presentation/components/reader/BackToTop';
import { BardIntroBanner } from '@/presentation/components/reader/BardIntroBanner';
import {
  ReaderSidebar,
  extractSectionsFromHtml,
  injectHeadingIds,
} from '@/presentation/components/reader/ReaderSidebar';
import { ChapterBottomNav } from '@/presentation/components/reader/ChapterBottomNav';
import { Breadcrumbs } from '@/presentation/components/shared/Breadcrumbs';
import { useReadingPreferences } from '@/shared/hooks/useReadingPreferences';
import { useReadingProgress } from '@/shared/hooks/useReadingProgress';
import { storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChapterReaderPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const storyId = params.id as string;
  const chapterId = params.chapterId as string;

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);

  const {
    prefs,
    increaseFontSize,
    decreaseFontSize,
    increaseLineHeight,
    decreaseLineHeight,
    toggleFontFamily,
    toggleImmersiveMode,
    resetPreferences,
  } = useReadingPreferences();

  const { scrollPercentage, restoreProgress } = useReadingProgress(storyId, chapterId);

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        setAccessDenied(false);

        const {
          chapterRepository,
          storyRepository,
          chapterRenderedRepository,
          purchaseRepository,
        } = Container.getRepositories();

        const storyData = await storyRepository.findById(storyId as StoryId);
        setStory(storyData);

        const rendered = await chapterRenderedRepository.findByChapterId(chapterId as ChapterId);
        if (rendered) setRenderedHtml(rendered.renderedHtml);

        const getChapter = new GetChapterUseCase(
          chapterRepository,
          storyRepository,
          purchaseRepository
        );
        const chapterData = await getChapter.execute(user, chapterId as ChapterId);

        if (!chapterData) {
          setError('Capítulo não encontrado');
          return;
        }

        setChapter(chapterData);

        if (!rendered) {
          const { MarkdownRendererService } = await import(
            '@/application/services/MarkdownRendererService'
          );
          const fallbackHtml = MarkdownRendererService.renderWithProse(
            chapterData.toMarkdown()
          );
          setRenderedHtml(fallbackHtml);
        }

        const chaptersList = await chapterRepository.findByStoryId(storyId as StoryId);
        setAllChapters(chaptersList);
      } catch (err: any) {
        if (
          err.message?.includes('Compre o acesso') ||
          err.message?.includes('nao disponivel')
        ) {
          setAccessDenied(true);
        } else {
          setError(err.message || 'Erro ao carregar capítulo');
        }
      } finally {
        setLoading(false);
      }
    }

    if (chapterId && storyId) loadChapter();
  }, [chapterId, storyId, user]);

  useEffect(() => {
    if (!loading && chapter) {
      const timer = setTimeout(() => restoreProgress(), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, chapter, restoreProgress]);

  const sections = useMemo(
    () => extractSectionsFromHtml(renderedHtml),
    [renderedHtml]
  );

  const htmlWithIds = useMemo(
    () => (renderedHtml ? injectHeadingIds(renderedHtml, sections) : null),
    [renderedHtml, sections]
  );

  if (loading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-[hsl(var(--navy-deep))]')}>
        <div className={cn('flex flex-col items-center gap-4')}>
          <div className={cn('h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent')} />
          <p className={cn('text-white/60')}>Carregando capítulo...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className={cn('min-h-screen bg-[hsl(var(--navy-deep))] flex items-center justify-center')}>
        <div className={cn('max-w-md w-full px-4')}>
          <Card className={cn('border-gold/30 bg-navy')}>
            <CardHeader className={cn('text-center')}>
              <CardTitle className={cn('text-[hsl(var(--parchment))]')}>
                Capítulo Bloqueado
              </CardTitle>
              <CardDescription className={cn('text-white/60')}>
                Este capítulo faz parte do conteúdo pago. Compre o acesso completo à história para continuar lendo.
              </CardDescription>
            </CardHeader>
            <CardContent className={cn('space-y-3')}>
              {user ? (
                <Link href={`/stories/${storyId}/checkout`}>
                  <Button size="lg" className={cn('w-full bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90')}>
                    Comprar Acesso Completo
                  </Button>
                </Link>
              ) : (
                <Link href={`/login?redirect=/stories/${storyId}`}>
                  <Button size="lg" className={cn('w-full bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90')}>
                    Entrar para Comprar
                  </Button>
                </Link>
              )}
              <Link href={`/stories/${storyId}`}>
                <Button variant="outline" className={cn('w-full border-gold/40 text-gold')}>
                  Voltar para a História
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !chapter || !story) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-[hsl(var(--navy-deep))]')}>
        <div className={cn('text-center space-y-4')}>
          <p className={cn('text-destructive')}>{error || 'Capítulo não encontrado'}</p>
          <Button onClick={() => router.push(`/stories/${storyId}`)}>Voltar para História</Button>
        </div>
      </div>
    );
  }

  const currentIndex = allChapters.findIndex((c) => c.id === chapter.id);
  const previousChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter =
    currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
  const sortedBlocks = [...chapter.blocks].sort((a, b) => a.order - b.order);

  const fontFamilyClass =
    prefs.fontFamily === 'serif' ? 'font-[family-name:var(--font-merriweather)]' : '';

  return (
    <div
      className={cn(
        'min-h-screen bg-[hsl(var(--navy-deep))]',
        prefs.immersiveMode && 'fixed inset-0 z-50 overflow-auto'
      )}
    >
      <ScrollProgress percentage={scrollPercentage} />

      {!prefs.immersiveMode && (
        <div className={cn('border-b border-white/10 bg-[hsl(var(--navy-deep))]/95')}>
          <div className={cn('container mx-auto px-4 py-5')}>
            <Breadcrumbs
              items={[
                { label: 'Histórias', href: '/stories' },
                { label: story.title, href: storyRoute(String(storyId)) },
                { label: `Cap. ${chapter.number}: ${chapter.title}` },
              ]}
              className={cn('mb-4 text-white/50 [&_a]:text-white/55 [&_a:hover]:text-gold [&_span.text-foreground]:text-[hsl(var(--parchment))]')}
            />

            <div className={cn('flex flex-wrap items-center justify-between gap-4')}>
              <div className={cn('flex items-center gap-3 min-w-0')}>
                <span className={cn('hidden sm:inline text-gold')} aria-hidden>
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <h1
                  className={cn(
                    'font-display text-2xl md:text-3xl font-bold',
                    'text-[hsl(var(--parchment))] truncate'
                  )}
                >
                  Capítulo {chapter.number}: {chapter.title}
                </h1>
              </div>

              <div className={cn('flex items-center gap-3')}>
                <span className={cn('text-sm text-white/50 hidden sm:block')}>
                  {chapter.wordCount} palavras · {chapter.estimatedReadTime} min de leitura
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowToolbar(!showToolbar)}
                  aria-label="Ajustes de leitura"
                  className={cn('border-gold/40 text-gold hover:bg-gold/10')}
                >
                  Ajustes
                </Button>
              </div>
            </div>

            {showToolbar && (
              <ReadingToolbar
                prefs={prefs}
                onIncreaseFontSize={increaseFontSize}
                onDecreaseFontSize={decreaseFontSize}
                onIncreaseLineHeight={increaseLineHeight}
                onDecreaseLineHeight={decreaseLineHeight}
                onToggleFontFamily={toggleFontFamily}
                onToggleImmersiveMode={toggleImmersiveMode}
                onReset={resetPreferences}
                className={cn('mt-4')}
              />
            )}
          </div>
        </div>
      )}

      {prefs.immersiveMode && (
        <div className={cn('fixed top-4 right-4 z-[60]')}>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleImmersiveMode}
            className={cn('bg-navy/90 border-gold/40 text-gold backdrop-blur-sm')}
          >
            Sair Imersivo
          </Button>
        </div>
      )}

      <div className={cn('container mx-auto px-4 py-8')}>
        {!prefs.immersiveMode && (
          <BardIntroBanner className={cn('mb-8 animate-fade-up')} />
        )}

        <div
          className={cn(
            'grid grid-cols-1 gap-8',
            !prefs.immersiveMode && 'lg:grid-cols-[minmax(0,1fr)_280px]'
          )}
        >
          <article
            className={cn(
              'reader-parchment rounded-xl border border-gold/35 shadow-xl shadow-black/30',
              'px-6 py-8 md:px-10 md:py-12',
              fontFamilyClass,
              'animate-fade-up'
            )}
            style={{ fontSize: `${prefs.fontSize}px`, lineHeight: prefs.lineHeight }}
          >
            <h2
              id="topo"
              className={cn(
                'font-display text-3xl md:text-4xl font-bold mb-8',
                'text-[hsl(var(--navy))] text-center'
              )}
            >
              {chapter.title}
            </h2>

            <div className={cn('flex justify-center mb-8')} aria-hidden>
              <span className={cn('h-px w-24 bg-[hsl(var(--navy))]/25 relative')}>
                <span className={cn('absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gold text-xs')}>
                  ✦
                </span>
              </span>
            </div>

            {htmlWithIds ? (
              <div
                className={cn('prose-parchment max-w-none')}
                style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
                dangerouslySetInnerHTML={{ __html: htmlWithIds }}
              />
            ) : (
              <div
                className={cn('prose-parchment max-w-none')}
                style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
              >
                {sortedBlocks.map((block) => (
                  <ContentBlockRenderer key={block.id} block={block} />
                ))}
              </div>
            )}
          </article>

          {!prefs.immersiveMode && (
            <ReaderSidebar
              scrollPercentage={scrollPercentage}
              estimatedReadTime={chapter.estimatedReadTime}
              sections={
                sections.length > 0
                  ? sections
                  : [{ id: 'topo', title: chapter.title }]
              }
              tags={story.tags}
              className={cn('lg:sticky lg:top-24 self-start')}
            />
          )}
        </div>
      </div>

      {!prefs.immersiveMode && (
        <ChapterBottomNav
          storyId={storyId}
          previousChapter={previousChapter}
          nextChapter={nextChapter}
          className={cn('mt-8')}
        />
      )}

      <BackToTop />
    </div>
  );
}
