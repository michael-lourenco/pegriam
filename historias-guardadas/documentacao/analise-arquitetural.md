# Análise Arquitetural - Contos de Pegriam
## Decisão Técnica: Refatorar ou Recomeçar

**Data:** 2025  
**Arquiteto:** Análise Técnica Completa  
**Status:** Análise Concluída

---

## 📋 Sumário Executivo

Após análise profunda da estrutura atual do projeto, a **decisão técnica é: RECOMEÇAR DO ZERO** com uma arquitetura limpa baseada em Clean Architecture, SOLID e Design Patterns.

**Justificativa Principal:** A base atual mistura múltiplos domínios (gamificação, histórias, glossário) sem separação clara, viola princípios SOLID, e não suporta os requisitos de um sistema editorial avançado com editor WYSIWYG e worldbuilding.

---

## 🔍 Análise da Estrutura Atual

### Estrutura de Pastas Atual

```
src/
├── app/                    # Next.js App Router (OK)
│   ├── stories/           # Rotas de histórias (OK)
│   ├── glossary/          # Rotas de glossário (OK)
│   ├── story/             # ❌ DUPLICADO com stories/
│   ├── profile/           # ❌ Misturado com gamificação
│   └── api/               # ❌ APIs misturadas
│
├── components/            # ❌ Sem organização por domínio
│   ├── story/            # Componentes de histórias
│   ├── glossary/         # Componentes de glossário
│   ├── reader/           # Componentes de leitura
│   ├── user/             # ❌ Misturado com gamificação
│   ├── leaderboard/      # ❌ Domínio diferente (gamificação)
│   └── home/             # ❌ Genérico demais
│
├── services/             # ❌ Sem camadas claras
│   ├── stories/          # Funções soltas (não classes)
│   ├── chapters/         # Funções soltas
│   ├── glossary/         # Funções soltas
│   ├── firebase/          # ❌ Configuração misturada
│   ├── FirebaseService.ts # ❌ 529 linhas, múltiplas responsabilidades
│   ├── gamification/     # ❌ Domínio diferente
│   └── calculate/        # ❌ Domínio diferente
│
├── application/           # ⚠️ Incompleto
│   └── entities/        # Apenas User.ts
│
├── hooks/                # ✅ OK, mas pode melhorar
├── lib/                  # ✅ OK
└── types/                # ✅ OK, mas incompleto
```

### Problemas Arquiteturais Identificados

#### 1. **Violação do Single Responsibility Principle (SRP)**

**Exemplo Crítico:** `src/services/firebase/FirebaseService.ts` (529 linhas)

```typescript
// ❌ PROBLEMA: Um único arquivo com múltiplas responsabilidades
- Inicialização do Firebase
- Gerenciamento de usuários
- Histórico de partidas (gamificação)
- Sistema de créditos
- Sistema de moedas
- Sistema de histórias (StoryEntry)
- Leaderboard
- Autenticação
```

**Impacto:** Impossível testar, manter ou escalar.

#### 2. **Ausência de Camadas Arquiteturais**

**Problema:** Não há separação clara entre:
- **Domínio** (regras de negócio)
- **Aplicação** (casos de uso)
- **Infraestrutura** (Firebase, APIs)
- **UI** (componentes React)

**Evidência:**
- Componentes acessam diretamente `dbFirestore`
- Lógica de negócio espalhada em componentes
- Sem repositórios ou serviços de domínio

#### 3. **Mistura de Domínios Incompatíveis**

**Problema:** O projeto mistura:
- **Domínio Narrativo** (histórias, capítulos, glossário, mundo)
- **Domínio de Gamificação** (leaderboard, créditos, partidas)
- **Domínio de Autenticação** (usuários, permissões)

**Impacto:** Impossível aplicar Domain-Driven Design (DDD) ou separar contextos delimitados (Bounded Contexts).

#### 4. **Falta de Abstrações e Inversão de Dependência**

**Problema:** Código acoplado diretamente ao Firebase:

```typescript
// ❌ PROBLEMA: Acoplamento direto
import { dbFirestore } from '@/services/firebase/FirebaseService'
const stories = await getStories(dbFirestore)
```

**Deveria ser:**
```typescript
// ✅ SOLUÇÃO: Abstração via interface
const storyRepository = container.get<IStoryRepository>()
const stories = await storyRepository.findAll()
```

#### 5. **Ausência de Design Patterns**

**Problemas:**
- Sem Repository Pattern (acesso direto ao Firestore)
- Sem Factory Pattern (criação de entidades)
- Sem Service Layer Pattern (lógica espalhada)
- Sem Strategy Pattern (diferentes tipos de conteúdo)
- Sem Observer Pattern (eventos do sistema)

#### 6. **Estrutura de Dados Inadequada**

**Problema Atual:**
```typescript
// ❌ Capítulo como string Markdown simples
interface Chapter {
  content: string // Markdown ou HTML processado
}
```

**Requisito:**
```typescript
// ✅ Capítulo como blocos modulares
interface Chapter {
  blocks: ContentBlock[] // Texto, Imagem, Citação, Separador
}
```

**Impacto:** Impossível criar editor WYSIWYG ou reordenar blocos.

#### 7. **Autenticação e Autorização Inadequadas**

**Problema:**
- Sem middleware de proteção de rotas
- Sem sistema RBAC (Role-Based Access Control)
- Verificação de admin hardcoded (se existir)
- Sem estratégia clara para `kontempler@gmail.com`

#### 8. **Falta de Suporte a Worldbuilding**

**Problema:** Não há estrutura para:
- Regiões, Reinos, Dimensões, Eras
- Personagens com relacionamentos
- Equipamentos e Itens Únicos
- Sistema de referências cruzadas

---

## 🎯 Decisão Técnica: RECOMEÇAR DO ZERO

### Justificativa Técnica Detalhada

#### 1. **Incompatibilidade Arquitetural Fundamental**

A estrutura atual foi construída para um sistema de **gamificação** com histórias como feature secundária. Os requisitos atuais exigem um **sistema editorial avançado** com:

- Editor WYSIWYG/blocos
- Worldbuilding complexo
- Sistema de relacionamentos
- Múltiplos tipos de conteúdo

**Conclusão:** Refatorar seria mais custoso que recomeçar, pois exigiria:
- Desacoplar 529 linhas de `FirebaseService.ts`
- Separar domínios incompatíveis
- Reescrever toda a estrutura de dados
- Recriar componentes para suportar blocos

#### 2. **Dívida Técnica Crítica**

**Estimativa de Refatoração:**
- Refatorar `FirebaseService.ts`: 40-60 horas
- Separar domínios: 60-80 horas
- Implementar Clean Architecture: 80-100 horas
- Criar sistema de blocos: 60-80 horas
- **Total: 240-320 horas**

**Estimativa de Recomeçar:**
- Estrutura base Clean Architecture: 40-60 horas
- Implementar features core: 100-120 horas
- Migrar conteúdo existente: 20-30 horas
- **Total: 160-210 horas**

**Conclusão:** Recomeçar é **mais rápido e mais seguro**.

#### 3. **Preservação de Conteúdo**

Todo conteúdo atual será preservado em `/historias-guardadas` e migrado via scripts automatizados. **Nada será perdido**.

#### 4. **Aprendizado e Qualidade**

Rever do zero permite:
- Aplicar SOLID desde o início
- Implementar Clean Architecture corretamente
- Criar testes unitários desde o início
- Documentação adequada

---

## 🏗️ Arquitetura Proposta: Clean Architecture

### Estrutura de Camadas

```
src/
├── domain/                    # Camada de Domínio (Core)
│   ├── entities/             # Entidades de negócio
│   │   ├── Story.ts
│   │   ├── Chapter.ts
│   │   ├── ContentBlock.ts
│   │   ├── Character.ts
│   │   ├── World.ts
│   │   ├── Equipment.ts
│   │   └── Item.ts
│   │
│   ├── value-objects/        # Value Objects
│   │   ├── Email.ts
│   │   ├── Permission.ts
│   │   └── ContentBlockType.ts
│   │
│   ├── repositories/          # Interfaces (contratos)
│   │   ├── IStoryRepository.ts
│   │   ├── IChapterRepository.ts
│   │   ├── ICharacterRepository.ts
│   │   └── IWorldRepository.ts
│   │
│   └── services/             # Serviços de domínio
│       ├── StoryDomainService.ts
│       └── ContentBlockService.ts
│
├── application/               # Camada de Aplicação (Use Cases)
│   ├── use-cases/
│   │   ├── stories/
│   │   │   ├── CreateStoryUseCase.ts
│   │   │   ├── UpdateStoryUseCase.ts
│   │   │   ├── DeleteStoryUseCase.ts
│   │   │   └── GetStoryUseCase.ts
│   │   │
│   │   ├── chapters/
│   │   │   ├── CreateChapterUseCase.ts
│   │   │   ├── UpdateChapterUseCase.ts
│   │   │   ├── ReorderBlocksUseCase.ts
│   │   │   └── GetChapterUseCase.ts
│   │   │
│   │   ├── world/
│   │   │   ├── CreateCharacterUseCase.ts
│   │   │   ├── CreateRegionUseCase.ts
│   │   │   └── LinkEntitiesUseCase.ts
│   │   │
│   │   └── auth/
│   │       ├── CheckAdminPermissionUseCase.ts
│   │       └── AuthenticateUserUseCase.ts
│   │
│   └── dto/                   # Data Transfer Objects
│       ├── CreateStoryDTO.ts
│       ├── UpdateChapterDTO.ts
│       └── ContentBlockDTO.ts
│
├── infrastructure/            # Camada de Infraestrutura
│   ├── database/
│   │   ├── firestore/
│   │   │   ├── FirestoreStoryRepository.ts
│   │   │   ├── FirestoreChapterRepository.ts
│   │   │   └── FirestoreCharacterRepository.ts
│   │   │
│   │   └── supabase/          # Para dados narrativos
│   │       ├── SupabaseStoryRepository.ts
│   │       └── SupabaseWorldRepository.ts
│   │
│   ├── auth/
│   │   ├── FirebaseAuthService.ts
│   │   └── PermissionService.ts
│   │
│   ├── storage/
│   │   └── ImageStorageService.ts
│   │
│   └── config/
│       ├── firebase.config.ts
│       └── supabase.config.ts
│
├── presentation/              # Camada de Apresentação (UI)
│   ├── pages/                 # Next.js Pages (App Router)
│   │   ├── (public)/
│   │   │   ├── stories/
│   │   │   ├── glossary/
│   │   │   └── world/
│   │   │
│   │   └── (admin)/
│   │       ├── admin/
│   │       │   ├── stories/
│   │       │   ├── chapters/
│   │       │   ├── characters/
│   │       │   └── world/
│   │       │
│   │       └── editor/
│   │           └── [storyId]/
│   │               └── [chapterId]/
│   │
│   ├── components/
│   │   ├── reader/            # Componentes de leitura
│   │   ├── editor/            # Componentes do editor
│   │   │   ├── BlockEditor.tsx
│   │   │   ├── TextBlock.tsx
│   │   │   ├── ImageBlock.tsx
│   │   │   └── QuoteBlock.tsx
│   │   │
│   │   ├── world/             # Componentes de worldbuilding
│   │   └── shared/            # Componentes compartilhados
│   │
│   ├── hooks/                 # React Hooks
│   │   ├── useStory.ts
│   │   ├── useChapter.ts
│   │   └── useEditor.ts
│   │
│   └── providers/               # Context Providers
│       ├── AuthProvider.tsx
│       └── EditorProvider.tsx
│
└── shared/                    # Código compartilhado
    ├── types/                 # Types compartilhados
    ├── utils/                 # Utilitários
    └── constants/             # Constantes
```

---

## 📊 Modelagem de Dados

### 1. Story (História)

```typescript
// domain/entities/Story.ts
export class Story {
  constructor(
    public readonly id: StoryId,
    public readonly title: string,
    public readonly description: string,
    public readonly author: string,
    public readonly coverImage?: string,
    public readonly publishedAt: Date,
    public readonly status: StoryStatus,
    public readonly freeChapters: number,
    public readonly pdfPrice: number,
    public readonly tags: string[],
    public readonly metadata: StoryMetadata,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: CreateStoryDTO): Story {
    // Factory method com validações
  }

  canBeEditedBy(user: User): boolean {
    // Regra de negócio
  }
}

export type StoryStatus = 'draft' | 'publishing' | 'completed';
export type StoryId = string & { readonly __brand: 'StoryId' };
```

### 2. Chapter (Capítulo com Blocos)

```typescript
// domain/entities/Chapter.ts
export class Chapter {
  constructor(
    public readonly id: ChapterId,
    public readonly storyId: StoryId,
    public readonly number: number,
    public readonly title: string,
    public readonly blocks: ContentBlock[], // ✅ Blocos modulares
    public readonly publishedAt: Date,
    public readonly isFree: boolean,
    public readonly estimatedReadTime: number,
    public readonly wordCount: number,
    public readonly order: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  reorderBlocks(newOrder: number[]): Chapter {
    // Regra de negócio: reordenar blocos
  }

  addBlock(block: ContentBlock, position: number): Chapter {
    // Regra de negócio: adicionar bloco
  }

  removeBlock(blockId: string): Chapter {
    // Regra de negócio: remover bloco
  }
}
```

### 3. ContentBlock (Bloco de Conteúdo)

```typescript
// domain/entities/ContentBlock.ts
export abstract class ContentBlock {
  constructor(
    public readonly id: string,
    public readonly type: ContentBlockType,
    public readonly order: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  abstract toMarkdown(): string;
  abstract toHTML(): string;
  abstract toJSON(): ContentBlockDTO;
}

export class TextBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    public readonly content: string,
    public readonly format?: TextFormat,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, 'text', order, createdAt || new Date(), updatedAt || new Date());
  }

  toMarkdown(): string {
    return this.content;
  }

  toHTML(): string {
    // Converter markdown para HTML
  }
}

export class ImageBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    public readonly url: string,
    public readonly alt: string,
    public readonly caption?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, 'image', order, createdAt || new Date(), updatedAt || new Date());
  }

  toMarkdown(): string {
    return `![${this.alt}](${this.url})${this.caption ? `\n*${this.caption}*` : ''}`;
  }
}

export class QuoteBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    public readonly quote: string,
    public readonly author?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, 'quote', order, createdAt || new Date(), updatedAt || new Date());
  }

  toMarkdown(): string {
    return `> ${this.quote}${this.author ? `\n> — ${this.author}` : ''}`;
  }
}

export class SeparatorBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, 'separator', order, createdAt || new Date(), updatedAt || new Date());
  }

  toMarkdown(): string {
    return '---';
  }
}

export type ContentBlockType = 'text' | 'image' | 'quote' | 'separator';
```

### 4. Character (Personagem)

```typescript
// domain/entities/Character.ts
export class Character {
  constructor(
    public readonly id: CharacterId,
    public readonly name: string,
    public readonly biography: string,
    public readonly imageUrl?: string,
    public readonly appearances: CharacterAppearance[],
    public readonly relationships: CharacterRelationship[],
    public readonly equipment: EquipmentId[],
    public readonly items: ItemId[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  addAppearance(storyId: StoryId, chapterId: ChapterId, context: string): Character {
    // Regra de negócio
  }

  linkToEquipment(equipmentId: EquipmentId): Character {
    // Regra de negócio
  }
}

export interface CharacterAppearance {
  storyId: StoryId;
  chapterId: ChapterId;
  context: string;
}

export interface CharacterRelationship {
  characterId: CharacterId;
  type: 'ally' | 'enemy' | 'mentor' | 'family' | 'romance';
  description: string;
}
```

### 5. World (Mundo)

```typescript
// domain/entities/World.ts
export abstract class WorldEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly imageUrl?: string,
    public readonly references: WorldReference[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

export class Region extends WorldEntity {
  constructor(
    id: string,
    name: string,
    description: string,
    public readonly realm: RealmId,
    public readonly dimensions: DimensionId[],
    imageUrl?: string,
    references?: WorldReference[],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, name, description, imageUrl, references || [], createdAt || new Date(), updatedAt || new Date());
  }
}

export class Realm extends WorldEntity {
  constructor(
    id: string,
    name: string,
    description: string,
    public readonly era: EraId,
    public readonly regions: RegionId[],
    imageUrl?: string,
    references?: WorldReference[],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, name, description, imageUrl, references || [], createdAt || new Date(), updatedAt || new Date());
  }
}

export class Dimension extends WorldEntity {
  constructor(
    id: string,
    name: string,
    description: string,
    public readonly characteristics: string[],
    imageUrl?: string,
    references?: WorldReference[],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, name, description, imageUrl, references || [], createdAt || new Date(), updatedAt || new Date());
  }
}

export class Era extends WorldEntity {
  constructor(
    id: string,
    name: string,
    description: string,
    public readonly startYear: number,
    public readonly endYear?: number,
    public readonly events: string[],
    imageUrl?: string,
    references?: WorldReference[],
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, name, description, imageUrl, references || [], createdAt || new Date(), updatedAt || new Date());
  }
}

export interface WorldReference {
  storyId?: StoryId;
  chapterId?: ChapterId;
  characterId?: CharacterId;
  context: string;
}
```

### 6. Equipment (Equipamento)

```typescript
// domain/entities/Equipment.ts
export class Equipment {
  constructor(
    public readonly id: EquipmentId,
    public readonly name: string,
    public readonly description: string,
    public readonly origin: string,
    public readonly rarity: Rarity,
    public readonly imageUrl?: string,
    public readonly knownUsers: CharacterId[],
    public readonly references: WorldReference[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  addKnownUser(characterId: CharacterId): Equipment {
    // Regra de negócio
  }
}

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
```

### 7. Item (Item Único / Artefato)

```typescript
// domain/entities/Item.ts
export class Item {
  constructor(
    public readonly id: ItemId,
    public readonly name: string,
    public readonly description: string,
    public readonly history: string,
    public readonly impact: string,
    public readonly imageUrl?: string,
    public readonly relatedCharacters: CharacterId[],
    public readonly relatedEvents: string[],
    public readonly references: WorldReference[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
```

---

## 🔐 Estratégia de Autenticação e Autorização

### 1. Autenticação (Firebase Auth)

```typescript
// infrastructure/auth/FirebaseAuthService.ts
export class FirebaseAuthService implements IAuthService {
  async authenticate(email: string, password: string): Promise<User> {
    // Implementação Firebase Auth
  }

  async getCurrentUser(): Promise<User | null> {
    // Obter usuário atual
  }

  async logout(): Promise<void> {
    // Logout
  }
}
```

### 2. Autorização (RBAC)

```typescript
// domain/value-objects/Permission.ts
export class Permission {
  private static readonly ADMIN_EMAIL = 'kontempler@gmail.com';

  static isAdmin(user: User): boolean {
    return user.email === this.ADMIN_EMAIL;
  }

  static canEditStory(user: User, story: Story): boolean {
    return this.isAdmin(user);
  }

  static canCreateChapter(user: User, story: Story): boolean {
    return this.isAdmin(user);
  }

  static canEditWorld(user: User): boolean {
    return this.isAdmin(user);
  }
}
```

### 3. Middleware de Proteção

```typescript
// presentation/middleware/adminMiddleware.ts
export function withAdminAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await getCurrentUser();
    
    if (!user || !Permission.isAdmin(user)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return handler(req, res);
  };
}
```

### 4. Proteção de Rotas (Next.js)

```typescript
// presentation/pages/(admin)/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  
  if (!user || !Permission.isAdmin(user)) {
    redirect('/');
  }

  return <>{children}</>;
}
```

---

## 🗄️ Estratégia de Banco de Dados

### Firebase Firestore (Autenticação e Controle)

**Collections:**
- `users` - Usuários e permissões
- `sessions` - Sessões ativas

### Supabase (Dados Narrativos)

**Tables:**
- `stories` - Histórias
- `chapters` - Capítulos
- `content_blocks` - Blocos de conteúdo
- `characters` - Personagens
- `world_regions` - Regiões
- `world_realms` - Reinos
- `world_dimensions` - Dimensões
- `world_eras` - Eras
- `equipment` - Equipamentos
- `items` - Itens únicos
- `character_relationships` - Relacionamentos
- `world_references` - Referências cruzadas

**Justificativa:**
- Firebase: Excelente para autenticação e controle de acesso
- Supabase: Melhor para dados relacionais complexos (worldbuilding)
- Supabase: Suporta queries SQL complexas
- Supabase: Melhor para relacionamentos entre entidades

---

## 📦 Estratégia de Migração de Conteúdo

### 1. Preservação

Todo conteúdo atual será movido para `/historias-guardadas`:

```
historias-guardadas/
├── stories/
│   └── lenda-de-nix/
│       ├── capitulo-01.md
│       └── capitulo-02.md
├── glossary/
│   └── termos.json
└── README.md
```

### 2. Script de Migração

```typescript
// scripts/migrate-to-new-architecture.ts
// Converte Markdown antigo para blocos modulares
// Migra para Supabase
// Preserva referências
```

---

## 🎨 Editor WYSIWYG / Blocos

### Tecnologia Proposta

**Opção 1: Block Editor (Recomendado)**
- **Editor.js** ou **Tiptap** (baseado em ProseMirror)
- Suporta blocos modulares nativamente
- Extensível e customizável

**Opção 2: WYSIWYG Tradicional**
- **Draft.js** ou **Slate.js**
- Mais complexo para blocos

### Estrutura do Editor

```typescript
// presentation/components/editor/BlockEditor.tsx
export function BlockEditor({ chapter, onSave }: BlockEditorProps) {
  const editor = useEditor({
    extensions: [
      TextBlockExtension,
      ImageBlockExtension,
      QuoteBlockExtension,
      SeparatorBlockExtension,
    ],
    content: chapter.blocks,
  });

  return (
    <EditorContent editor={editor} />
  );
}
```

---

## ✅ Checklist de Implementação

### Fase 1: Fundação (Semana 1-2)
- [ ] Estrutura de pastas Clean Architecture
- [ ] Configuração Firebase + Supabase
- [ ] Entidades de domínio (Story, Chapter, ContentBlock)
- [ ] Repositórios (interfaces)
- [ ] Implementações Firestore/Supabase
- [ ] Sistema de autenticação
- [ ] Middleware de autorização

### Fase 2: Core Features (Semana 3-4)
- [ ] Use Cases de Stories
- [ ] Use Cases de Chapters
- [ ] Sistema de blocos modulares
- [ ] Editor de blocos
- [ ] Leitor público
- [ ] Migração de conteúdo existente

### Fase 3: Worldbuilding (Semana 5-6)
- [ ] Entidades de mundo (Character, Region, etc.)
- [ ] Use Cases de worldbuilding
- [ ] Sistema de relacionamentos
- [ ] Interface de worldbuilding
- [ ] Referências cruzadas

### Fase 4: Polimento (Semana 7-8)
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Documentação
- [ ] Performance
- [ ] SEO

---

## 📝 Conclusão

A decisão de **recomeçar do zero** é tecnicamente justificada por:

1. **Incompatibilidade arquitetural fundamental**
2. **Dívida técnica crítica** (529 linhas em um arquivo)
3. **Mistura de domínios incompatíveis**
4. **Falta de suporte a requisitos** (blocos modulares, worldbuilding)
5. **Custo-benefício** (recomeçar é mais rápido)

A nova arquitetura seguirá **Clean Architecture**, **SOLID**, e **Design Patterns**, garantindo:

- ✅ Escalabilidade
- ✅ Manutenibilidade
- ✅ Testabilidade
- ✅ Separação de responsabilidades
- ✅ Suporte a todos os requisitos

**Próximo passo:** Aprovação e início da implementação da Fase 1.

---

**Documento criado em:** 2025  
**Versão:** 1.0  
**Status:** Aguardando Aprovação

