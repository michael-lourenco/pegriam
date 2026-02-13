/**
 * Página: Minhas Compras
 * 
 * Lista todas as compras do usuário autenticado,
 * com status e links para as histórias adquiridas.
 */

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { GetUserPurchasesUseCase, GetStoryUseCase } from '@/application/use-cases';
import { SupabasePurchaseRepository, SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { Purchase } from '@/domain/entities/Purchase';
import { Story, StoryId } from '@/domain/entities/Story';
import { storyRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCover } from '@/presentation/components/shared/BookCover';

interface PurchaseWithStory {
  purchase: Purchase;
  story: Story | null;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    confirmed: {
      label: 'Confirmado',
      className: 'bg-green-500/10 text-green-600',
    },
    pending: {
      label: 'Pendente',
      className: 'bg-yellow-500/10 text-yellow-600',
    },
    failed: {
      label: 'Falhou',
      className: 'bg-destructive/10 text-destructive',
    },
    refunded: {
      label: 'Reembolsado',
      className: 'bg-muted text-muted-foreground',
    },
  };

  const { label, className } = config[status] ?? config.pending;

  return (
    <span className={cn("text-xs px-2 py-1 rounded font-medium", className)}>
      {label}
    </span>
  );
}

function PurchaseItem({ purchase, story }: PurchaseWithStory) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow")}>
      <CardContent className={cn("p-4")}>
        <div className={cn("flex gap-4")}>
          {story && (
            <BookCover
              src={story.coverImage}
              alt={story.title}
              size="sm"
              className={cn("shadow-sm flex-shrink-0")}
            />
          )}
          <div className={cn("flex-1 min-w-0")}>
            <div className={cn("flex items-start justify-between gap-2")}>
              <div>
                <h3 className={cn("font-semibold text-foreground truncate")}>
                  {story?.title ?? 'História não encontrada'}
                </h3>
                {story && (
                  <p className={cn("text-sm text-muted-foreground mt-1")}>
                    por {story.author}
                  </p>
                )}
              </div>
              <StatusBadge status={purchase.status} />
            </div>

            <div className={cn("flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground")}>
              <span>Valor: {formatPrice(purchase.amount)}</span>
              <span>Data: {formatDate(purchase.createdAt)}</span>
              {purchase.confirmedAt && (
                <span>Confirmado: {formatDate(purchase.confirmedAt)}</span>
              )}
            </div>

            {story && purchase.isAccessGranted() && (
              <div className={cn("mt-3")}>
                <Link href={storyRoute(String(story.id)) as string}>
                  <Button size="sm" variant="outline">
                    Ler História
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PurchasesPage() {
  const { user, loading: authLoading } = useRequireAuth({
    redirectTo: '/login?redirect=/purchases',
  });

  const [purchasesWithStories, setPurchasesWithStories] = useState<PurchaseWithStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    async function loadPurchases() {
      try {
        const purchaseRepository = new SupabasePurchaseRepository();
        const storyRepository = new SupabaseStoryRepository();

        const getUserPurchases = new GetUserPurchasesUseCase(purchaseRepository);
        const purchases = await getUserPurchases.execute(user!.id);

        // Carregar dados das histórias para cada compra
        const getStory = new GetStoryUseCase(storyRepository);
        const withStories: PurchaseWithStory[] = await Promise.all(
          purchases.map(async (purchase) => {
            try {
              const story = await getStory.execute(purchase.storyId);
              return { purchase, story };
            } catch {
              return { purchase, story: null };
            }
          })
        );

        setPurchasesWithStories(withStories);
      } catch (error) {
        console.error('Erro ao carregar compras:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPurchases();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado
  }

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando compras...</p>
      </div>
    );
  }

  const confirmedPurchases = purchasesWithStories.filter(
    (p) => p.purchase.status === 'confirmed'
  );
  const otherPurchases = purchasesWithStories.filter(
    (p) => p.purchase.status !== 'confirmed'
  );

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8 max-w-3xl")}>
        <div className={cn("mb-8")}>
          <h1 className={cn("text-3xl font-bold text-foreground mb-2")}>
            Minhas Compras
          </h1>
          <p className={cn("text-muted-foreground")}>
            Histórias que você adquiriu acesso completo
          </p>
        </div>

        {purchasesWithStories.length === 0 ? (
          <Card>
            <CardContent className={cn("py-12 text-center")}>
              <p className={cn("text-muted-foreground text-lg mb-4")}>
                Você ainda não realizou nenhuma compra.
              </p>
              <Link href="/stories">
                <Button>Explorar Histórias</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className={cn("space-y-8")}>
            {/* Compras confirmadas */}
            {confirmedPurchases.length > 0 && (
              <section>
                <h2 className={cn("text-xl font-semibold text-foreground mb-4")}>
                  Histórias Adquiridas ({confirmedPurchases.length})
                </h2>
                <div className={cn("space-y-3")}>
                  {confirmedPurchases.map(({ purchase, story }) => (
                    <PurchaseItem
                      key={purchase.id}
                      purchase={purchase}
                      story={story}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Outras compras (pendentes, falhas, reembolsadas) */}
            {otherPurchases.length > 0 && (
              <section>
                <h2 className={cn("text-xl font-semibold text-foreground mb-4")}>
                  Outras Transações
                </h2>
                <div className={cn("space-y-3")}>
                  {otherPurchases.map(({ purchase, story }) => (
                    <PurchaseItem
                      key={purchase.id}
                      purchase={purchase}
                      story={story}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
