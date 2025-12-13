/**
 * Hook para proteger componentes/páginas que requerem autenticação
 * 
 * Redireciona para login se o usuário não estiver autenticado.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { Permission } from '@/domain/value-objects/Permission';

interface UseRequireAuthOptions {
  requireAdmin?: boolean;
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { requireAdmin = false, redirectTo = '/login' } = options;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(redirectTo as any);
      return;
    }

    if (requireAdmin && !Permission.canAccessAdmin(user)) {
      router.push('/' as any);
      return;
    }
  }, [user, loading, requireAdmin, redirectTo, router]);

  return { user, loading, isAuthenticated: !!user, isAdmin: user ? Permission.isAdmin(user) : false };
}

