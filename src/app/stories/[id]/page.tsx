'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GetStoryUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter } from '@/domain/entities/Chapter';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { useStoryAccess } from '@/shared/hooks/useStoryAccess';
import { chapterRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';
import { PurchaseCard } from '@/presentation/components/purchase/PurchaseCard';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const storyId = params.id as string;
  
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { hasFullAccess, reason: accessReason, loading: accessLoading } = useStoryAccess(
    storyId,
    story?.pdfPrice ?? 0
  );

  useEffect(() => {
    async function loadStory() {
      try {
        setLoading(true);
        const storyRepository = new SupabaseStoryRepository();
        const chapterRepository = new SupabaseChapterRepository();
        
        const getStory = new GetStoryUseCase(storyRepository);
        const storyData = await getStory.execute(storyId as StoryId);
        
        if (!storyData) {
          setError('História não encontrada');
          return;
        }

        setStory(storyData);
        
        // Carregar capítulos
        const chaptersList = await chapterRepository.findByStoryId(storyId as StoryId);
        setChapters(chaptersList);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar história');
      } finally {
        setLoading(false);
      }
    }

    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando história...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <div className={cn("text-center space-y-4")}>
          <p className={cn("text-destructive")}>{error || 'História não encontrada'}</p>
          <Button onClick={() => router.push('/stories')}>Voltar para Histórias</Button>
        </div>
      </div>
    );
  }

  const hasPaidContent = story.pdfPrice > 0;

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8")}>
        <Button
          variant="ghost"
          onClick={() => router.push('/stories')}
          className={cn("mb-6")}
        >
          &larr; Voltar para Histórias
        </Button>

        {/* Cabeçalho da História */}
        <div className={cn("mb-8")}>
          <h1 className={cn("text-4xl md:text-5xl font-bold text-foreground mb-4")}>
            {story.title}
          </h1>
          
          <div className={cn("flex flex-wrap gap-2 mb-4")}>
            {story.tags.map((tag) => (
              <span
                key={tag}
                className={cn("text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground")}
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className={cn("flex flex-wrap gap-4 text-sm text-muted-foreground mb-6")}>
            <span>Autor: <strong>{story.author}</strong></span>
            <span>{story.metadata.totalChapters} capítulos</span>
            <span>{story.metadata.estimatedReadTime} min de leitura</span>
            {story.freeChapters > 0 && (
              <span>{story.freeChapters} capítulos gratuitos</span>
            )}
          </div>
          
          <p className={cn("text-lg text-muted-foreground")}>
            {story.description}
          </p>
        </div>

        {/* Imagem de Capa — proporção 16:9, largura total do container */}
        <div className={cn("mb-12 w-full")}>
          <FeaturedCover
            src={story.coverImage}
            alt={story.title}
            className={cn("rounded-lg shadow-lg")}
          />
        </div>

        {/* Card de Compra — só aparece quando há conteúdo pago e o usuário não tem acesso */}
        {hasPaidContent && !accessLoading && (
          <div className={cn("mb-8")}>
            <PurchaseCard
              story={story}
              hasAccess={hasFullAccess}
              accessReason={accessReason}
              isAuthenticated={!!user}
            />
          </div>
        )}

        {/* Seção de Capítulos */}
        <div className={cn("mb-8")}>
          <h2 className={cn("text-2xl font-bold text-foreground mb-4")}>
            Capítulos
          </h2>
          
          {chapters.length === 0 ? (
            <p className={cn("text-muted-foreground")}>
              Nenhum capítulo disponível ainda.
            </p>
          ) : (
            <div className={cn("space-y-2")}>
              {chapters.map((chapter) => {
                const isAccessible = chapter.isFree || hasFullAccess;
                
                return (
                  <ChapterListItem
                    key={chapter.id}
                    chapter={chapter}
                    storyId={storyId}
                    isAccessible={isAccessible}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Item da lista de capítulos com indicação visual de acesso
 */
function ChapterListItem({
  chapter,
  storyId,
  isAccessible,
}: {
  chapter: Chapter;
  storyId: string;
  isAccessible: boolean;
}) {
  const content = (
    <Card className={cn(
      "transition-shadow",
      isAccessible
        ? "hover:shadow-md cursor-pointer"
        : "opacity-75"
    )}>
      <CardContent className={cn("p-4")}>
        <div className={cn("flex items-center justify-between")}>
          <div>
            <h3 className={cn("font-semibold text-foreground")}>
              Capítulo {chapter.number}: {chapter.title}
            </h3>
            <p className={cn("text-sm text-muted-foreground mt-1")}>
              {chapter.wordCount} palavras &bull; {chapter.estimatedReadTime} min
            </p>
          </div>
          <div className={cn("flex items-center gap-2")}>
            {chapter.isFree ? (
              <span className={cn("text-xs px-2 py-1 rounded bg-primary/10 text-primary")}>
                Grátis
              </span>
            ) : !isAccessible ? (
              <span className={cn("text-xs px-2 py-1 rounded bg-muted text-muted-foreground")}>
                🔒 Pago
              </span>
            ) : (
              <span className={cn("text-xs px-2 py-1 rounded bg-green-500/10 text-green-600")}>
                Liberado
              </span>
            )}
            {isAccessible && (
              <span className={cn("text-muted-foreground")}>&rarr;</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isAccessible) {
    return (
      <Link href={chapterRoute(storyId, String(chapter.id)) as string}>
        {content}
      </Link>
    );
  }

  return content;
}
