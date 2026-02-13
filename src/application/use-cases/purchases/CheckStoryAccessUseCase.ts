/**
 * Use Case: Verificar Acesso à História
 * 
 * Verifica se um usuário tem acesso completo a uma história
 * (via compra confirmada ou sendo admin).
 */

import { Purchase } from '@/domain/entities/Purchase';
import { StoryId } from '@/domain/entities/Story';
import { IPurchaseRepository } from '@/domain/repositories/IPurchaseRepository';
import { Permission, User } from '@/domain/value-objects/Permission';

interface CheckAccessOutput {
  hasAccess: boolean;
  purchase: Purchase | null;
  reason: 'admin' | 'purchased' | 'no_access';
}

export class CheckStoryAccessUseCase {
  constructor(
    private readonly purchaseRepository: IPurchaseRepository
  ) {}

  async execute(user: User | null, storyId: StoryId): Promise<CheckAccessOutput> {
    // Admin sempre tem acesso
    if (user && Permission.isAdmin(user)) {
      return { hasAccess: true, purchase: null, reason: 'admin' };
    }

    // Sem usuário, sem acesso
    if (!user) {
      return { hasAccess: false, purchase: null, reason: 'no_access' };
    }

    // Verificar se existe compra confirmada
    const purchase = await this.purchaseRepository.findByUserAndStory(user.id, storyId);

    if (purchase && purchase.isAccessGranted()) {
      return { hasAccess: true, purchase, reason: 'purchased' };
    }

    return { hasAccess: false, purchase: purchase ?? null, reason: 'no_access' };
  }
}
