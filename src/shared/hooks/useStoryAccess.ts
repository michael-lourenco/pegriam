/**
 * Hook para verificar acesso do usuário a uma história
 * 
 * Verifica se o usuário pode ler todos os capítulos
 * (admin, compra confirmada, ou história gratuita).
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { CheckStoryAccessUseCase } from '@/application/use-cases';
import { SupabasePurchaseRepository } from '@/infrastructure/database/supabase';
import { StoryId } from '@/domain/entities/Story';
import { Purchase } from '@/domain/entities/Purchase';

interface StoryAccessState {
  hasFullAccess: boolean;
  purchase: Purchase | null;
  reason: 'admin' | 'purchased' | 'no_access' | 'free' | 'loading';
  loading: boolean;
}

export function useStoryAccess(storyId: string, storyPrice: number) {
  const { user, loading: authLoading } = useAuth();
  const [accessState, setAccessState] = useState<StoryAccessState>({
    hasFullAccess: false,
    purchase: null,
    reason: 'loading',
    loading: true,
  });

  useEffect(() => {
    if (authLoading) return;

    // História gratuita: acesso livre
    if (storyPrice <= 0) {
      setAccessState({
        hasFullAccess: true,
        purchase: null,
        reason: 'free',
        loading: false,
      });
      return;
    }

    // Sem usuário: sem acesso
    if (!user) {
      setAccessState({
        hasFullAccess: false,
        purchase: null,
        reason: 'no_access',
        loading: false,
      });
      return;
    }

    async function checkAccess() {
      try {
        const purchaseRepository = new SupabasePurchaseRepository();
        const checkAccess = new CheckStoryAccessUseCase(purchaseRepository);

        const result = await checkAccess.execute(user, storyId as StoryId);

        setAccessState({
          hasFullAccess: result.hasAccess,
          purchase: result.purchase,
          reason: result.reason,
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        setAccessState({
          hasFullAccess: false,
          purchase: null,
          reason: 'no_access',
          loading: false,
        });
      }
    }

    checkAccess();
  }, [user, authLoading, storyId, storyPrice]);

  return accessState;
}
