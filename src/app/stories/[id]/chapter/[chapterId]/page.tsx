'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GetChapterUseCase } from '@/application/use-cases';
import { SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { SupabaseChapterRenderedRepository } from '@/infrastructure/database/supabase';
import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { Story, StoryId } from '@/domain/entities/Story';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { ContentBlockRenderer } from '@/presentation/components/reader/ContentBlockRenderer';
import { storyRoute, chapterRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        const chapterRepository = new SupabaseChapterRepository();
        const storyRepository = new SupabaseStoryRepository();
        const chapterRenderedRepository = new SupabaseChapterRenderedRepository();
        
        // Tentar carregar versão renderizada primeiro
        console.log('🔍 Buscando versão renderizada para chapterId:', chapterId);
        const rendered = await chapterRenderedRepository.findByChapterId(chapterId as ChapterId);
        if (rendered) {
          console.log('✅ Versão renderizada encontrada! Usando HTML pré-processado.');
          setRenderedHtml(rendered.renderedHtml);
        } else {
          console.log('⚠️ Versão renderizada NÃO encontrada. Usando fallback (renderização on-the-fly).');
        }
        
        // Carregar capítulo (para metadados e navegação)
        const getChapter = new GetChapterUseCase(chapterRepository, storyRepository);
        const chapterData = await getChapter.execute(user, chapterId as ChapterId);
        
        if (!chapterData) {
          setError('Capítulo não encontrado');
          return;
        }

        setChapter(chapterData);
        
        // Se não houver versão renderizada, renderizar on-the-fly (fallback)
        if (!rendered) {
          console.log('🔄 Renderizando on-the-fly como fallback...');
          const { MarkdownRendererService } = await import('@/application/services/MarkdownRendererService');
          const fallbackHtml = MarkdownRendererService.renderWithProse(chapterData.toMarkdown());
          setRenderedHtml(fallbackHtml);
          console.log('✅ Fallback renderizado com sucesso.');
        }

        // Carregar história
        const storyData = await storyRepository.findById(storyId as StoryId);
        setStory(storyData);

        // Carregar todos os capítulos para navegação
        const chaptersList = await chapterRepository.findByStoryId(storyId as StoryId);
        setAllChapters(chaptersList);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar capítulo');
      } finally {
        setLoading(false);
      }
    }

    if (chapterId && storyId) {
      loadChapter();
    }
  }, [chapterId, storyId, user]);

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando capítulo...</p>
      </div>
    );
  }

  if (error || !chapter || !story) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <div className={cn("text-center space-y-4")}>
          <p className={cn("text-destructive")}>{error || 'Capítulo não encontrado'}</p>
          <Button onClick={() => router.push(`/stories/${storyId}`)}>
            Voltar para História
          </Button>
        </div>
      </div>
    );
  }

  // Encontrar capítulo atual e próximos
  const currentIndex = allChapters.findIndex(c => c.id === chapter.id);
  const previousChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  // Ordenar blocos por ordem
  const sortedBlocks = [...chapter.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className={cn("min-h-screen bg-background")}>
      {/* Header */}
      <div className={cn("border-b border-border bg-card")}>
        <div className={cn("container mx-auto px-4 py-4")}>
          <div className={cn("flex items-center justify-between")}>
            <div>
              <Link
                href={storyRoute(String(storyId)) as any}
                className={cn("text-sm text-muted-foreground hover:text-foreground")}
              >
                ← {story.title}
              </Link>
              <h1 className={cn("text-2xl font-bold text-foreground mt-2")}>
                Capítulo {chapter.number}: {chapter.title}
              </h1>
            </div>
            <div className={cn("text-sm text-muted-foreground")}>
              {chapter.wordCount} palavras • {chapter.estimatedReadTime} min
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <article className={cn("container mx-auto px-4 py-8 max-w-4xl")}>
        {renderedHtml ? (
          <div 
            className={cn("prose prose-lg max-w-none dark:prose-invert")}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        ) : (
          <div className={cn("prose prose-lg max-w-none dark:prose-invert")}>
            {sortedBlocks.map((block) => (
              <ContentBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )}
      </article>

      {/* Navegação */}
      <div className={cn("border-t border-border bg-card mt-12")}>
        <div className={cn("container mx-auto px-4 py-6")}>
          <div className={cn("flex items-center justify-between")}>
            {previousChapter ? (
              <Link href={chapterRoute(String(storyId), String(previousChapter.id)) as any}>
                <Button variant="outline">
                  ← Capítulo {previousChapter.number}: {previousChapter.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <Link href={storyRoute(String(storyId)) as any}>
              <Button variant="ghost">Índice</Button>
            </Link>

            {nextChapter ? (
              <Link href={chapterRoute(String(storyId), String(nextChapter.id)) as any}>
                <Button variant="outline">
                  Capítulo {nextChapter.number}: {nextChapter.title} →
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

