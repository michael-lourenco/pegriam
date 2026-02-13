'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GetChapterUseCase } from '@/application/use-cases';
import {
  SupabaseChapterRepository,
  SupabaseStoryRepository,
  SupabaseChapterRenderedRepository,
  SupabasePurchaseRepository,
} from '@/infrastructure/database/supabase';
import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { Story, StoryId } from '@/domain/entities/Story';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { ContentBlockRenderer } from '@/presentation/components/reader/ContentBlockRenderer';
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

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        setAccessDenied(false);

        const chapterRepository = new SupabaseChapterRepository();
        const storyRepository = new SupabaseStoryRepository();
        const chapterRenderedRepository = new SupabaseChapterRenderedRepository();
        const purchaseRepository = new SupabasePurchaseRepository();
        
        // Carregar história primeiro (para info de navegação)
        const storyData = await storyRepository.findById(storyId as StoryId);
        setStory(storyData);

        // Tentar carregar versão renderizada primeiro
        const rendered = await chapterRenderedRepository.findByChapterId(chapterId as ChapterId);
        if (rendered) {
          setRenderedHtml(rendered.renderedHtml);
        }
        
        // Carregar capítulo com verificação de acesso (inclui purchaseRepository)
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
        
        // Se não houver versão renderizada, renderizar on-the-fly (fallback)
        if (!rendered) {
          const { MarkdownRendererService } = await import('@/application/services/MarkdownRendererService');
          const fallbackHtml = MarkdownRendererService.renderWithProse(chapterData.toMarkdown());
          setRenderedHtml(fallbackHtml);
        }

        // Carregar todos os capítulos para navegação
        const chaptersList = await chapterRepository.findByStoryId(storyId as StoryId);
        setAllChapters(chaptersList);
      } catch (err: any) {
        // Verificar se é erro de acesso negado
        if (err.message?.includes('Compre o acesso') || err.message?.includes('não disponível')) {
          setAccessDenied(true);
        } else {
          setError(err.message || 'Erro ao carregar capítulo');
        }
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

  // Acesso negado: mostrar CTA de compra
  if (accessDenied) {
    return (
      <div className={cn("min-h-screen bg-background flex items-center justify-center")}>
        <div className={cn("max-w-md w-full px-4")}>
          <Card className={cn("border-primary/20")}>
            <CardHeader className={cn("text-center")}>
              <div className={cn("text-4xl mb-2")}>🔒</div>
              <CardTitle>Capítulo Bloqueado</CardTitle>
              <CardDescription>
                Este capítulo faz parte do conteúdo pago.
                Compre o acesso completo à história para continuar lendo.
              </CardDescription>
            </CardHeader>
            <CardContent className={cn("space-y-3")}>
              {user ? (
                <Link href={`/stories/${storyId}/checkout`}>
                  <Button size="lg" className={cn("w-full")}>
                    Comprar Acesso Completo
                  </Button>
                </Link>
              ) : (
                <Link href={`/login?redirect=/stories/${storyId}`}>
                  <Button size="lg" className={cn("w-full")}>
                    Entrar para Comprar
                  </Button>
                </Link>
              )}
              <Link href={`/stories/${storyId}`}>
                <Button variant="outline" className={cn("w-full")}>
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
                href={storyRoute(String(storyId)) as string}
                className={cn("text-sm text-muted-foreground hover:text-foreground")}
              >
                &larr; {story.title}
              </Link>
              <h1 className={cn("text-2xl font-bold text-foreground mt-2")}>
                Capítulo {chapter.number}: {chapter.title}
              </h1>
            </div>
            <div className={cn("text-sm text-muted-foreground")}>
              {chapter.wordCount} palavras &bull; {chapter.estimatedReadTime} min
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
              <Link href={chapterRoute(String(storyId), String(previousChapter.id)) as string}>
                <Button variant="outline">
                  &larr; Capítulo {previousChapter.number}: {previousChapter.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <Link href={storyRoute(String(storyId)) as string}>
              <Button variant="ghost">Índice</Button>
            </Link>

            {nextChapter ? (
              <Link href={chapterRoute(String(storyId), String(nextChapter.id)) as string}>
                <Button variant="outline">
                  Capítulo {nextChapter.number}: {nextChapter.title} &rarr;
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
