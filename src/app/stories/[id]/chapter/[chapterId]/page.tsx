'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
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
import { Breadcrumbs } from '@/presentation/components/shared/Breadcrumbs';
import { useReadingPreferences } from '@/shared/hooks/useReadingPreferences';
import { useReadingProgress } from '@/shared/hooks/useReadingProgress';
import { storyRoute, chapterRoute } from '@/shared/utils/routes';
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

  const {
    scrollPercentage,
    restoreProgress,
  } = useReadingProgress(storyId, chapterId);

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        setAccessDenied(false);

        const { chapterRepository, storyRepository, chapterRenderedRepository, purchaseRepository } = Container.getRepositories();

        const storyData = await storyRepository.findById(storyId as StoryId);
        setStory(storyData);

        const rendered = await chapterRenderedRepository.findByChapterId(chapterId as ChapterId);
        if (rendered) setRenderedHtml(rendered.renderedHtml);

        const getChapter = new GetChapterUseCase(chapterRepository, storyRepository, purchaseRepository);
        const chapterData = await getChapter.execute(user, chapterId as ChapterId);

        if (!chapterData) {
          setError('Capitulo nao encontrado');
          return;
        }

        setChapter(chapterData);

        if (!rendered) {
          const { MarkdownRendererService } = await import('@/application/services/MarkdownRendererService');
          const fallbackHtml = MarkdownRendererService.renderWithProse(chapterData.toMarkdown());
          setRenderedHtml(fallbackHtml);
        }

        const chaptersList = await chapterRepository.findByStoryId(storyId as StoryId);
        setAllChapters(chaptersList);
      } catch (err: any) {
        if (err.message?.includes('Compre o acesso') || err.message?.includes('nao disponivel')) {
          setAccessDenied(true);
        } else {
          setError(err.message || 'Erro ao carregar capitulo');
        }
      } finally {
        setLoading(false);
      }
    }

    if (chapterId && storyId) loadChapter();
  }, [chapterId, storyId, user]);

  // Restore reading position after content loads
  useEffect(() => {
    if (!loading && chapter) {
      const timer = setTimeout(() => restoreProgress(), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, chapter, restoreProgress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Carregando capitulo...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full px-4">
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="text-4xl mb-2">&#128274;</div>
              <CardTitle>Capitulo Bloqueado</CardTitle>
              <CardDescription>
                Este capitulo faz parte do conteudo pago. Compre o acesso completo a historia para continuar lendo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user ? (
                <Link href={`/stories/${storyId}/checkout`}>
                  <Button size="lg" className="w-full">Comprar Acesso Completo</Button>
                </Link>
              ) : (
                <Link href={`/login?redirect=/stories/${storyId}`}>
                  <Button size="lg" className="w-full">Entrar para Comprar</Button>
                </Link>
              )}
              <Link href={`/stories/${storyId}`}>
                <Button variant="outline" className="w-full">Voltar para a Historia</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !chapter || !story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error || 'Capitulo nao encontrado'}</p>
          <Button onClick={() => router.push(`/stories/${storyId}`)}>Voltar para Historia</Button>
        </div>
      </div>
    );
  }

  const currentIndex = allChapters.findIndex(c => c.id === chapter.id);
  const previousChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;
  const sortedBlocks = [...chapter.blocks].sort((a, b) => a.order - b.order);

  const fontFamilyClass = prefs.fontFamily === 'serif' ? 'font-[family-name:var(--font-merriweather)]' : '';

  return (
    <div className={cn("min-h-screen bg-background", prefs.immersiveMode && "fixed inset-0 z-50 overflow-auto")}>
      <ScrollProgress percentage={scrollPercentage} />

      {/* Header — hidden in immersive */}
      {!prefs.immersiveMode && (
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <Breadcrumbs
              items={[
                { label: 'Historias', href: '/stories' },
                { label: story.title, href: storyRoute(String(storyId)) },
                { label: `Cap. ${chapter.number}: ${chapter.title}` },
              ]}
              className="mb-3"
            />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mt-1">
                  Capitulo {chapter.number}: {chapter.title}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {chapter.wordCount} palavras &bull; {chapter.estimatedReadTime} min
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowToolbar(!showToolbar)}
                  aria-label="Configuracoes de leitura"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
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
                className="mt-3"
              />
            )}
          </div>
        </div>
      )}

      {/* Immersive mode exit button */}
      {prefs.immersiveMode && (
        <div className="fixed top-4 right-4 z-[60]">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleImmersiveMode}
            className="bg-card/90 backdrop-blur-sm"
          >
            Sair Imersivo
          </Button>
        </div>
      )}

      {/* Content */}
      <article
        className={cn("container mx-auto px-4 py-8 max-w-4xl", fontFamilyClass)}
        style={{ fontSize: `${prefs.fontSize}px`, lineHeight: prefs.lineHeight }}
      >
        {renderedHtml ? (
          <div
            className="prose prose-lg max-w-none dark:prose-invert"
            style={{ fontSize: 'inherit', lineHeight: 'inherit' }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : (
          <div className="prose prose-lg max-w-none dark:prose-invert" style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
            {sortedBlocks.map((block) => (
              <ContentBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )}
      </article>

      {/* Chapter navigation */}
      <div className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {previousChapter ? (
              <Link href={chapterRoute(String(storyId), String(previousChapter.id)) as string}>
                <Button variant="outline" className="max-w-[200px]">
                  <span className="truncate">&larr; Cap. {previousChapter.number}: {previousChapter.title}</span>
                </Button>
              </Link>
            ) : <div />}

            <Link href={storyRoute(String(storyId)) as string}>
              <Button variant="ghost">Indice</Button>
            </Link>

            {nextChapter ? (
              <Link href={chapterRoute(String(storyId), String(nextChapter.id)) as string}>
                <Button variant="outline" className="max-w-[200px]">
                  <span className="truncate">Cap. {nextChapter.number}: {nextChapter.title} &rarr;</span>
                </Button>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
