# Próximo Passo: Implementação - Estado Atual e Recomendações

## Data: 2025
## Projeto: pegriam.com - Plataforma de Leitura Épica

---

## 📊 Estado Atual do Projeto

### ✅ Fase 1: MVP do Leitor - **CONCLUÍDA**

**O que foi implementado:**
- ✅ Estrutura de tipos TypeScript (`Story`, `Chapter`)
- ✅ Serviços Firestore (buscar histórias, capítulos)
- ✅ Parser de Markdown (`marked` + `@tailwindcss/typography`)
- ✅ Componentes do leitor:
  - `ChapterReader.tsx` - Leitor principal
  - `NavigationButtons.tsx` - Navegação anterior/próximo
  - `ReaderControls.tsx` - Controles (tema claro/escuro)
  - `StoryCard.tsx` - Card de história
- ✅ Páginas:
  - `/stories` - Lista de histórias
  - `/stories/[storyId]` - Página da história
  - `/stories/[storyId]/chapter/[chapterId]` - Leitor de capítulo
  - `/stories/[storyId]/purchase` - Página de compra (estrutura criada, sem Stripe)
- ✅ Tema claro/escuro funcional
- ✅ Navegação entre capítulos
- ✅ Indicador de progresso de leitura

**Arquivos principais:**
- `src/types/story.ts`
- `src/services/stories/` (getStories, getStory)
- `src/services/chapters/` (getChapters, getChapter)
- `src/lib/markdown/parser.ts`
- `src/components/reader/`
- `src/app/stories/`

---

## 🎯 Próximo Passo Recomendado

### **Fase 2: Sistema de Glossário Interativo**

**Prioridade:** Alta  
**Tempo estimado:** 2 semanas  
**Complexidade:** Média

**Por que este é o próximo passo:**
1. **Diferencial competitivo**: O glossário é uma funcionalidade única que diferencia a plataforma
2. **Valor para o usuário**: Ajuda leitores a entenderem o mundo complexo de Kontempler
3. **100% gratuito**: Conforme planejado, o glossário será totalmente gratuito, aumentando engajamento
4. **Base para monetização**: Um glossário rico aumenta o valor percebido do PDF completo
5. **Não bloqueia outras fases**: Pode ser desenvolvido em paralelo com outras funcionalidades

---

## 📋 Tarefas da Fase 2: Sistema de Glossário

### 1. Estrutura de Dados no Firestore

**Collection: `glossary`**

```typescript
interface GlossaryTerm {
  id: string
  term: string
  aliases: string[] // Variações do nome (ex: "Nix", "Nix Volstein", "A Fênix")
  category: 'character' | 'location' | 'magic' | 'object' | 'creature' | 'organization' | 'concept'
  shortDescription: string // Para tooltips (máx 150 caracteres)
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
  createdAt: Date
  updatedAt: Date
}
```

**Tarefas:**
- [ ] Criar interface TypeScript em `src/types/glossary.ts`
- [ ] Criar collection no Firestore
- [ ] Popular com termos iniciais (personagens principais, lugares, conceitos mágicos)

### 2. Serviços para Glossário

**Arquivos a criar:**
- `src/services/glossary/getGlossary.ts` - Buscar todos os termos
- `src/services/glossary/getTerm.ts` - Buscar termo específico
- `src/services/glossary/searchGlossary.ts` - Buscar termos por texto
- `src/services/glossary/getTermsByCategory.ts` - Filtrar por categoria

**Tarefas:**
- [ ] Implementar serviços de busca no Firestore
- [ ] Criar funções de filtro e ordenação
- [ ] Implementar cache local (opcional)

### 3. Detecção de Termos no Texto

**Arquivo:** `src/lib/glossary/matcher.ts`

**Funcionalidade:**
- Detectar termos do glossário no conteúdo do capítulo
- Suportar aliases (variações do nome)
- Marcar termos no HTML renderizado
- Evitar sobreposição de termos

**Tarefas:**
- [ ] Criar função de matching de termos
- [ ] Implementar detecção case-insensitive
- [ ] Suportar aliases e variações
- [ ] Marcar termos no HTML com atributos data-*

### 4. Componentes do Glossário

**Componentes a criar:**

#### 4.1 `GlossaryTooltip.tsx`
- Tooltip ao hover sobre termos
- Mostrar descrição curta
- Link para página completa
- Posicionamento inteligente

#### 4.2 `GlossaryModal.tsx`
- Modal ao clicar em termo
- Informações completas
- Termos relacionados
- Botão para página dedicada

#### 4.3 `GlossarySidebar.tsx`
- Sidebar contextual
- Abre ao clicar em termo
- Mostra informações relacionadas
- Fecha com X ou clique fora

#### 4.4 `GlossaryTermCard.tsx`
- Card para página de glossário
- Imagem (se disponível)
- Categoria com badge
- Link para página do termo

#### 4.5 `GlossarySearch.tsx`
- Barra de busca
- Autocomplete/sugestões
- Filtros por categoria
- Resultados em tempo real

**Tarefas:**
- [ ] Criar componentes base
- [ ] Implementar tooltips com Radix UI
- [ ] Criar modal com informações completas
- [ ] Implementar sidebar contextual
- [ ] Criar cards para página de glossário
- [ ] Implementar busca com filtros

### 5. Página Dedicada de Glossário

**Rota:** `/glossary`

**Funcionalidades:**
- Lista completa de termos
- Filtros por categoria
- Busca por nome/descrição
- Ordenação alfabética
- Cards visuais para cada termo
- Paginação (se necessário)

**Tarefas:**
- [ ] Criar página `/app/glossary/page.tsx`
- [ ] Implementar layout com filtros e busca
- [ ] Exibir termos em grid de cards
- [ ] Criar página individual do termo `/glossary/[termId]`

### 6. Integração com Leitor

**Modificações necessárias:**

**Arquivo:** `src/components/reader/ChapterReader.tsx`

**Funcionalidades:**
- Processar conteúdo do capítulo para detectar termos
- Adicionar tooltips aos termos detectados
- Permitir clique para abrir modal/sidebar
- Destacar termos visualmente (sublinhado ou cor diferente)

**Tarefas:**
- [ ] Integrar detecção de termos no parser de Markdown
- [ ] Adicionar tooltips aos termos
- [ ] Implementar clique para abrir modal/sidebar
- [ ] Estilizar termos destacados

### 7. Hook Customizado

**Arquivo:** `src/hooks/useGlossary.ts`

**Funcionalidades:**
- Buscar termos do glossário
- Cache de termos carregados
- Função de busca
- Gerenciar estado de termos ativos

**Tarefas:**
- [ ] Criar hook useGlossary
- [ ] Implementar cache com React Query
- [ ] Criar funções auxiliares

---

## 📝 Checklist de Implementação - Fase 2

### Preparação
- [ ] Criar interface TypeScript `GlossaryTerm`
- [ ] Criar collection `glossary` no Firestore
- [ ] Popular com termos iniciais (mínimo 20-30 termos principais)

### Serviços
- [ ] `getGlossary.ts` - Buscar todos os termos
- [ ] `getTerm.ts` - Buscar termo específico
- [ ] `searchGlossary.ts` - Buscar por texto
- [ ] `getTermsByCategory.ts` - Filtrar por categoria

### Bibliotecas
- [ ] `matcher.ts` - Detecção de termos no texto
- [ ] `formatter.ts` - Formatação de termos no HTML

### Componentes
- [ ] `GlossaryTooltip.tsx` - Tooltip ao hover
- [ ] `GlossaryModal.tsx` - Modal ao clique
- [ ] `GlossarySidebar.tsx` - Sidebar contextual
- [ ] `GlossaryTermCard.tsx` - Card na página
- [ ] `GlossarySearch.tsx` - Busca e filtros

### Páginas
- [ ] `/glossary/page.tsx` - Página principal do glossário
- [ ] `/glossary/[termId]/page.tsx` - Página do termo

### Integração
- [ ] Integrar detecção no `ChapterReader.tsx`
- [ ] Adicionar tooltips aos termos
- [ ] Implementar clique para modal/sidebar
- [ ] Estilizar termos destacados

### Hook
- [ ] `useGlossary.ts` - Hook customizado

### Testes
- [ ] Testar detecção de termos
- [ ] Testar tooltips e modais
- [ ] Testar busca e filtros
- [ ] Testar responsividade

---

## 🎨 Design e UX

### Estilo dos Termos no Texto
- **Cor**: Púrpura (#8B5CF6) ou dourado (#F59E0B)
- **Estilo**: Sublinhado pontilhado ou cor diferente
- **Hover**: Mudança de cor + cursor pointer
- **Transição**: Suave (200ms)

### Tooltip
- **Fundo**: Escuro com blur (backdrop-blur)
- **Texto**: Branco
- **Tamanho**: Compacto (máx 200px largura)
- **Posicionamento**: Acima ou abaixo do termo (evitar sair da tela)

### Modal
- **Largura**: Máx 600px
- **Altura**: Máx 80vh
- **Conteúdo**: 
  - Título do termo
  - Categoria (badge)
  - Descrição completa
  - Termos relacionados (links)
  - Primeira aparição (link para capítulo)

### Sidebar
- **Largura**: 400px (desktop), 100% (mobile)
- **Posição**: Direita (desktop), bottom sheet (mobile)
- **Animação**: Slide in/out

---

## 📚 Termos Iniciais para Popular o Glossário

### Personagens Principais
- Nix Volstein (A Fênix)
- Emmantor
- Galneon
- Einar
- Pegriam
- Denver
- Rain

### Lugares Principais
- Kontempler
- Lorium
- Floresta de Eldoria
- Sylvandor
- Arcanis Librarium
- Rendant
- Liftén
- Memphit
- Colina Ardente
- Henrraina
- Solavoltir
- Castelo Sem Fim

### Conceitos Mágicos
- Feiticeira dos Elementos
- Magia Elemental
- Aumar
- Lágrimas de Nix
- Fênix

### Organizações
- Cavaleiros de Randal
- Arcanis Librarium

---

## 🔄 Alternativa: Fase 3 (Monetização) Primeiro

**Se preferir priorizar monetização:**

**Vantagens:**
- Gera receita mais rápido
- Completa o fluxo de compra já iniciado
- Página de compra já existe (só falta Stripe)

**Desvantagens:**
- Glossário aumenta valor percebido do produto
- Pode ser mais complexo (AWS S3, Stripe webhooks)

**Recomendação:** Implementar Fase 2 primeiro, mas a decisão é sua.

---

## 📊 Métricas de Sucesso - Fase 2

- [ ] 30+ termos no glossário
- [ ] Detecção de termos funcionando em capítulos
- [ ] Tooltips aparecendo corretamente
- [ ] Busca retornando resultados relevantes
- [ ] Página de glossário responsiva
- [ ] Tempo de carregamento < 2s

---

## 🚀 Como Começar

1. **Decidir prioridade**: Glossário (Fase 2) ou Monetização (Fase 3)?
2. **Se escolher Glossário:**
   - Começar criando tipos TypeScript
   - Criar collection no Firestore
   - Popular com termos iniciais
   - Implementar serviços básicos
   - Criar componentes um por um
3. **Se escolher Monetização:**
   - Ver documento `sistema-protecao-pdf.md`
   - Configurar AWS S3
   - Integrar Stripe
   - Implementar webhooks

---

## 📝 Notas Importantes

1. **Glossário é 100% gratuito**: Conforme planejado, não deve ter paywall
2. **Performance**: Detecção de termos deve ser eficiente (não bloquear renderização)
3. **Acessibilidade**: Tooltips e modais devem ser acessíveis (ARIA labels, navegação por teclado)
4. **Mobile-first**: Todos os componentes devem funcionar bem em mobile

---

## 📚 Referências

- **Documentação base**: `plano-site-pegriam-com.md`
- **Fase 1 concluída**: `fase1-implementacao.md`
- **Sistema PDF**: `sistema-protecao-pdf.md`
- **Material do mundo**: `INFORMACOES_BASE.MD`

---

**Documentação criada em:** 2025  
**Status:** Aguardando decisão sobre próximo passo  
**Recomendação:** Iniciar Fase 2 (Sistema de Glossário)

