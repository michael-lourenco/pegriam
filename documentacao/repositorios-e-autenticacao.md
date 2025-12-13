# Repositórios e Sistema de Autenticação

**Data:** 2025  
**Status:** ✅ Implementado

---

## 📋 O que foi implementado

### 1. **Repositórios Supabase**

#### `SupabaseStoryRepository`
- ✅ Implementa `IStoryRepository`
- ✅ Métodos: `save`, `findById`, `findAll`, `findByStatus`, `delete`, `exists`
- ✅ Conversão automática entre entidades de domínio e documentos do banco
- ✅ Tratamento de erros

#### `SupabaseChapterRepository`
- ✅ Implementa `IChapterRepository`
- ✅ Métodos: `save`, `findById`, `findByStoryId`, `findByStoryIdAndNumber`, `delete`, `exists`, `countByStoryId`
- ✅ Conversão automática de blocos de conteúdo
- ✅ Tratamento de erros

### 2. **Sistema de Autenticação**

#### `FirebaseAuthService`
- ✅ Login com email/senha
- ✅ Criação de conta
- ✅ Logout
- ✅ Recuperação de senha
- ✅ Observação de mudanças no estado de autenticação
- ✅ Conversão de Firebase User para User do domínio

#### `AuthProvider` (React)
- ✅ Context API para gerenciar estado de autenticação
- ✅ Hook `useAuth()` para acessar autenticação
- ✅ Estado de loading
- ✅ Métodos: `signIn`, `signUp`, `signOut`, `resetPassword`

#### Middleware de Proteção
- ✅ `middleware.ts` para proteger rotas admin
- ✅ Redirecionamento automático para login
- ✅ Suporte a rotas públicas e privadas

#### Hooks de Proteção
- ✅ `useRequireAuth` - Protege componentes que requerem autenticação
- ✅ `useRequireAdmin` - Protege componentes que requerem admin

### 3. **Use Cases**

#### Stories
- ✅ `CreateStoryUseCase` - Criar nova história
- ✅ `GetStoryUseCase` - Buscar história por ID
- ✅ `GetAllStoriesUseCase` - Buscar todas as histórias
- ✅ `UpdateStoryUseCase` - Atualizar história
- ✅ `DeleteStoryUseCase` - Deletar história

#### Chapters
- ✅ `CreateChapterUseCase` - Criar novo capítulo
- ✅ `GetChapterUseCase` - Buscar capítulo por ID

---

## 🏗️ Estrutura de Dados no Supabase

### Tabela: `stories`
```sql
CREATE TABLE stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT,
  published_at TIMESTAMP NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'publishing', 'completed')),
  free_chapters INTEGER NOT NULL DEFAULT 0,
  pdf_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{"total_chapters": 0, "estimated_read_time": 0}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Tabela: `chapters`
```sql
CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]',
  published_at TIMESTAMP NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT false,
  estimated_read_time INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(story_id, number)
);

CREATE INDEX idx_chapters_story_id ON chapters(story_id);
CREATE INDEX idx_chapters_order ON chapters(story_id, "order");
```

---

## 📖 Como Usar

### 1. **Usar Repositórios**

```typescript
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { CreateStoryUseCase } from '@/application/use-cases';

// Inicializar repositório
const storyRepository = new SupabaseStoryRepository();

// Criar use case
const createStoryUseCase = new CreateStoryUseCase(storyRepository);

// Usar
const story = await createStoryUseCase.execute(user, {
  title: 'Nova História',
  description: 'Descrição...',
  author: 'Pegriam',
  status: 'draft',
  freeChapters: 2,
  pdfPrice: 9.99,
  tags: ['fantasia', 'aventura'],
});
```

### 2. **Usar Autenticação**

```tsx
'use client';

import { useAuth } from '@/presentation/providers/AuthProvider';

export function MyComponent() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Faça login</div>;

  return (
    <div>
      <p>Olá, {user.name || user.email.getValue()}</p>
      <button onClick={() => signOut()}>Sair</button>
    </div>
  );
}
```

### 3. **Proteger Rotas**

```tsx
'use client';

import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';

export default function AdminPage() {
  const { user, isAdmin } = useRequireAdmin();

  if (!isAdmin) {
    return null; // Será redirecionado automaticamente
  }

  return <div>Conteúdo Admin</div>;
}
```

### 4. **Usar Middleware**

O middleware já está configurado em `src/middleware.ts`. Ele protege automaticamente:
- Rotas `/admin/*` - Requer autenticação admin
- Rotas públicas - Acesso livre

---

## 🔐 Permissões

### Admin
- Email: `kontempler@gmail.com`
- Pode: Criar, editar, deletar histórias e capítulos
- Acesso: `/admin/*`

### Usuário Comum
- Pode: Ler histórias e capítulos gratuitos
- Limite: 2 capítulos gratuitos por história
- Acesso: `/stories/*`

---

## 🚀 Próximos Passos

1. **Criar tabelas no Supabase**
   - Executar SQL acima no Supabase
   - Configurar RLS (Row Level Security) se necessário

2. **Criar páginas de autenticação**
   - `/login` - Página de login
   - `/signup` - Página de cadastro
   - `/forgot-password` - Recuperação de senha

3. **Criar páginas públicas**
   - `/stories` - Lista de histórias
   - `/stories/[id]` - Página da história
   - `/stories/[id]/chapter/[chapterId]` - Leitor de capítulo

4. **Criar páginas admin**
   - `/admin` - Dashboard
   - `/admin/stories` - Gerenciar histórias
   - `/admin/stories/[id]/editor` - Editor de capítulos

---

## ✅ Checklist

- [x] Repositórios implementados
- [x] Sistema de autenticação completo
- [x] Middleware de proteção
- [x] Hooks de proteção
- [x] Use cases básicos
- [ ] Tabelas criadas no Supabase
- [ ] Páginas de autenticação
- [ ] Páginas públicas
- [ ] Páginas admin

