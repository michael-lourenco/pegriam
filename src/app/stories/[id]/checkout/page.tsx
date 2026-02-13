/**
 * Página de Checkout
 * 
 * Resumo da compra e início do fluxo de pagamento.
 * Cria a Purchase e redireciona para a confirmação do pagamento.
 */

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { GetStoryUseCase, CreatePurchaseUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository, SupabasePurchaseRepository } from '@/infrastructure/database/supabase';
import { MockPaymentService } from '@/infrastructure/payment/MockPaymentService';
import { Story, StoryId } from '@/domain/entities/Story';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCover } from '@/presentation/components/shared/BookCover';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/stories/${storyId}/checkout`);
    }
  }, [user, authLoading, storyId, router]);

  // Carregar dados da história
  useEffect(() => {
    async function loadStory() {
      try {
        const storyRepository = new SupabaseStoryRepository();
        const getStory = new GetStoryUseCase(storyRepository);
        const storyData = await getStory.execute(storyId as StoryId);

        if (!storyData) {
          setError('História não encontrada');
          return;
        }

        if (storyData.pdfPrice <= 0) {
          setError('Esta história é gratuita');
          return;
        }

        setStory(storyData);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }

    if (storyId) {
      loadStory();
    }
  }, [storyId]);

  async function handlePurchase() {
    if (!user || !story) return;

    try {
      setProcessing(true);
      setError(null);

      const purchaseRepository = new SupabasePurchaseRepository();
      const storyRepository = new SupabaseStoryRepository();
      const paymentService = new MockPaymentService();

      const createPurchase = new CreatePurchaseUseCase(
        purchaseRepository,
        storyRepository,
        paymentService
      );

      const result = await createPurchase.execute({
        userId: user.id,
        storyId: storyId as StoryId,
      });

      // Redirecionar para a página de confirmação do mock
      router.push(result.checkoutUrl);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar compra');
    } finally {
      setProcessing(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando...</p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <div className={cn("text-center space-y-4")}>
          <p className={cn("text-destructive")}>{error || 'Erro inesperado'}</p>
          <Button onClick={() => router.push(`/stories/${storyId}`)}>
            Voltar para a História
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8 max-w-2xl")}>
        <Button
          variant="ghost"
          onClick={() => router.push(`/stories/${storyId}`)}
          className={cn("mb-6")}
        >
          &larr; Voltar para a História
        </Button>

        <h1 className={cn("text-3xl font-bold text-foreground mb-8")}>
          Finalizar Compra
        </h1>

        {/* Resumo da Compra */}
        <Card className={cn("mb-6")}>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("flex gap-6")}>
              <BookCover
                src={story.coverImage}
                alt={story.title}
                size="sm"
                className={cn("shadow-md flex-shrink-0")}
              />
              <div className={cn("flex-1")}>
                <h3 className={cn("font-semibold text-foreground text-lg")}>
                  {story.title}
                </h3>
                <p className={cn("text-sm text-muted-foreground mt-1")}>
                  por {story.author}
                </p>
                <p className={cn("text-sm text-muted-foreground mt-2")}>
                  {story.metadata.totalChapters} capítulos &bull; {story.metadata.estimatedReadTime} min de leitura
                </p>
                <p className={cn("text-sm text-muted-foreground mt-1")}>
                  Acesso completo a todos os capítulos
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className={cn("flex items-center justify-between border-t pt-6")}>
            <span className={cn("text-lg font-semibold text-foreground")}>Total</span>
            <span className={cn("text-2xl font-bold text-primary")}>
              {formatPrice(story.pdfPrice)}
            </span>
          </CardFooter>
        </Card>

        {/* Informações do Comprador */}
        <Card className={cn("mb-6")}>
          <CardHeader>
            <CardTitle className={cn("text-base")}>Comprador</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn("text-sm text-muted-foreground")}>
              {user?.name || user?.email.getValue()}
            </p>
            <p className={cn("text-xs text-muted-foreground mt-1")}>
              {user?.email.getValue()}
            </p>
          </CardContent>
        </Card>

        {/* Botão de Compra */}
        <Button
          size="lg"
          className={cn("w-full")}
          onClick={handlePurchase}
          disabled={processing}
        >
          {processing ? 'Processando...' : `Pagar ${formatPrice(story.pdfPrice)}`}
        </Button>

        <p className={cn("text-xs text-muted-foreground text-center mt-4")}>
          Ao clicar em &quot;Pagar&quot;, você será redirecionado para o processamento seguro do pagamento.
        </p>
      </div>
    </div>
  );
}
