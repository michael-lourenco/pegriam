# Próximos Passos - Contos de Pegriam

**Data:** 2025  
**Status:** Planejamento - Fase 3

---

## 🎯 Prioridade: Editor de Conteúdo

O editor é crítico para o admin poder criar e editar capítulos com blocos modulares.

### Fase 3.1: Editor Básico de Capítulos

#### 1. Página de Edição de História
- [ ] `/admin/stories/[id]` - Editar informações da história
- [ ] Formulário para atualizar título, descrição, tags, etc.
- [ ] Lista de capítulos com ações (editar, deletar, reordenar)

#### 2. Editor de Capítulos
- [ ] `/admin/stories/[id]/editor` - Editor principal
- [ ] Criar novo capítulo
- [ ] Editar capítulo existente
- [ ] Visualizar lista de blocos do capítulo

#### 3. Editor de Blocos Modulares
- [ ] Adicionar bloco (texto, imagem, citação, separador)
- [ ] Editar bloco existente
- [ ] Remover bloco
- [ ] Reordenar blocos (drag & drop)

#### 4. Preview em Tempo Real
- [ ] Preview ao lado do editor
- [ ] Atualização automática ao editar blocos

---

## 🎯 Fase 3.2: Melhorias do Editor

#### 1. Upload de Imagens
- [ ] Integração com Supabase Storage ou AWS S3
- [ ] Upload de imagens para blocos ImageBlock
- [ ] Preview de imagens antes de salvar

#### 2. Editor WYSIWYG (Opcional)
- [ ] Editor rico para TextBlock (Markdown ou WYSIWYG)
- [ ] Suporte a formatação (negrito, itálico, links)

#### 3. Validações
- [ ] Validação de capítulos antes de salvar
- [ ] Verificação de blocos obrigatórios
- [ ] Feedback visual de erros

---

## 🎯 Fase 4: Sistema de Mundo (World Codex)

### Entidades do Mundo

#### 1. Personagens (Characters)
- [ ] Entidade `Character` no domínio
- [ ] Repositório `ICharacterRepository`
- [ ] Use cases (Create, Get, Update, Delete)
- [ ] Página `/world/characters`
- [ ] Página `/world/characters/[id]`

#### 2. Regiões (Regions)
- [ ] Entidade `Region` no domínio
- [ ] Repositório `IRegionRepository`
- [ ] Use cases
- [ ] Páginas de visualização

#### 3. Equipamentos (Equipment)
- [ ] Entidade `Equipment` no domínio
- [ ] Repositório `IEquipmentRepository`
- [ ] Use cases
- [ ] Páginas de visualização

#### 4. Itens Únicos (UniqueItems)
- [ ] Entidade `UniqueItem` no domínio
- [ ] Repositório `IUniqueItemRepository`
- [ ] Use cases
- [ ] Páginas de visualização

#### 5. Relacionamentos
- [ ] Personagens podem ter equipamentos
- [ ] Itens podem estar relacionados a personagens
- [ ] Regiões podem conter personagens
- [ ] Sistema de referências cruzadas

---

## 🎯 Fase 5: Monetização

#### 1. Integração Stripe
- [ ] Configuração Stripe
- [ ] Página de checkout
- [ ] Webhooks para processar pagamentos

#### 2. Venda de PDFs
- [ ] Geração de PDF a partir de capítulos
- [ ] Download de PDF após compra
- [ ] Controle de acesso

#### 3. Controle de Acesso
- [ ] Verificar se usuário comprou capítulo
- [ ] Limite de 2 capítulos gratuitos
- [ ] Bloqueio de capítulos pagos

---

## 📋 Ordem de Implementação Recomendada

1. **Editor de Capítulos** (Crítico - Admin precisa criar conteúdo)
   - Página de edição de história
   - Editor de capítulos
   - Editor de blocos modulares
   - Preview em tempo real

2. **Use Cases Faltantes**
   - UpdateChapterUseCase
   - DeleteChapterUseCase
   - UpdateChapterBlocksUseCase

3. **Sistema de Mundo** (Funcionalidade rica)
   - Personagens
   - Regiões
   - Equipamentos
   - Itens Únicos

4. **Monetização** (Quando houver conteúdo suficiente)
   - Stripe
   - PDFs
   - Controle de acesso

---

**Próximo passo sugerido:** Começar com o Editor de Capítulos (Fase 3.1)

