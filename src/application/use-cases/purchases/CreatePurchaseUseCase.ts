/**
 * Use Case: Criar Compra
 * 
 * Inicia o fluxo de compra de uma história.
 * Valida regras de negócio, cria a entidade Purchase,
 * solicita pagamento ao provider e persiste a compra.
 */

import { Purchase } from '@/domain/entities/Purchase';
import { StoryId } from '@/domain/entities/Story';
import { IPurchaseRepository } from '@/domain/repositories/IPurchaseRepository';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { IPaymentService, PaymentResult } from '@/domain/services/IPaymentService';

interface CreatePurchaseInput {
  userId: string;
  storyId: StoryId;
}

interface CreatePurchaseOutput {
  purchase: Purchase;
  checkoutUrl: string;
}

export class CreatePurchaseUseCase {
  constructor(
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly storyRepository: IStoryRepository,
    private readonly paymentService: IPaymentService
  ) {}

  async execute(input: CreatePurchaseInput): Promise<CreatePurchaseOutput> {
    // 1. Verificar se a história existe
    const story = await this.storyRepository.findById(input.storyId);
    if (!story) {
      throw new Error('História não encontrada');
    }

    // 2. Verificar se o preço é válido para compra
    if (story.pdfPrice <= 0) {
      throw new Error('Esta história é gratuita e não precisa ser comprada');
    }

    // 3. Verificar se o usuário já comprou esta história
    const existingPurchase = await this.purchaseRepository.findByUserAndStory(
      input.userId,
      input.storyId
    );

    if (existingPurchase) {
      if (existingPurchase.isAccessGranted()) {
        throw new Error('Você já possui acesso a esta história');
      }

      // Se existe uma compra pendente ou falha, permite tentar novamente
      if (existingPurchase.status === 'pending') {
        throw new Error('Você já possui uma compra pendente para esta história');
      }
    }

    // 4. Criar entidade de compra
    const purchase = Purchase.create({
      userId: input.userId,
      storyId: input.storyId,
      amount: story.pdfPrice,
      paymentProvider: 'mock', // Será configurável quando trocar para Stripe
    });

    // 5. Solicitar pagamento ao provider
    const paymentResult: PaymentResult = await this.paymentService.createPayment(purchase, story);

    // 6. Associar ID externo e persistir
    const purchaseWithExternalId = purchase.withExternalId(paymentResult.externalId);
    await this.purchaseRepository.save(purchaseWithExternalId);

    return {
      purchase: purchaseWithExternalId,
      checkoutUrl: paymentResult.checkoutUrl,
    };
  }
}
