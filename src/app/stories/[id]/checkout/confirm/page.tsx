/**
 * Página de Confirmação de Pagamento (Mock)
 * 
 * Simula a confirmação do pagamento pelo provider.
 * No fluxo real (Stripe), esta página não existiria — o Stripe
 * redirecionaria diretamente para a purchase-success após o checkout.
 * 
 * Fluxo mockado:
 * 1. Usuário chega aqui com external_id e purchase_id na URL
 * 2. Clica em "Confirmar Pagamento"
 * 3. Chama o webhook local para confirmar
 * 4. Redireciona para a página de sucesso
 */

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ConfirmPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const storyId = params.id as string;

  const externalId = searchParams.get('external_id');
  const purchaseId = searchParams.get('purchase_id');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmPayment() {
    if (!externalId) {
      setError('ID do pagamento não encontrado');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Chamar webhook local para confirmar o pagamento
      const response = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ external_id: externalId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao confirmar pagamento');
      }

      // Redirecionar para página de sucesso
      router.push(`/stories/${storyId}/purchase-success`);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar confirmação');
    } finally {
      setProcessing(false);
    }
  }

  if (!externalId || !purchaseId) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <div className={cn("text-center space-y-4")}>
          <p className={cn("text-destructive")}>Dados de pagamento inválidos</p>
          <Button onClick={() => router.push(`/stories/${storyId}`)}>
            Voltar para a História
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center")}>
      <div className={cn("max-w-md w-full px-4")}>
        <Card>
          <CardHeader className={cn("text-center")}>
            <CardTitle>Confirmação de Pagamento</CardTitle>
            <CardDescription>
              Simulação do gateway de pagamento.
              Em produção, esta etapa será processada pelo Stripe.
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("space-y-4")}>
            <div className={cn("bg-muted rounded-lg p-4 text-sm space-y-2")}>
              <div className={cn("flex justify-between")}>
                <span className={cn("text-muted-foreground")}>ID do Pagamento</span>
                <span className={cn("font-mono text-xs")}>{externalId.slice(0, 20)}...</span>
              </div>
              <div className={cn("flex justify-between")}>
                <span className={cn("text-muted-foreground")}>Status</span>
                <span className={cn("text-yellow-600 font-medium")}>Pendente</span>
              </div>
            </div>

            {error && (
              <p className={cn("text-sm text-destructive text-center")}>{error}</p>
            )}

            <Button
              size="lg"
              className={cn("w-full")}
              onClick={handleConfirmPayment}
              disabled={processing}
            >
              {processing ? 'Confirmando...' : 'Confirmar Pagamento (Mock)'}
            </Button>

            <Button
              variant="ghost"
              className={cn("w-full")}
              onClick={() => router.push(`/stories/${storyId}`)}
              disabled={processing}
            >
              Cancelar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
