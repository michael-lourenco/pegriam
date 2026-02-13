/**
 * Componente: PurchaseCard
 * 
 * Card contextual de compra exibido na página de detalhes da história.
 * Mostra informações e ações diferentes baseado no estado de acesso:
 * - Sem acesso + não logado: incentiva login
 * - Sem acesso + logado: mostra preço e botão de compra
 * - Com acesso (compra): confirmação de acesso liberado
 * - Com acesso (admin): badge de admin
 */

'use client';

import Link from 'next/link';
import { Story } from '@/domain/entities/Story';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PurchaseCardProps {
  story: Story;
  hasAccess: boolean;
  accessReason: string;
  isAuthenticated: boolean;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

function AccessGrantedCard({ accessReason }: { accessReason: string }) {
  return (
    <Card className={cn("border-green-500/30 bg-green-500/5")}>
      <CardHeader>
        <CardTitle className={cn("text-lg text-green-600")}>
          Acesso Completo Liberado
        </CardTitle>
        <CardDescription>
          {accessReason === 'admin'
            ? 'Você tem acesso administrativo a todo o conteúdo.'
            : 'Você já possui acesso completo a todos os capítulos desta história.'}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function UnauthenticatedCard({ story }: { story: Story }) {
  return (
    <Card className={cn("border-primary/20 bg-primary/5")}>
      <CardHeader>
        <CardTitle className={cn("text-lg")}>
          Acesso Completo por {formatPrice(story.pdfPrice)}
        </CardTitle>
        <CardDescription>
          Faça login ou crie uma conta para comprar acesso a todos os capítulos desta história.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("flex items-center gap-3")}>
          <Link href={`/login?redirect=/stories/${story.id}`}>
            <Button>Entrar para Comprar</Button>
          </Link>
          <Link href={`/signup?redirect=/stories/${story.id}`}>
            <Button variant="outline">Criar Conta</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function PurchaseActionCard({ story }: { story: Story }) {
  return (
    <Card className={cn("border-primary/20 bg-primary/5")}>
      <CardHeader>
        <CardTitle className={cn("text-lg")}>
          Acesso Completo por {formatPrice(story.pdfPrice)}
        </CardTitle>
        <CardDescription>
          Desbloqueie todos os capítulos desta história com um único pagamento.
          {story.freeChapters > 0 && (
            <> Os primeiros {story.freeChapters} capítulos são gratuitos para leitura.</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/stories/${story.id}/checkout`}>
          <Button size="lg">Comprar Acesso Completo</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function PurchaseCard({ story, hasAccess, accessReason, isAuthenticated }: PurchaseCardProps) {
  if (hasAccess) {
    return <AccessGrantedCard accessReason={accessReason} />;
  }

  if (!isAuthenticated) {
    return <UnauthenticatedCard story={story} />;
  }

  return <PurchaseActionCard story={story} />;
}
