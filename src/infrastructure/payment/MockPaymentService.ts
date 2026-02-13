/**
 * Implementação Mock do Serviço de Pagamento
 * 
 * Simula o fluxo de pagamento para desenvolvimento e testes.
 * Gera IDs de transação fictícios e confirma pagamentos automaticamente.
 * 
 * Para substituir por Stripe no futuro, basta criar StripePaymentService
 * implementando a mesma interface IPaymentService.
 */

import { IPaymentService, PaymentResult, PaymentVerification } from '@/domain/services/IPaymentService';
import { Purchase } from '@/domain/entities/Purchase';
import { Story } from '@/domain/entities/Story';

export class MockPaymentService implements IPaymentService {
  /**
   * Simula a criação de um pagamento.
   * Gera um ID externo fictício e retorna uma URL de checkout local.
   */
  async createPayment(purchase: Purchase, story: Story): Promise<PaymentResult> {
    const externalId = `mock_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // URL de checkout mockada — redireciona para a página de confirmação local
    const checkoutUrl = `/stories/${purchase.storyId}/checkout/confirm?external_id=${externalId}&purchase_id=${purchase.id}`;

    return {
      externalId,
      checkoutUrl,
      status: 'pending',
    };
  }

  /**
   * Simula a verificação de um pagamento.
   * No mock, sempre retorna confirmado.
   */
  async verifyPayment(externalId: string): Promise<PaymentVerification> {
    return {
      status: 'confirmed',
      externalId,
    };
  }
}
