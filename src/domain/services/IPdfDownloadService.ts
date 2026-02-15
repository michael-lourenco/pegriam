/**
 * Interface de Servico: IPdfDownloadService
 * 
 * Define o contrato para geracao de URLs de download de PDFs.
 * Implementacoes possiveis:
 * - S3PdfDownloadService (producao — AWS S3 signed URLs)
 * - MockPdfDownloadService (desenvolvimento)
 */

export interface PdfDownloadResult {
  downloadUrl: string;
  expiresAt: Date;
}

export interface IPdfDownloadService {
  /**
   * Gerar URL assinada de download para um PDF
   */
  generateDownloadUrl(storyId: string, userId: string): Promise<PdfDownloadResult>;

  /**
   * Verificar se o PDF existe no storage
   */
  pdfExists(storyId: string): Promise<boolean>;
}
