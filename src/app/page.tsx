/**
 * Página Inicial — Contos de Pegriam
 * 
 * Composição contextual baseada no estado de autenticação:
 * 
 * - Visitante: Hero com apresentação + Histórias em destaque + CTA de cadastro
 * - Usuário autenticado: Saudação personalizada + Histórias em destaque
 * - Admin autenticado: Saudação + Acesso rápido admin + Histórias em destaque
 * 
 * Segue o princípio Open/Closed: novas seções podem ser adicionadas
 * sem modificar os componentes existentes.
 */

'use client';

import { useAuth } from '@/presentation/providers/AuthProvider';
import { Permission } from '@/domain/value-objects/Permission';
import { cn } from '@/lib/utils';
import { HeroSection } from '@/presentation/components/home/HeroSection';
import { FeaturedStories } from '@/presentation/components/home/FeaturedStories';
import { AdminQuickAccess } from '@/presentation/components/home/AdminQuickAccess';
import { AuthCallToAction } from '@/presentation/components/home/AuthCallToAction';

export default function HomePage() {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;
  const isAdmin = user ? Permission.isAdmin(user) : false;

  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8")}>
        <HeroSection
          isAuthenticated={isAuthenticated}
          userName={user?.name}
          isAdmin={isAdmin}
        />

        <div className={cn("max-w-6xl mx-auto space-y-12")}>
          {isAdmin && <AdminQuickAccess />}

          <FeaturedStories />

          {!isAuthenticated && <AuthCallToAction />}
        </div>
      </div>
    </div>
  );
}
