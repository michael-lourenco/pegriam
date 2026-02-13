/**
 * Componente: HeroSection
 * 
 * Seção de destaque da página inicial.
 * Exibe conteúdo contextual baseado no estado de autenticação:
 * - Visitante: apresentação do projeto com CTAs de exploração e login
 * - Autenticado: saudação personalizada com acesso rápido às histórias
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  isAuthenticated: boolean;
  userName?: string;
  isAdmin: boolean;
}

function AuthenticatedHero({ userName, isAdmin }: Omit<HeroSectionProps, 'isAuthenticated'>) {
  return (
    <div className={cn("text-center py-12")}>
      <h1 className={cn("text-4xl font-bold text-foreground mb-2")}>
        Bem-vindo de volta{userName ? `, ${userName}` : ''}!
      </h1>
      <p className={cn("text-lg text-muted-foreground mb-4")}>
        Continue explorando as histórias do Bardo Multiversal
      </p>
      {isAdmin && (
        <span className={cn(
          "inline-block text-xs px-3 py-1 rounded-full",
          "bg-primary/10 text-primary font-medium"
        )}>
          Acesso Administrativo
        </span>
      )}
      <div className={cn("flex items-center justify-center gap-4 mt-6")}>
        <Link href="/stories">
          <Button size="lg">Explorar Histórias</Button>
        </Link>
      </div>
    </div>
  );
}

function VisitorHero() {
  return (
    <div className={cn("text-center py-16")}>
      <h1 className={cn("text-5xl font-bold text-foreground mb-4")}>
        Contos de Pegriam
      </h1>
      <p className={cn("text-xl text-muted-foreground mb-2")}>
        O Bardo Multiversal
      </p>
      <p className={cn("text-muted-foreground max-w-2xl mx-auto mb-8")}>
        Mergulhe em histórias épicas de fantasia, mistério e aventura.
        Descubra mundos únicos criados pelo Bardo Multiversal.
      </p>
      <div className={cn("flex items-center justify-center gap-4")}>
        <Link href="/stories">
          <Button size="lg">Explorar Histórias</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline">Entrar</Button>
        </Link>
      </div>
    </div>
  );
}

export function HeroSection({ isAuthenticated, userName, isAdmin }: HeroSectionProps) {
  if (isAuthenticated) {
    return <AuthenticatedHero userName={userName} isAdmin={isAdmin} />;
  }

  return <VisitorHero />;
}
