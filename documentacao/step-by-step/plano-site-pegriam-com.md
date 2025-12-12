# Plano de Desenvolvimento: Site pegriam.com
## "Contos de Pegriam: A Lenda de Nix" - Plataforma de Leitura Interativa

---

## Data: 2025
## Projeto: pegriam.com - Plataforma de Leitura Épica

---

## 📋 Visão Geral do Projeto

### Objetivo
Criar uma plataforma web profissional e escalável para apresentar "Contos de Pegriam: A Lenda de Nix" e futuras histórias épicas, oferecendo uma experiência de leitura imersiva com sistema de glossário interativo, modelo freemium e funcionalidades avançadas de leitura.

### Público-Alvo
- Leitores de fantasia épica
- Fãs de worldbuilding e narrativas complexas
- Pessoas interessadas em histórias interativas com glossário/wikipédia integrado

---

## 🎯 Requisitos Funcionais

### 1. Sistema de Leitura de Capítulos

#### 1.1 Leitor Principal
- **Modo Scroll**: Leitura tradicional com scroll vertical
- **Modo Imersivo**: Tela cheia, sem distrações, foco total na narrativa
- **Toggle entre modos**: Botão facilmente acessível
- **Temas**: Claro/Escuro com toggle
- **Tipografia**: 
  - Fonte serifada para leitura confortável (ex: Georgia, Merriweather)
  - Tamanho ajustável (pequeno, médio, grande, extra-grande)
  - Espaçamento de linha configurável
  - Largura máxima do texto para legibilidade (ex: 65-75 caracteres por linha)

#### 1.2 Progresso de Leitura
- Salvar última posição por capítulo
- Marcar capítulos como lidos/não lidos
- Indicador visual de progresso por capítulo
- Barra de progresso geral da história

#### 1.3 Bookmarks/Favoritos
- Salvar posições específicas dentro dos capítulos
- Criar notas pessoais em trechos
- Compartilhar trechos favoritos (opcional)

#### 1.4 Navegação
- Botões Anterior/Próximo capítulo
- Menu lateral com índice de capítulos
- Navegação rápida por teclado (setas, Page Up/Down)
- Botão "Voltar ao topo" suave

### 2. Sistema de Glossário/Wikipédia Interativo

#### 2.1 Tooltips em Termos
- **Detecção automática**: Identificar termos do glossário no texto
- **Destaque visual**: Sublinhado ou cor diferente para termos linkáveis
- **Tooltip ao hover**: 
  - Mostrar definição resumida
  - Link para página completa
  - Imagem/ícone relacionado (opcional)
- **Tooltip ao clique**: Abrir modal com informações completas

#### 2.2 Sidebar Contextual
- Abrir automaticamente quando termo é clicado
- Mostrar informações relacionadas:
  - Definição completa
  - Aparições na história
  - Relacionamentos com outros termos
  - Referências cruzadas
- Fechar com botão X ou clique fora

#### 2.3 Página Dedicada de Glossário
- Lista completa de termos
- Categorias (Personagens, Lugares, Magia, Objetos, etc.)
- Busca por nome/descrição
- Filtros por categoria
- Ordenação alfabética
- Cards visuais para cada termo

#### 2.4 Sistema de Busca
- Busca global no glossário
- Busca dentro dos capítulos
- Busca por termos relacionados
- Autocomplete/sugestões

### 3. Modelo de Monetização (Freemium + Venda de PDF)

#### 3.1 Camada Gratuita
- **Primeiros capítulos gratuitos** (quantidade configurável por história)
- **Acesso completo ao glossário** (100% gratuito)
- Modo de leitura padrão disponível
- Todas as funcionalidades de leitura (scroll, imersivo, temas)
- Sistema de doações visível mas não obrigatório

#### 3.2 Capítulos Pagos
- Capítulos além dos gratuitos mostram apenas preview
- **Redirecionamento para página de compra de PDF completo**
- Preview elegante (primeiras linhas/parágrafos)
- Call-to-action claro: "Continue lendo comprando o livro completo em PDF"
- Botão destacado: "Comprar PDF Completo"

#### 3.3 Página de Venda de PDF
- Landing page atrativa para o livro
- Informações do livro:
  - Capa/arte
  - Sinopse
  - Quantidade de capítulos
  - Preview do conteúdo
- Integração com Stripe para compra
- Após compra: Link de download do PDF
- Email automático com PDF (via Stripe ou serviço de email)

#### 3.4 Sistema de Doações
- Integração com Stripe (já existente)
- Botões de doação estratégicos
- Agradecimentos para doadores
- Benefícios opcionais para doadores recorrentes

#### 3.5 Gatekeeper Simplificado
- Bloqueio visual elegante em capítulos pagos
- Preview das primeiras linhas/parágrafos
- Mensagem clara: "Este capítulo faz parte do livro completo"
- Botão: "Comprar PDF Completo" → redireciona para página de venda
- Não invasivo, mas efetivo

### 4. Gerenciamento de Conteúdo

#### 4.1 Estrutura Escalável
- Suporte a múltiplas histórias/séries
- Cada história pode ter múltiplos capítulos
- Sistema de tags/categorias
- Metadata rica (autor, data de publicação, tags, etc.)

#### 4.2 Formato de Armazenamento
- Capítulos em Markdown (já existe)
- Parse Markdown para HTML formatado
- Suporte a imagens, vídeos, elementos interativos
- Versionamento de conteúdo

#### 4.3 CMS Simples (Futuro)
- Interface administrativa para adicionar/editar capítulos
- Upload de imagens
- Gerenciamento de glossário
- Preview antes de publicar

### 5. Experiência do Usuário

#### 5.1 Design Temático
- **Estética de fantasia épica**:
  - Cores: Dourado, púrpura, azul profundo
  - Tipografia: Elegante, medieval-moderna
  - Ilustrações: Arte conceitual, mapas
  - Animações sutis e mágicas
- Responsivo: Mobile-first, adaptável a tablets e desktop

#### 5.2 Performance
- Loading rápido
- Lazy loading de imagens
- Otimização de Markdown parsing
- Cache inteligente
- PWA para modo offline

#### 5.3 Acessibilidade
- Suporte a leitores de tela
- Navegação por teclado completa
- Contraste adequado (WCAG AA)
- Textos alternativos

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico (Mantendo o Existente)

#### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + **@tailwindcss/typography** (para tipografia de leitura)
- **Radix UI** (componentes acessíveis)
- **Framer Motion** (animações sutis)

#### Backend/Dados
- **Firebase Firestore** (banco de dados)
  - Coleção: `stories`
  - Coleção: `chapters`
  - Coleção: `glossary`
  - Coleção: `users`
  - Coleção: `subscriptions`
  - Coleção: `purchases`
- **Firebase Auth** (autenticação)
- **NextAuth** (sessões)
- **Stripe** (pagamentos)

#### Armazenamento
- **Firebase Storage** ou **Cloudinary** (imagens e assets)
- Arquivos Markdown podem ser mantidos no repo Git ou migrados para Firestore

### Estrutura de Dados Proposta

#### Collection: `stories`
```typescript
interface Story {
  id: string
  title: string
  description: string
  author: string
  coverImage: string
  publishedAt: Date
  status: 'draft' | 'publishing' | 'completed'
  freeChapters: number // Quantos primeiros capítulos são gratuitos
  pdfPrice: number // Preço do PDF completo em centavos (ex: 4990 = R$ 49,90)
  pdfUrl?: string // URL do PDF para venda (após upload)
  pdfPreviewUrl?: string // URL de preview do PDF
  tags: string[]
  metadata: {
    totalChapters: number
    estimatedReadTime: number
  }
}
```

#### Collection: `chapters`
```typescript
interface Chapter {
  id: string
  storyId: string
  number: number
  title: string
  content: string // Markdown ou HTML processado
  publishedAt: Date
  isFree: boolean
  estimatedReadTime: number // minutos
  wordCount: number
  order: number
}
```

#### Collection: `glossary`
```typescript
interface GlossaryTerm {
  id: string
  term: string
  aliases: string[] // Variações do nome
  category: 'character' | 'location' | 'magic' | 'object' | 'creature' | 'organization' | 'concept'
  shortDescription: string // Para tooltips
  fullDescription: string // Para página dedicada
  imageUrl?: string
  relatedTerms: string[] // IDs de termos relacionados
  firstAppearance: {
    storyId: string
    chapterId: string
  }
  appearances: Array<{
    storyId: string
    chapterId: string
    context: string // Trecho onde aparece
  }>
}
```

#### Collection: `users` (Expandir existente)
```typescript
interface User {
  // ... campos existentes
  readingProgress: {
    [storyId: string]: {
      [chapterId: string]: {
        lastPosition: number // Scroll position ou porcentagem
        completed: boolean
        bookmarks: Array<{
          id: string
          position: number
          note?: string
          createdAt: Date
        }>
      }
    }
  }
  // Não precisa mais de subscription, apenas purchases
  purchases: Array<{
    type: 'pdf'
    storyId: string
    purchaseDate: Date
    pdfUrl?: string // Link para download
  }>
}
```

#### Collection: `pdf-purchases` (Opcional - para rastreamento)
```typescript
interface PDFPurchase {
  id: string
  userId?: string // Opcional - compra pode ser anônima
  storyId: string
  email: string // Email para envio do PDF
  stripePaymentIntentId: string
  status: 'pending' | 'completed' | 'failed'
  purchaseDate: Date
  pdfUrl: string
  downloadCount: number
}
```

---

## 📁 Estrutura de Pastas Proposta

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (public)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── stories/
│   │   │   ├── page.tsx                # Lista de histórias
│   │   │   └── [storyId]/
│   │   │       ├── page.tsx            # Página da história
│   │   │       └── chapter/
│   │   │           └── [chapterId]/
│   │   │               └── page.tsx    # Leitor de capítulo
│   │   ├── glossary/
│   │   │   ├── page.tsx                # Página de glossário
│   │   │   └── [termId]/
│   │   │       └── page.tsx            # Página do termo
│   │   └── about/
│   ├── (protected)/
│   │   ├── profile/
│   │   ├── library/                    # Biblioteca do usuário
│   │   └── bookmarks/
│   └── api/
│       ├── stories/
│       ├── chapters/
│       ├── glossary/
│       ├── stripe/
│       └── pdf/
│
├── components/
│   ├── reader/
│   │   ├── ChapterReader.tsx           # Componente principal do leitor
│   │   ├── ReaderControls.tsx          # Controles (tema, tamanho, etc)
│   │   ├── ReaderModeToggle.tsx        # Toggle scroll/imersivo
│   │   ├── ProgressBar.tsx             # Barra de progresso
│   │   ├── NavigationButtons.tsx       # Anterior/Próximo
│   │   └── ChapterSidebar.tsx          # Menu lateral com índice
│   │
│   ├── glossary/
│   │   ├── GlossaryTooltip.tsx         # Tooltip ao hover
│   │   ├── GlossaryModal.tsx           # Modal ao clique
│   │   ├── GlossarySidebar.tsx         # Sidebar contextual
│   │   ├── GlossaryTermCard.tsx        # Card na página de glossário
│   │   └── GlossarySearch.tsx          # Componente de busca
│   │
│   ├── monetization/
│   │   ├── Paywall.tsx                 # Gatekeeper elegante (preview + CTA)
│   │   ├── PDFPurchasePage.tsx         # Página de venda do PDF
│   │   ├── PDFPurchaseButton.tsx       # Botão "Comprar PDF Completo"
│   │   └── DonationButton.tsx          # Botão de doação
│   │
│   ├── story/
│   │   ├── StoryCard.tsx               # Card na lista de histórias
│   │   ├── StoryHeader.tsx             # Header da página da história
│   │   └── ChapterList.tsx             # Lista de capítulos
│   │
│   └── shared/
│       ├── ThemeToggle.tsx
│       ├── BookmarkButton.tsx
│       └── ShareButton.tsx
│
├── lib/
│   ├── markdown/
│   │   ├── parser.ts                   # Parser de Markdown
│   │   ├── glossary-detector.ts        # Detecção de termos
│   │   └── formatter.ts                # Formatação para leitura
│   ├── glossary/
│   │   ├── matcher.ts                  # Matching de termos no texto
│   │   └── related-terms.ts            # Busca de termos relacionados
│   └── reading/
│       ├── progress.ts                 # Gerenciamento de progresso
│       └── bookmarks.ts                # Gerenciamento de bookmarks
│
├── services/
│   ├── stories/
│   │   ├── getStories.ts
│   │   ├── getStory.ts
│   │   └── getChapters.ts
│   ├── chapters/
│   │   ├── getChapter.ts
│   │   └── saveProgress.ts
│   ├── glossary/
│   │   ├── getGlossary.ts
│   │   ├── searchGlossary.ts
│   │   └── getTerm.ts
│   ├── stripe/
│   │   ├── createPDFPurchase.ts        # Criar checkout para PDF
│   │   ├── handlePDFPurchase.ts        # Processar compra de PDF
│   │   └── webhooks.ts                 # Webhooks do Stripe
│   └── pdf/
│       ├── generatePDFDownload.ts      # Gerar link de download
│       └── sendPDFEmail.ts             # Enviar PDF por email (opcional)
│
├── hooks/
│   ├── useReader.ts                    # Hook principal do leitor
│   ├── useGlossary.ts                  # Hook do glossário
│   ├── useProgress.ts                  # Hook de progresso
│   ├── useBookmarks.ts                 # Hook de bookmarks
│   └── usePDFPurchase.ts               # Hook para compra de PDF
│
└── types/
    ├── story.ts
    ├── chapter.ts
    ├── glossary.ts
    └── user.ts
```

---

## 🎨 Design e UX

### Paleta de Cores (Fantasia Épica)

#### Tema Claro
- **Primário**: #8B5CF6 (Púrpura)
- **Secundário**: #F59E0B (Dourado)
- **Destaque**: #3B82F6 (Azul)
- **Background**: #FFFFFF
- **Texto**: #1F2937
- **Texto Secundário**: #6B7280

#### Tema Escuro
- **Primário**: #A78BFA (Púrpura claro)
- **Secundário**: #FBBF24 (Dourado claro)
- **Destaque**: #60A5FA (Azul claro)
- **Background**: #0F172A (Azul muito escuro)
- **Texto**: #F1F5F9
- **Texto Secundário**: #94A3B8

### Tipografia

#### Headings
- Font: Playfair Display ou Cinzel (estilo medieval elegante)
- Tamanhos: 3xl, 2xl, xl, lg

#### Body (Leitura)
- Font: Merriweather ou Georgia (serif, confortável para leitura)
- Tamanhos configuráveis: 14px, 16px, 18px, 20px, 22px

### Componentes Visuais

#### Leitor
- Largura máxima: 800px (confortável para leitura)
- Padding generoso: 2rem nas laterais
- Espaçamento entre parágrafos: 1.5rem
- Destacar citações/itálicos de Pegriam

#### Tooltips
- Estilo elegante, não invasivo
- Fundo semitransparente com blur
- Animações suaves
- Posicionamento inteligente (evitar sair da tela)

---

## 🚀 Fases de Implementação

### Fase 1: MVP - Leitor Básico (2-3 semanas)
**Objetivo**: Ter um leitor funcional para exibir capítulos

**Tarefas**:
1. Criar estrutura de dados no Firestore
2. Migrar capítulos Markdown existentes para Firestore
3. Criar página de leitura básica (modo scroll)
4. Implementar parse de Markdown para HTML
5. Sistema básico de navegação (anterior/próximo)
6. Tema claro/escuro
7. Layout responsivo básico

**Entregável**: Site funcional onde usuários podem ler capítulos gratuitos

---

### Fase 2: Sistema de Glossário Básico (2 semanas)
**Objetivo**: Tooltips e página de glossário funcionando

**Tarefas**:
1. Criar coleção de glossário no Firestore
2. Popular glossário com termos iniciais (personagens, lugares principais)
3. Implementar detecção de termos no texto
4. Criar tooltips ao hover
5. Criar página dedicada de glossário
6. Sistema de busca básico

**Entregável**: Glossário interativo funcional

---

### Fase 3: Monetização - Venda de PDF (2 semanas)
**Objetivo**: Sistema de venda de PDF funcionando

**Tarefas**:
1. Integrar Stripe completamente
2. Criar paywall elegante (preview + CTA)
3. Criar página de venda do PDF:
   - Design atrativo
   - Informações do livro
   - Preview/amostra
   - Botão de compra Stripe
4. Sistema de checkout Stripe
5. Webhook para processar pagamento
6. Gerar/fornecer link de download do PDF
7. Email automático com PDF (opcional)
8. Integrar botões de doação existentes

**Entregável**: Usuários podem comprar PDF completo dos livros

---

### Fase 4: Funcionalidades Avançadas (2 semanas)
**Objetivo**: Experiência premium completa

**Tarefas**:
1. Sistema de progresso de leitura (salvar posição)
2. Sistema de bookmarks e notas
3. Modo imersivo (tela cheia)
4. Ajustes de tipografia (tamanho, espaçamento)
5. Sidebar contextual do glossário
6. Navegação por teclado
7. Indicadores visuais de progresso

**Entregável**: Experiência de leitura completa e polida

---

### Fase 5: Glossário Avançado e Otimizações (1-2 semanas)
**Objetivo**: Glossário completo e performance

**Tarefas**:
1. Expandir glossário com todos os termos
2. Sistema de termos relacionados
3. Melhorar busca (autocomplete, sugestões)
4. Otimizações de performance
5. PWA (modo offline)
6. SEO otimizado
7. Analytics integrado

**Entregável**: Plataforma completa e otimizada

---

## 💰 Modelo de Monetização Detalhado

### Estrutura Simplificada

#### Conteúdo Gratuito
- **Primeiros 2 capítulos** (confirmado)
- **Glossário completo** (100% gratuito)
- Todas as funcionalidades de leitura

#### Venda de PDF Completo
- **Preço**: **R$ 29,90** (confirmado)
- **O que inclui**:
  - Todos os capítulos em PDF
  - Formatação profissional
  - Capa e índice
  - Design temático
  - Download via link protegido (signed URL)
  - Link acessível na página após compra
  - Armazenamento: AWS S3 (privado)

#### Doações
- Valores sugeridos: R$ 10, R$ 25, R$ 50, R$ 100, personalizado
- Agradecimento na página de créditos
- Opção de nomear doador (se desejar)
- Não obrigatório, sempre disponível

### Estratégia de Conversão

1. **Primeiros capítulos gratuitos**: Engajar o leitor na história
2. **Preview elegante**: Mostrar primeiros parágrafos do capítulo pago
3. **Call-to-action claro**: "Este capítulo faz parte do livro completo"
4. **Botão destacado**: "Comprar PDF Completo" → Redireciona para página de venda
5. **Página de venda atrativa**: 
   - Capa/arte do livro
   - Sinopse envolvente
   - Preview do conteúdo
   - Benefícios do PDF
   - Preço claro
   - Botão de compra Stripe
6. **Processo simples**: Checkout rápido, download imediato
7. **Sem pressão**: Doações sempre disponíveis para quem quer apoiar

---

## 📊 Métricas de Sucesso

### KPIs Principais
- Taxa de conversão (visitante → comprador de PDF)
- Número de capítulos gratuitos lidos por usuário
- Uso do glossário (termos visualizados)
- Taxa de cliques em "Comprar PDF" vs compras completadas
- Taxa de doações
- Tempo médio de leitura por sessão
- Taxa de rejeição na página de venda

### Analytics
- Google Analytics 4
- Eventos customizados:
  - `chapter_started`
  - `chapter_completed`
  - `glossary_term_viewed`
  - `paywall_viewed` (capítulo pago visualizado)
  - `pdf_purchase_page_visited`
  - `pdf_purchase_initiated`
  - `pdf_purchase_completed`
  - `donation_made`

---

## 🔒 Considerações de Segurança

1. **Autenticação**: NextAuth + Firebase Auth
2. **Autorização**: Verificação de acesso server-side
3. **Pagamentos**: Stripe (PCI compliant)
4. **Dados**: Validação e sanitização de inputs
5. **Rate Limiting**: Proteção contra abuso
6. **HTTPS**: SSL obrigatório

---

## 🌐 SEO e Marketing

### SEO
- Meta tags otimizadas
- Open Graph tags
- Schema.org markup (Book, Article)
- Sitemap.xml
- Robots.txt

### Marketing
- Página de landing atrativa
- Preview de capítulos para compartilhamento
- Links de afiliado (opcional)
- Email marketing (notificar novos capítulos)
- Redes sociais

---

## 📝 Próximos Passos Imediatos

1. ✅ **Revisar e aprovar este plano** (atualizado com modelo PDF)
2. ✅ **Decisões definidas**:
   - Preço: R$ 29,90
   - Capítulos gratuitos: 2
   - Armazenamento: AWS S3
   - Download: Link na página (protegido)
3. **Definir datas e prazos específicos**
4. **Decisões finais** (ver seção "Decisões Pendentes Adicionais")
5. **Configurar ambiente de desenvolvimento**
   - Credenciais AWS S3
   - Configurar bucket
6. **Iniciar Fase 1: MVP do Leitor**

**📄 Ver também**: `sistema-protecao-pdf.md` para detalhes técnicos de proteção de download

---

## ✅ Decisões Definidas

1. **Preço do PDF**: **R$ 29,90** (confirmado)
2. **Quantidade de capítulos gratuitos**: **2 capítulos por história** (confirmado)
3. **Armazenamento de PDF**: **AWS S3** (confirmado)
4. **Envio de email**: **Apenas link na página** (confirmado)
5. **Segurança de download**: Sistema de autenticação necessário (ver seção abaixo)

## 🔒 Sistema de Proteção de Download (AWS S3)

### Desafio
Proteger PDFs no S3 para que apenas compradores possam baixar, mas sem enviar por email.

### Solução Proposta: Signed URLs (URLs Assinadas)

#### Como Funciona
1. **PDF no S3**: Armazenado em bucket privado (não acessível publicamente)
2. **Após compra bem-sucedida**: 
   - Registrar compra no banco (Firestore)
   - Associar compra ao usuário (se logado) ou email
   - Criar registro de acesso
3. **Link na página**: 
   - Gerar URL assinada (signed URL) com expiração (ex: 24h, 7 dias)
   - URL única e temporária para cada download
   - Verificar permissão antes de gerar

#### Fluxo Técnico

**1. Armazenamento no S3:**
```
s3://pegriam-pdfs/
  └── stories/
      └── [storyId]/
          └── livro-completo.pdf
```

**2. Estrutura de Dados (Firestore):**

```typescript
// Collection: pdf-purchases
interface PDFPurchase {
  id: string
  userId?: string // Se usuário logado
  email: string // Email do comprador
  storyId: string
  stripePaymentIntentId: string
  status: 'pending' | 'completed' | 'failed'
  purchaseDate: Date
  downloads: Array<{
    downloadDate: Date
    ipAddress?: string
    userAgent?: string
  }>
  lastDownloadUrl?: string // Última URL assinada gerada
  lastDownloadExpiry?: Date // Quando expira
}

// Collection: users (expandir)
interface User {
  // ... campos existentes
  pdfPurchases: string[] // IDs das compras de PDF
}
```

**3. API Endpoint: `/api/pdf/download/[purchaseId]`**

```typescript
// GET /api/pdf/download/[purchaseId]
// Verifica se a compra existe e está completa
// Gera URL assinada do S3
// Retorna URL temporária
// Registra tentativa de download

Fluxo:
1. Receber request com purchaseId
2. Buscar compra no Firestore
3. Verificar:
   - Status = 'completed'
   - Usuário logado OU email correspondente
4. Gerar signed URL do S3 (expiração: 1h)
5. Registrar download
6. Retornar URL assinada
```

**4. Página de Sucesso após Compra:**

```
/stories/[storyId]/purchase/success?payment_intent=[stripe_id]

Conteúdo:
- Mensagem de agradecimento
- Botão "Baixar PDF" (chama API acima)
- Link salvo em "Minhas Compras" (se logado)
- Informação: "Link válido por X dias"
```

**5. Página "Minhas Compras" (se logado):**

```
/profile/purchases

Lista todas as compras:
- Histórico de PDFs comprados
- Botão "Baixar Novamente" (gera nova signed URL)
- Limite de downloads (ex: 5 downloads por compra) - opcional
```

#### Segurança Adicional (Opcional)

**Opção 1: Limite de Downloads**
- Permitir N downloads por compra (ex: 5)
- Registrar cada tentativa
- Bloquear após limite atingido

**Opção 2: Expiração de Acesso**
- Link expira após X dias (ex: 30 dias)
- Após expiração, requer "re-ativação" manual

**Opção 3: Watermark no PDF**
- Adicionar watermark com email/ID do comprador
- Desencorajar compartilhamento ilegal

### Implementação Técnica

#### Dependências Necessárias
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### Variáveis de Ambiente
```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=pegriam-pdfs
```

#### Código Base (Next.js API Route)

```typescript
// src/app/api/pdf/download/[purchaseId]/route.ts
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export async function GET(
  request: Request,
  { params }: { params: { purchaseId: string } }
) {
  // 1. Verificar autenticação/autorização
  // 2. Buscar compra no Firestore
  // 3. Verificar se está completa
  // 4. Gerar signed URL
  // 5. Retornar URL
}
```

### Alternativa Mais Simples (Se não usar S3 Signed URLs)

**Opção: Proxy através da API Next.js**

```
1. PDF no S3 privado
2. API Next.js baixa do S3 (server-side)
3. Verifica permissão antes de servir
4. Retorna PDF como stream
```

**Vantagem**: Controle total server-side  
**Desvantagem**: Usa banda do servidor Next.js

---

## 🤔 Decisões Pendentes Adicionais

1. **Política de reembolso**: Para compras de PDF (se aplicável)
2. **Limite de downloads**: Permitir quantos downloads por compra? (ilimitado ou limitado?)
3. **Expiração do link**: Quanto tempo o link deve ficar válido? (1h, 24h, 7 dias, 30 dias?)
4. **Múltiplas histórias**: Prioridade ou adiar?
5. **Watermark no PDF**: Adicionar marca d'água com email do comprador? (anti-pirataria)

---

## 📚 Referências e Inspiração

- **Archive of Our Own (AO3)**: Sistema de tags e busca
- **Medium**: Experiência de leitura limpa
- **Kindle Cloud Reader**: Modo imersivo
- **Wattpad**: Sistema de progresso e bookmarks
- **World Anvil**: Sistema de glossário/wiki para worldbuilding

---

**Documentação criada em:** 2025
**Status:** Plano inicial completo, aguardando aprovação
**Próxima ação:** Revisão e início da Fase 1

