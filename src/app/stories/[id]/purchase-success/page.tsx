/**
 * Página de Sucesso da Compra
 * 
 * Exibida após a confirmação do pagamento.
 * Informa o usuário que o acesso foi liberado
 * e oferece links para começar a leitura.
 */

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { GetStoryUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository, SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter } from '@/domain/entities/Chapter';
import { chapterRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PurchaseSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [firstChapter, setFirstChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const storyRepository = new SupabaseStoryRepository();
        const chapterRepository = new SupabaseChapterRepository();

        const getStory = new GetStoryUseCase(storyRepository);
        const storyData = await getStory.execute(storyId as StoryId);
        setStory(storyData);

        if (storyData) {
          const chapters = await chapterRepository.findByStoryId(storyId as StoryId);
          if (chapters.length > 0) {
            setFirstChapter(chapters[0]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [storyId]);

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center")}>
      <div className={cn("max-w-lg w-full px-4")}>
        <Card className={cn("border-green-500/30")}>
          <CardHeader className={cn("text-center")}>
            <div className={cn("text-5xl mb-4")}>&#10003;</div>
            <CardTitle className={cn("text-2xl text-green-600")}>
              Compra Realizada com Sucesso!
            </CardTitle>
            <CardDescription className={cn("text-base mt-2")}>
              {story
                ? `Seu acesso completo a "${story.title}" foi liberado.`
                : 'Seu acesso foi liberado.'}
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <p className={cn("text-sm text-muted-foreground text-center")}>
              Todos os capítulos estão disponíveis para leitura imediata.
            </p>

            <div className={cn("flex flex-col gap-3")}>
              {firstChapter && (
                <Link href={chapterRoute(storyId, String(firstChapter.id)) as string}>
                  <Button size="lg" className={cn("w-full")}>
                    Começar a Ler
                  </Button>
                </Link>
              )}

              <Link href={`/stories/${storyId}`}>
                <Button variant="outline" className={cn("w-full")}>
                  Ver Todos os Capítulos
                </Button>
              </Link>

              <Link href="/purchases">
                <Button variant="ghost" className={cn("w-full")}>
                  Minhas Compras
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
