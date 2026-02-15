/**
 * Implementacao do Servico de Download de PDF usando AWS S3
 * 
 * Gera URLs assinadas (signed URLs) com expiracao para download seguro.
 * Requer configuracao de credenciais AWS via variaveis de ambiente.
 * 
 * Variaveis necessarias:
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_REGION
 * - AWS_S3_BUCKET_NAME
 */

import { GetObjectCommand, HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IPdfDownloadService, PdfDownloadResult } from '@/domain/services/IPdfDownloadService';

const SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hora

export class S3PdfDownloadService implements IPdfDownloadService {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'pegriam-pdfs';
  }

  private getKey(storyId: string): string {
    return `stories/${storyId}/livro-completo.pdf`;
  }

  async generateDownloadUrl(storyId: string, _userId: string): Promise<PdfDownloadResult> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: this.getKey(storyId),
      ResponseContentDisposition: `attachment; filename="pegriam-${storyId}.pdf"`,
    });

    const downloadUrl = await getSignedUrl(this.client, command, {
      expiresIn: SIGNED_URL_EXPIRY_SECONDS,
    });

    const expiresAt = new Date(Date.now() + SIGNED_URL_EXPIRY_SECONDS * 1000);

    return { downloadUrl, expiresAt };
  }

  async pdfExists(storyId: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: this.getKey(storyId),
      }));
      return true;
    } catch {
      return false;
    }
  }
}
