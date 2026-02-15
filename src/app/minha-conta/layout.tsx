/**
 * Layout: Área do Usuário
 * 
 * Layout compartilhado entre todas as sub-páginas de /minha-conta.
 * Exibe navegação lateral e protege o acesso a usuários autenticados.
 */

'use client';

import { useRequireAuth } from '@/shared/hooks/useRequireAuth';
import { AccountNav } from '@/presentation/components/shared/AccountNav';
import { cn } from '@/lib/utils';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAuth({
    redirectTo: '/login?redirect=/minha-conta',
  });

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Verificando autenticação...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8")}>
        <div className={cn("flex flex-col md:flex-row gap-8")}>
          {/* Sidebar */}
          <aside className={cn("w-full md:w-56 flex-shrink-0")}>
            <h2 className={cn("text-lg font-semibold text-foreground mb-4 px-4")}>
              Minha Conta
            </h2>
            <AccountNav />
          </aside>

          {/* Conteúdo */}
          <main className={cn("flex-1 min-w-0")}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
