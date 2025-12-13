# Sistema de Proteção de Download de PDFs
## AWS S3 + Next.js API Routes

---

## 🎯 Objetivo

Permitir que apenas compradores baixem PDFs, sem enviar por email, usando AWS S3 com URLs assinadas (signed URLs).

---

## 📋 Estrutura Proposta

### 1. Armazenamento no S3

**Bucket**: `pegriam-pdfs` (privado)
**Estrutura**:
```
s3://pegriam-pdfs/
  └── stories/
      └── {storyId}/
          └── livro-completo.pdf
```

**Configuração do Bucket**:
- **Público**: ❌ Privado
- **CORS**: Habilitado para domínio do site
- **Lifecycle**: Opcional (arquivos nunca expiram)

### 2. Estrutura de Dados (Firestore)

#### Collection: `pdf-purchases`

```typescript
interface PDFPurchase {
  id: string // ID único da compra
  userId?: string // ID do usuário (se logado)
  email: string // Email do comprador (obrigatório)
  storyId: string
  storyTitle: string // Para exibição
  
  // Stripe
  stripePaymentIntentId: string
  stripeCustomerId?: string
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  
  // Datas
  purchaseDate: Date
  completedAt?: Date
  
  // Downloads
  downloads: Array<{
    id: string
    downloadDate: Date
    ipAddress?: string
    userAgent?: string
    expiresAt: Date // Quando a URL expirou
  }>
  
  // Metadata
  price: number // Em centavos (2990 = R$ 29,90)
  currency: string // 'BRL'
}
```

#### Collection: `users` (atualizar)

```typescript
interface User {
  // ... campos existentes
  pdfPurchases: string[] // IDs das compras de PDF
}
```

### 3. Fluxo de Compra e Download

#### Passo 1: Compra (Checkout Stripe)

```
1. Usuário clica "Comprar PDF" (R$ 29,90)
2. Redireciona para checkout Stripe
3. Usuário completa pagamento
4. Stripe webhook notifica o servidor
5. Criar registro em `pdf-purchases` com status 'completed'
6. Se usuário logado, adicionar purchaseId em `users.pdfPurchases`
7. Redirecionar para página de sucesso
```

#### Passo 2: Página de Sucesso

**Rota**: `/stories/[storyId]/purchase/success?payment_intent=[stripe_id]`

```
Componente:
- Mensagem de agradecimento
- Informação do livro comprado
- Botão "Baixar PDF Agora"
- Link "Ver minhas compras" (se logado)
- Informação: "Você pode baixar este PDF quantas vezes precisar"
```

#### Passo 3: Download (API Route)

**Rota**: `GET /api/pdf/download/[purchaseId]`

**Fluxo**:
```
1. Receber request com purchaseId
2. Verificar autenticação (se necessário):
   - Se usuário logado: verificar se purchaseId está em users.pdfPurchases
   - Se não logado: verificar por email (via session/cookie)
3. Buscar compra no Firestore
4. Validar:
   - status === 'completed'
   - purchaseId existe
5. Gerar signed URL do S3 (expiração: 1 hora)
6. Registrar tentativa de download em downloads[]
7. Retornar URL assinada
8. Frontend redireciona para URL ou abre em nova aba
```

### 4. Código de Implementação

#### Dependências

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
npm install @aws-sdk/credential-providers # Para usar variáveis de ambiente
```

#### Variáveis de Ambiente

```env
# .env.local
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=pegriam-pdfs
```

#### API Route: Gerar Download

```typescript
// src/app/api/pdf/download/[purchaseId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { doc, getDoc } from 'firebase/firestore'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function GET(
  request: NextRequest,
  { params }: { params: { purchaseId: string } }
) {
  try {
    const { purchaseId } = params
    
    // 1. Buscar compra no Firestore
    const purchaseRef = doc(dbFirestore, 'pdf-purchases', purchaseId)
    const purchaseSnap = await getDoc(purchaseRef)
    
    if (!purchaseSnap.exists()) {
      return NextResponse.json(
        { error: 'Compra não encontrada' },
        { status: 404 }
      )
    }
    
    const purchase = purchaseSnap.data()
    
    // 2. Verificar status
    if (purchase.status !== 'completed') {
      return NextResponse.json(
        { error: 'Compra não completada' },
        { status: 403 }
      )
    }
    
    // 3. Verificar autorização (opcional - se quiser verificar usuário)
    // TODO: Implementar verificação de usuário/email se necessário
    
    // 4. Gerar signed URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `stories/${purchase.storyId}/livro-completo.pdf`,
    })
    
    // URL válida por 1 hora
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hora em segundos
    })
    
    // 5. Registrar download
    const downloadRecord = {
      id: Date.now().toString(),
      downloadDate: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hora
    }
    
    // Atualizar Firestore (opcional - pode ser feito em background)
    // await updateDoc(purchaseRef, {
    //   downloads: arrayUnion(downloadRecord),
    // })
    
    // 6. Retornar URL
    return NextResponse.json({
      downloadUrl: signedUrl,
      expiresIn: 3600, // segundos
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    })
    
  } catch (error) {
    console.error('Erro ao gerar download:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar link de download' },
      { status: 500 }
    )
  }
}
```

#### Componente: Botão de Download

```typescript
// src/components/monetization/PDFDownloadButton.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface PDFDownloadButtonProps {
  purchaseId: string
  storyTitle: string
}

export function PDFDownloadButton({ purchaseId, storyTitle }: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pdf/download/${purchaseId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar link')
      }

      // Abrir URL em nova aba (ou usar download direto)
      window.open(data.downloadUrl, '_blank')
      
      // Ou forçar download:
      // const link = document.createElement('a')
      // link.href = data.downloadUrl
      // link.download = `${storyTitle}.pdf`
      // link.click()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button
        onClick={handleDownload}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando link...
          </>
        ) : (
          'Baixar PDF'
        )}
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
```

### 5. Webhook do Stripe

```typescript
// src/app/api/stripe/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { dbFirestore } from '@/services/firebase/FirebaseService'
import { collection, addDoc } from 'firebase/firestore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Processar evento de pagamento bem-sucedido
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent

    // Extrair metadata (storyId, userId, etc)
    const { storyId, userId, email, storyTitle } = paymentIntent.metadata

    // Criar registro de compra
    await addDoc(collection(dbFirestore, 'pdf-purchases'), {
      userId: userId || null,
      email: email || paymentIntent.receipt_email,
      storyId,
      storyTitle,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId: paymentIntent.customer as string || null,
      status: 'completed',
      purchaseDate: new Date(),
      completedAt: new Date(),
      downloads: [],
      price: paymentIntent.amount,
      currency: paymentIntent.currency,
    })
  }

  return NextResponse.json({ received: true })
}
```

---

## 🔒 Considerações de Segurança

### 1. Validação de Acesso
- ✅ Verificar status da compra antes de gerar URL
- ✅ URLs assinadas expiram após 1 hora
- ⚠️ Considerar verificação adicional de usuário/email

### 2. Rate Limiting
- Limitar número de requisições por IP
- Prevenir geração excessiva de URLs

### 3. Logging
- Registrar todos os downloads
- Monitorar padrões suspeitos

### 4. Opcional: Watermark
- Adicionar watermark com email/ID no PDF
- Desencorajar compartilhamento ilegal

---

## 📝 Checklist de Implementação

- [ ] Criar bucket S3 `pegriam-pdfs` (privado)
- [ ] Configurar credenciais AWS (Access Key)
- [ ] Criar estrutura de pastas no S3
- [ ] Upload de PDF de teste
- [ ] Instalar dependências AWS SDK
- [ ] Criar API route `/api/pdf/download/[purchaseId]`
- [ ] Criar componente `PDFDownloadButton`
- [ ] Atualizar webhook do Stripe
- [ ] Criar página de sucesso após compra
- [ ] Testar fluxo completo
- [ ] Implementar logging de downloads

---

**Documentação criada em:** 2025
**Status:** Pronto para implementação


