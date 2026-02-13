/**
 * Use Case: Confirmar Compra
 * 
 * Confirma o pagamento de uma compra após notificação do provider.
 * Chamado pelo webhook de pagamento.
 */

import { Purchase } from '@/domain/entities/Purchase';
import { IPurchaseRepository } from '@/domain/repositories/IPurchaseRepository';
import { IPaymentService } from '@/domain/services/IPaymentService';

export class ConfirmPurchaseUseCase {
  constructor(
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(paymentExternalId: string): Promise<Purchase> {
    // 1. Buscar compra pelo ID externo do pagamento
    const purchase = await this.purchaseRepository.findByExternalId(paymentExternalId);
    if (!purchase) {
      throw new Error('Compra não encontrada para o pagamento informado');
    }

    // 2. Verificar se já está confirmada
    if (purchase.isAccessGranted()) {
      return purchase;
    }

    // 3. Verificar status no provider
    const verification = await this.paymentService.verifyPayment(paymentExternalId);

    // 4. Atualizar status baseado na verificação
    let updatedPurchase: Purchase;

    if (verification.status === 'confirmed') {
      updatedPurchase = purchase.confirm();
    } else {
      updatedPurchase = purchase.fail();
    }

    // 5. Persistir atualização
    await this.purchaseRepository.update(updatedPurchase);

    return updatedPurchase;
  }
}
