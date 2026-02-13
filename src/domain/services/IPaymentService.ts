/**
 * Interface de Serviço: IPaymentService
 * 
 * Define o contrato para processamento de pagamentos.
 * Segue o princípio de inversão de dependência (DIP):
 * o domínio define a interface, a infraestrutura implementa.
 * 
 * Implementações possíveis:
 * - MockPaymentService (desenvolvimento/testes)
 * - StripePaymentService (produção)
 */

import { Purchase } from '../entities/Purchase';
import { Story } from '../entities/Story';

export interface PaymentResult {
  /** ID da transação no provider externo */
  externalId: string;
  /** URL para redirecionar o usuário ao checkout */
  checkoutUrl: string;
  /** Status retornado pelo provider */
  status: 'pending' | 'confirmed' | 'failed';
}

export interface PaymentVerification {
  /** Status verificado do pagamento */
  status: 'confirmed' | 'failed';
  /** ID da transação no provider */
  externalId: string;
}

export interface IPaymentService {
  /**
   * Criar um pagamento no provider externo
   * Retorna a URL de checkout e o ID externo da transação
   */
  createPayment(purchase: Purchase, story: Story): Promise<PaymentResult>;

  /**
   * Verificar o status de um pagamento no provider externo
   * Usado pelo webhook ou para consulta manual
   */
  verifyPayment(externalId: string): Promise<PaymentVerification>;
}
