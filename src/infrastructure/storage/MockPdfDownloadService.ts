/**
 * Implementacao Mock do Servico de Download de PDF
 * 
 * Simula URLs de download para desenvolvimento.
 */

import { IPdfDownloadService, PdfDownloadResult } from '@/domain/services/IPdfDownloadService';

export class MockPdfDownloadService implements IPdfDownloadService {
  async generateDownloadUrl(storyId: string, userId: string): Promise<PdfDownloadResult> {
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    return {
      downloadUrl: `#mock-download-${storyId}-${userId}`,
      expiresAt,
    };
  }

  async pdfExists(_storyId: string): Promise<boolean> {
    return true;
  }
}
