/**
 * Entidade de Domínio: Purchase (Compra)
 * 
 * Representa uma compra de acesso completo a uma história.
 * Contém regras de negócio para transições de estado do pagamento.
 */

import { StoryId } from './Story';

export type PurchaseId = string & { readonly __brand: 'PurchaseId' };
export type PurchaseStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export interface CreatePurchaseDTO {
  userId: string;
  storyId: StoryId;
  amount: number;
  paymentProvider: string;
}

export class Purchase {
  constructor(
    public readonly id: PurchaseId,
    public readonly userId: string,
    public readonly storyId: StoryId,
    public readonly amount: number,
    public readonly status: PurchaseStatus,
    public readonly paymentProvider: string,
    public readonly paymentExternalId: string | null,
    public readonly createdAt: Date,
    public readonly confirmedAt: Date | null,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Factory method para criar uma nova Purchase
   */
  static create(dto: CreatePurchaseDTO): Purchase {
    const now = new Date();
    const id = this.generateId();

    return new Purchase(
      id,
      dto.userId,
      dto.storyId,
      dto.amount,
      'pending',
      dto.paymentProvider,
      null,
      now,
      null,
      now
    );
  }

  /**
   * Associar ID externo do pagamento (provider)
   */
  withExternalId(externalId: string): Purchase {
    return new Purchase(
      this.id,
      this.userId,
      this.storyId,
      this.amount,
      this.status,
      this.paymentProvider,
      externalId,
      this.createdAt,
      this.confirmedAt,
      new Date()
    );
  }

  /**
   * Confirmar o pagamento
   */
  confirm(): Purchase {
    if (this.status !== 'pending') {
      throw new Error(`Não é possível confirmar uma compra com status '${this.status}'`);
    }

    return new Purchase(
      this.id,
      this.userId,
      this.storyId,
      this.amount,
      'confirmed',
      this.paymentProvider,
      this.paymentExternalId,
      this.createdAt,
      new Date(),
      new Date()
    );
  }

  /**
   * Marcar como falha
   */
  fail(): Purchase {
    if (this.status !== 'pending') {
      throw new Error(`Não é possível falhar uma compra com status '${this.status}'`);
    }

    return new Purchase(
      this.id,
      this.userId,
      this.storyId,
      this.amount,
      'failed',
      this.paymentProvider,
      this.paymentExternalId,
      this.createdAt,
      null,
      new Date()
    );
  }

  /**
   * Reembolsar a compra
   */
  refund(): Purchase {
    if (this.status !== 'confirmed') {
      throw new Error(`Só é possível reembolsar compras confirmadas. Status atual: '${this.status}'`);
    }

    return new Purchase(
      this.id,
      this.userId,
      this.storyId,
      this.amount,
      'refunded',
      this.paymentProvider,
      this.paymentExternalId,
      this.createdAt,
      this.confirmedAt,
      new Date()
    );
  }

  /**
   * Verificar se o acesso está liberado
   */
  isAccessGranted(): boolean {
    return this.status === 'confirmed';
  }

  /**
   * Validações de negócio
   */
  private validate(): void {
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('ID do usuário é obrigatório');
    }

    if (!this.storyId || this.storyId.trim().length === 0) {
      throw new Error('ID da história é obrigatório');
    }

    if (this.amount < 0) {
      throw new Error('Valor da compra não pode ser negativo');
    }

    if (!this.paymentProvider || this.paymentProvider.trim().length === 0) {
      throw new Error('Provedor de pagamento é obrigatório');
    }
  }

  /**
   * Gerar ID único para a compra
   */
  private static generateId(): PurchaseId {
    return `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as PurchaseId;
  }
}
