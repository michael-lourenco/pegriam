/**
 * Interface de Repositório: IPurchaseRepository
 * 
 * Define o contrato para persistência de Purchases.
 * Segue o padrão Repository para inversão de dependência.
 */

import { Purchase, PurchaseId } from '../entities/Purchase';
import { StoryId } from '../entities/Story';

export interface IPurchaseRepository {
  /**
   * Salvar uma nova compra
   */
  save(purchase: Purchase): Promise<void>;

  /**
   * Atualizar uma compra existente
   */
  update(purchase: Purchase): Promise<void>;

  /**
   * Buscar compra por ID
   */
  findById(id: PurchaseId): Promise<Purchase | null>;

  /**
   * Buscar compra por usuário e história
   * Usado para verificar se o usuário já comprou a história
   */
  findByUserAndStory(userId: string, storyId: StoryId): Promise<Purchase | null>;

  /**
   * Buscar todas as compras de um usuário
   */
  findByUserId(userId: string): Promise<Purchase[]>;

  /**
   * Buscar compra pelo ID externo do pagamento (provider)
   * Usado pelo webhook para localizar a compra
   */
  findByExternalId(externalId: string): Promise<Purchase | null>;
}
