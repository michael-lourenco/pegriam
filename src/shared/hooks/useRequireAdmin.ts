/**
 * Hook específico para proteger rotas admin
 * 
 * Redireciona para home se o usuário não for admin.
 */

'use client';

import { useRequireAuth } from './useRequireAuth';

export function useRequireAdmin() {
  return useRequireAuth({ requireAdmin: true, redirectTo: '/login?redirect=/admin' });
}

