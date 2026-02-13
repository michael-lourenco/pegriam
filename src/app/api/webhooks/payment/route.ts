/**
 * Webhook de Pagamento
 * 
 * Endpoint: POST /api/webhooks/payment
 * 
 * Recebe notificações de confirmação de pagamento do provider.
 * Atualmente usa o MockPaymentService; preparado para Stripe no futuro.
 * 
 * Quando migrar para Stripe:
 * - Validar assinatura do webhook (stripe.webhooks.constructEvent)
 * - Trocar MockPaymentService por StripePaymentService
 */

import { NextRequest, NextResponse } from 'next/server';
import { ConfirmPurchaseUseCase } from '@/application/use-cases';
import { SupabasePurchaseRepository } from '@/infrastructure/database/supabase';
import { MockPaymentService } from '@/infrastructure/payment/MockPaymentService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { external_id } = body;

    if (!external_id) {
      return NextResponse.json(
        { error: 'Campo external_id é obrigatório' },
        { status: 400 }
      );
    }

    // TODO: Quando migrar para Stripe, validar assinatura do webhook aqui
    // const sig = request.headers.get('stripe-signature');
    // const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    const purchaseRepository = new SupabasePurchaseRepository();
    const paymentService = new MockPaymentService();

    const confirmPurchase = new ConfirmPurchaseUseCase(
      purchaseRepository,
      paymentService
    );

    const confirmedPurchase = await confirmPurchase.execute(external_id);

    return NextResponse.json({
      success: true,
      purchase_id: confirmedPurchase.id,
      status: confirmedPurchase.status,
    });
  } catch (error: any) {
    console.error('Erro no webhook de pagamento:', error);

    return NextResponse.json(
      { error: error.message || 'Erro interno no processamento do webhook' },
      { status: 500 }
    );
  }
}
