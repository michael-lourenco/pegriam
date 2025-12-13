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
    // Aguardar o Firebase Auth terminar de carregar
    if (loading) return;

    // Se não há usuário após o carregamento, redirecionar
    if (!user) {
      const currentPath = window.location.pathname;
      const loginUrl = redirectTo.includes('?') 
        ? redirectTo 
        : `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl as any);
      return;
    }

    // Se requer admin mas não é admin, redirecionar
    if (requireAdmin && !Permission.canAccessAdmin(user)) {
      router.push('/' as any);
      return;
    }
  }, [user, loading, requireAdmin, redirectTo, router]);

  // Retornar loading enquanto verifica autenticação
  if (loading) {
    return { user: null, loading: true, isAuthenticated: false, isAdmin: false };
  }

  return { 
    user, 
    loading: false, 
    isAuthenticated: !!user, 
    isAdmin: user ? Permission.isAdmin(user) : false 
  };
}

