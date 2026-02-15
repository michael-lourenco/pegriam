/**
 * Página: Minha Conta — Visão Geral
 * 
 * Dashboard do usuário com resumo da conta,
 * estatísticas de leitura e atalhos rápidos.
 */

'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { GetUserPurchasesUseCase } from '@/application/use-cases';
import { SupabasePurchaseRepository } from '@/infrastructure/database/supabase';
import { Purchase } from '@/domain/entities/Purchase';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default function AccountOverviewPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      try {
        const purchaseRepository = new SupabasePurchaseRepository();
        const getUserPurchases = new GetUserPurchasesUseCase(purchaseRepository);
        const result = await getUserPurchases.execute(user!.id);
        setPurchases(result);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (!user) return null;

  const confirmedCount = purchases.filter((p) => p.status === 'confirmed').length;
  const pendingCount = purchases.filter((p) => p.status === 'pending').length;

  return (
    <div className={cn("space-y-8")}>
      {/* Saudação */}
      <div>
        <h1 className={cn("text-3xl font-bold text-foreground")}>
          Olá, {user.name || 'Leitor'}!
        </h1>
        <p className={cn("text-muted-foreground mt-1")}>
          Bem-vindo à sua área pessoal no Contos de Pegriam.
        </p>
      </div>

      {/* Estatísticas */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4")}>
        <Card>
          <CardHeader className={cn("pb-2")}>
            <CardDescription>Histórias Adquiridas</CardDescription>
            <CardTitle className={cn("text-3xl")}>
              {loading ? '...' : confirmedCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className={cn("pb-2")}>
            <CardDescription>Compras Pendentes</CardDescription>
            <CardTitle className={cn("text-3xl text-yellow-600")}>
              {loading ? '...' : pendingCount}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className={cn("pb-2")}>
            <CardDescription>Membro desde</CardDescription>
            <CardTitle className={cn("text-lg")}>
              {formatDate(new Date())}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Atalhos */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4")}>
        <Card className={cn("hover:shadow-md transition-shadow")}>
          <CardHeader>
            <CardTitle className={cn("text-lg")}>Minha Biblioteca</CardTitle>
            <CardDescription>
              Acesse suas histórias adquiridas e continue a leitura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/minha-conta/biblioteca">
              <Button variant="outline" className={cn("w-full")}>
                Ver Biblioteca
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className={cn("hover:shadow-md transition-shadow")}>
          <CardHeader>
            <CardTitle className={cn("text-lg")}>Configurações</CardTitle>
            <CardDescription>
              Gerencie seu perfil e preferências da conta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/minha-conta/configuracoes">
              <Button variant="outline" className={cn("w-full")}>
                Editar Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* CTA para explorar */}
      {confirmedCount === 0 && !loading && (
        <Card className={cn("bg-muted/50 border-dashed")}>
          <CardContent className={cn("py-8 text-center")}>
            <p className={cn("text-muted-foreground mb-4")}>
              Você ainda não adquiriu nenhuma história. Explore o catálogo e comece a ler!
            </p>
            <Link href="/stories">
              <Button>Explorar Histórias</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
