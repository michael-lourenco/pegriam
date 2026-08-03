/**
 * Página Inicial — Contos de Pegriam
 *
 * Layout full-bleed alinhado ao mockup:
 * Hero → Categorias → Destaques → Bloco secundário (+ admin se aplicável)
 */

'use client';

import { useAuth } from '@/presentation/providers/AuthProvider';
import { Permission } from '@/domain/value-objects/Permission';
import { cn } from '@/lib/utils';
import { HeroSection } from '@/presentation/components/home/HeroSection';
import { CategoryStrip } from '@/presentation/components/home/CategoryStrip';
import { FeaturedStories } from '@/presentation/components/home/FeaturedStories';
import { HomeSecondary } from '@/presentation/components/home/HomeSecondary';
import { AdminQuickAccess } from '@/presentation/components/home/AdminQuickAccess';

export default function HomePage() {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;
  const isAdmin = user ? Permission.isAdmin(user) : false;

  if (loading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-[hsl(var(--navy-deep))]')}>
        <p className={cn('text-white/60')}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen bg-[hsl(var(--navy-deep))]')}>
      <HeroSection
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        isAdmin={isAdmin}
      />

      <CategoryStrip />

      <FeaturedStories />

      {isAdmin && (
        <div className={cn('bg-parchment pb-10')}>
          <div className={cn('container mx-auto px-4')}>
            <AdminQuickAccess />
          </div>
        </div>
      )}

      <HomeSecondary />
    </div>
  );
}
