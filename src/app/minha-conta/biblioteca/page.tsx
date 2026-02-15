/**
 * Página: Minha Biblioteca
 * 
 * Exibe as histórias adquiridas pelo usuário com links diretos
 * para leitura. Mostra separadamente: adquiridas, pendentes e outras.
 */

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { GetUserPurchasesUseCase, GetStoryUseCase } from '@/application/use-cases';
import { SupabasePurchaseRepository, SupabaseStoryRepository, SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { Purchase } from '@/domain/entities/Purchase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter } from '@/domain/entities/Chapter';
import { storyRoute, chapterRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCover } from '@/presentation/components/shared/BookCover';

interface LibraryItem {
  purchase: Purchase;
  story: Story | null;
  firstChapter: Chapter | null;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function LibraryCard({ item }: { item: LibraryItem }) {
  const { purchase, story, firstChapter } = item;

  if (!story) return null;

  return (
    <Card className={cn("hover:shadow-md transition-shadow")}>
      <CardContent className={cn("p-5")}>
        <div className={cn("flex gap-5")}>
          <BookCover
            src={story.coverImage}
            alt={story.title}
            size="sm"
            className={cn("shadow-sm flex-shrink-0")}
          />
          <div className={cn("flex-1 min-w-0")}>
            <Link href={storyRoute(String(story.id)) as string}>
              <h3 className={cn("font-semibold text-foreground hover:text-primary transition-colors truncate")}>
                {story.title}
              </h3>
            </Link>
            <p className={cn("text-sm text-muted-foreground mt-1")}>
              por {story.author}
            </p>
            <p className={cn("text-xs text-muted-foreground mt-2")}>
              {story.metadata.totalChapters} capítulos &bull; {story.metadata.estimatedReadTime} min de leitura
            </p>
            <p className={cn("text-xs text-muted-foreground")}>
              Adquirido em {purchase.confirmedAt ? formatDate(purchase.confirmedAt) : formatDate(purchase.createdAt)}
            </p>

            <div className={cn("flex gap-2 mt-3")}>
              {firstChapter ? (
                <Link href={chapterRoute(String(story.id), String(firstChapter.id)) as string}>
                  <Button size="sm">Começar a Ler</Button>
                </Link>
              ) : (
                <Link href={storyRoute(String(story.id)) as string}>
                  <Button size="sm">Ver Capítulos</Button>
                </Link>
              )}
              <Link href={storyRoute(String(story.id)) as string}>
                <Button size="sm" variant="outline">Detalhes</Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BibliotecaPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadLibrary() {
      try {
        const purchaseRepository = new SupabasePurchaseRepository();
        const storyRepository = new SupabaseStoryRepository();
        const chapterRepository = new SupabaseChapterRepository();

        const getUserPurchases = new GetUserPurchasesUseCase(purchaseRepository);
        const purchases = await getUserPurchases.execute(user!.id);

        const getStory = new GetStoryUseCase(storyRepository);
        const libraryItems: LibraryItem[] = await Promise.all(
          purchases.map(async (purchase) => {
            try {
              const story = await getStory.execute(purchase.storyId);
              let firstChapter: Chapter | null = null;

              if (story) {
                const chapters = await chapterRepository.findByStoryId(purchase.storyId);
                if (chapters.length > 0) {
                  firstChapter = chapters[0];
                }
              }

              return { purchase, story, firstChapter };
            } catch {
              return { purchase, story: null, firstChapter: null };
            }
          })
        );

        setItems(libraryItems);
      } catch (error) {
        console.error('Erro ao carregar biblioteca:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLibrary();
  }, [user]);

  if (!user) return null;

  const confirmed = items.filter((i) => i.purchase.status === 'confirmed');
  const pending = items.filter((i) => i.purchase.status === 'pending');

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-12")}>
        <p className={cn("text-muted-foreground")}>Carregando biblioteca...</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8")}>
      <div>
        <h1 className={cn("text-3xl font-bold text-foreground")}>Minha Biblioteca</h1>
        <p className={cn("text-muted-foreground mt-1")}>
          Histórias que você adquiriu acesso completo.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className={cn("py-12 text-center")}>
            <p className={cn("text-muted-foreground text-lg mb-4")}>
              Sua biblioteca está vazia.
            </p>
            <p className={cn("text-sm text-muted-foreground mb-6")}>
              Explore o catálogo e adquira histórias para lê-las a qualquer momento.
            </p>
            <Link href="/stories">
              <Button>Explorar Histórias</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Histórias adquiridas */}
          {confirmed.length > 0 && (
            <section>
              <h2 className={cn("text-xl font-semibold text-foreground mb-4")}>
                Disponíveis para Leitura ({confirmed.length})
              </h2>
              <div className={cn("space-y-3")}>
                {confirmed.map((item) => (
                  <LibraryCard key={item.purchase.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Compras pendentes */}
          {pending.length > 0 && (
            <section>
              <h2 className={cn("text-xl font-semibold text-foreground mb-4")}>
                Aguardando Confirmação ({pending.length})
              </h2>
              <div className={cn("space-y-3")}>
                {pending.map((item) => (
                  <Card key={item.purchase.id} className={cn("opacity-70")}>
                    <CardContent className={cn("p-5")}>
                      <div className={cn("flex items-center gap-4")}>
                        {item.story && (
                          <BookCover
                            src={item.story.coverImage}
                            alt={item.story.title}
                            size="sm"
                            className={cn("flex-shrink-0")}
                          />
                        )}
                        <div>
                          <h3 className={cn("font-semibold text-foreground")}>
                            {item.story?.title ?? 'História'}
                          </h3>
                          <p className={cn("text-sm text-yellow-600 mt-1")}>
                            Pagamento pendente
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
