/**
 * API Route para upload de imagens para AWS S3
 * 
 * Recebe uma imagem via FormData e faz upload para S3
 * Retorna a URL pública da imagem
 */

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configurar cliente S3
// Usar AWS_CUSTOM_REGION se disponível, senão AWS_REGION, senão padrão
const AWS_REGION = process.env.AWS_CUSTOM_REGION || process.env.AWS_REGION || 'us-east-1';
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
const DEFAULT_FOLDER = 'stories/covers'; // Pasta padrão onde as imagens serão salvas

export async function POST(request: NextRequest) {
  try {
    // Verificar se as credenciais AWS estão configuradas
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
      return NextResponse.json(
        { error: 'Credenciais AWS não configuradas' },
        { status: 500 }
      );
    }

    // Obter o arquivo e pasta do FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || DEFAULT_FOLDER;

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo (apenas imagens)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use apenas imagens (JPEG, PNG, WebP, GIF)' },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    // Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Fazer upload para S3
    // IMPORTANTE: Para que as imagens sejam acessíveis publicamente, você DEVE configurar
    // uma Bucket Policy no AWS Console que permita leitura pública dos objetos.
    // Veja documentacao/setup-aws-s3.md para instruções detalhadas.
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // ACL não é usado - Bucket Policy deve ser configurada manualmente no AWS Console
    });

    await s3Client.send(command);

    // Construir URL pública da imagem
    // Formato: https://bucket-name.s3.region.amazonaws.com/key
    // Ou se tiver CloudFront: https://d1234abcd.cloudfront.net/key
    // Usar AWS_CUSTOM_REGION se disponível, senão AWS_REGION, senão padrão
    const region = process.env.AWS_CUSTOM_REGION || process.env.AWS_REGION || 'us-east-1';
    const cloudfrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
    
    let imageUrl: string;
    if (cloudfrontDomain) {
      // Usar CloudFront se configurado
      imageUrl = `https://${cloudfrontDomain}/${key}`;
    } else {
      // Usar URL direta do S3
      // Formato: https://bucket-name.s3.region.amazonaws.com/key
      imageUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${key}`;
    }
    
    console.log('Configuração S3:', { 
      bucket: BUCKET_NAME, 
      region, 
      cloudfront: cloudfrontDomain || 'não configurado',
      url: imageUrl 
    });

    console.log('Upload concluído:', { url: imageUrl, key, bucket: BUCKET_NAME });
    
    return NextResponse.json({
      success: true,
      url: imageUrl,
      key: key,
    });
  } catch (error: any) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer upload da imagem' },
      { status: 500 }
    );
  }
}

