/**
 * API Route: Download de PDF
 * 
 * Gera URL assinada do S3 para download apos verificar
 * que a compra existe e esta confirmada.
 * 
 * GET /api/pdf/download/[purchaseId]
 */

import { NextResponse } from 'next/server';
import { Container } from '@/shared/container';
import { PurchaseId } from '@/domain/entities/Purchase';

// Usa mock em dev, S3 real em producao
async function getPdfService() {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const { S3PdfDownloadService } = await import('@/infrastructure/storage/S3PdfDownloadService');
    return new S3PdfDownloadService();
  }
  const { MockPdfDownloadService } = await import('@/infrastructure/storage/MockPdfDownloadService');
  return new MockPdfDownloadService();
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  try {
    const { purchaseId } = await params;

    if (!purchaseId) {
      return NextResponse.json({ error: 'ID da compra e obrigatorio' }, { status: 400 });
    }

    const { purchaseRepository } = Container.getRepositories();
    const purchase = await purchaseRepository.findById(purchaseId as PurchaseId);

    if (!purchase) {
      return NextResponse.json({ error: 'Compra nao encontrada' }, { status: 404 });
    }

    if (purchase.status !== 'confirmed') {
      return NextResponse.json({ error: 'Compra nao confirmada' }, { status: 403 });
    }

    const pdfService = await getPdfService();
    const exists = await pdfService.pdfExists(purchase.storyId);

    if (!exists) {
      return NextResponse.json(
        { error: 'PDF ainda nao disponivel para esta historia' },
        { status: 404 }
      );
    }

    const result = await pdfService.generateDownloadUrl(purchase.storyId, purchase.userId);

    return NextResponse.json({
      downloadUrl: result.downloadUrl,
      expiresAt: result.expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Erro ao gerar download:', error);
    return NextResponse.json(
      { error: 'Erro interno ao gerar link de download' },
      { status: 500 }
    );
  }
}
