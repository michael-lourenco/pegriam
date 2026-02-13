/**
 * Use Case: Buscar Compras do Usuário
 * 
 * Retorna todas as compras realizadas por um usuário,
 * incluindo histórias com acesso confirmado e compras pendentes.
 */

import { Purchase } from '@/domain/entities/Purchase';
import { IPurchaseRepository } from '@/domain/repositories/IPurchaseRepository';

export class GetUserPurchasesUseCase {
  constructor(
    private readonly purchaseRepository: IPurchaseRepository
  ) {}

  async execute(userId: string): Promise<Purchase[]> {
    if (!userId || userId.trim().length === 0) {
      throw new Error('ID do usuário é obrigatório');
    }

    return await this.purchaseRepository.findByUserId(userId);
  }
}
