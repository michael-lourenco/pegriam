# Plano de Implementação: Suporte Completo a Markdown

**Data:** 2025  
**Status:** Planejamento  
**Prioridade:** Alta

---

## 📋 Resumo Executivo

Implementar suporte completo a Markdown nos blocos de texto, com:
- Editor split-screen (markdown à esquerda, preview à direita)
- Renderização pré-processada no admin (tabela separada)
- Migração automática de blocos 'plain' para 'markdown'
- Sanitização de HTML gerado
- Suporte a todos os recursos de markdown

---

## 🎯 Objetivos

1. Permitir formatação rica de texto usando markdown
2. Melhorar experiência de escrita para autores
3. Otimizar performance (renderização pré-processada)
4. Manter compatibilidade com conteúdo existente
5. Garantir segurança (sanitização de HTML)

---

## 📦 Dependências Necessárias

### Bibliotecas a Instalar

```json
{
  "marked": "^12.0.0",           // Parser de Markdown
  "dompurify": "^3.0.6",         // Sanitização de HTML
  "@types/dompurify": "^3.0.5"   // Types para TypeScript
}
```

**Alternativa (mais moderna):**
```json
{
  "markdown-it": "^14.0.0",      // Parser de Markdown (mais extensível)
  "markdown-it-sanitizer": "^2.0.0", // Plugin de sanitização
  "dompurify": "^3.0.6"
}
```

**Recomendação:** Usar `marked` + `DOMPurify` (mais simples e amplamente usado)

---

## 🏗️ Arquitetura da Solução

### 1. Estrutura de Dados

#### Nova Tabela: `chapters_rendered`
```sql
CREATE TABLE IF NOT EXISTS public.chapters_rendered (
  chapter_id TEXT PRIMARY KEY REFERENCES public.chapters(id) ON DELETE CASCADE,
  rendered_html TEXT NOT NULL,
  rendered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

**Campos:**
- `chapter_id`: FK para chapters
- `rendered_html`: HTML sanitizado e renderizado
- `rendered_at`: Timestamp da última renderização
- `updated_at`: Timestamp da última atualização

**Índices:**
- Índice único em `chapter_id` (já é PK)

#### Atualização na Tabela `chapters`
- Manter campo `blocks` (JSONB) para edição
- Adicionar trigger para atualizar `chapters_rendered` quando `chapters` for atualizado

### 2. Camadas da Aplicação

#### Domain Layer
- **TextBlock**: Sempre usar `format: 'markdown'` (remover 'plain')
- **ContentBlock**: Método `toMarkdown()` já existe, usar para renderização

#### Application Layer
- **MarkdownRendererService**: Novo serviço para renderizar markdown
- **UpdateChapterUseCase**: Atualizar para renderizar e salvar HTML
- **CreateChapterUseCase**: Atualizar para renderizar e salvar HTML

#### Infrastructure Layer
- **SupabaseChapterRenderedRepository**: Novo repositório para versões renderizadas
- **SupabaseChapterRepository**: Manter como está (edição)

#### Presentation Layer
- **MarkdownEditor**: Novo componente split-screen
- **ContentBlockRenderer**: Usar versão renderizada quando disponível
- **ChapterReader**: Buscar de `chapters_rendered` em vez de processar blocos

---

## 🔄 Fluxo de Dados

### Edição (Admin)
```
1. Usuário edita markdown no editor split-screen
2. Preview atualiza em tempo real (cliente)
3. Ao salvar:
   a. Salva blocos em `chapters` (JSONB)
   b. Renderiza todos os blocos → HTML unificado
   c. Sanitiza HTML
   d. Salva em `chapters_rendered`
```

### Leitura (Público)
```
1. Busca capítulo de `chapters_rendered`
2. Se não existir, renderiza on-the-fly (fallback)
3. Exibe HTML sanitizado diretamente
```

---

## 📝 Fases de Implementação

### Fase 1: Preparação e Dependências
**Duração estimada:** 30 minutos

- [ ] Instalar bibliotecas (`marked`, `dompurify`, `@types/dompurify`)
- [ ] Criar script SQL para nova tabela `chapters_rendered`
- [ ] Criar migração SQL para atualizar blocos existentes

### Fase 2: Serviço de Renderização
**Duração estimada:** 1 hora

- [ ] Criar `MarkdownRendererService` em `application/services/`
- [ ] Implementar renderização de blocos individuais
- [ ] Implementar renderização de capítulo completo
- [ ] Implementar sanitização com DOMPurify
- [ ] Adicionar testes unitários básicos

### Fase 3: Repositório de Versões Renderizadas
**Duração estimada:** 1 hora

- [ ] Criar `IChapterRenderedRepository` (interface)
- [ ] Implementar `SupabaseChapterRenderedRepository`
- [ ] Adicionar métodos: `save()`, `findByChapterId()`, `delete()`

### Fase 4: Atualização de Use Cases
**Duração estimada:** 1.5 horas

- [ ] Atualizar `CreateChapterUseCase` para renderizar e salvar
- [ ] Atualizar `UpdateChapterUseCase` para renderizar e salvar
- [ ] Adicionar tratamento de erros
- [ ] Garantir rollback em caso de falha

### Fase 5: Migração de Dados
**Duração estimada:** 30 minutos

- [ ] Criar script de migração para converter 'plain' → 'markdown'
- [ ] Criar script para renderizar capítulos existentes
- [ ] Executar migração em ambiente de desenvolvimento
- [ ] Validar dados migrados

### Fase 6: Editor Split-Screen
**Duração estimada:** 2 horas

- [ ] Criar componente `MarkdownEditor` (split-screen)
- [ ] Integrar preview em tempo real
- [ ] Atualizar `ChapterEditorPage` para usar novo editor
- [ ] Adicionar indicadores visuais (salvando, erro, etc.)
- [ ] Testar responsividade (mobile)

### Fase 7: Renderizador de Leitura
**Duração estimada:** 1 hora

- [ ] Atualizar `ContentBlockRenderer` para usar versão renderizada
- [ ] Criar `ChapterReader` que busca de `chapters_rendered`
- [ ] Adicionar fallback para renderização on-the-fly
- [ ] Atualizar página de leitura pública

### Fase 8: Atualização de TextBlock
**Duração estimada:** 30 minutos

- [ ] Remover suporte a `format: 'plain'` de `TextBlock`
- [ ] Sempre usar `format: 'markdown'`
- [ ] Atualizar `ContentBlockFactory`
- [ ] Atualizar validações

### Fase 9: Testes e Validação
**Duração estimada:** 1 hora

- [ ] Testar criação de novo capítulo
- [ ] Testar edição de capítulo existente
- [ ] Testar leitura pública
- [ ] Testar migração de dados
- [ ] Validar sanitização (XSS)
- [ ] Testar performance

### Fase 10: Documentação
**Duração estimada:** 30 minutos

- [ ] Documentar uso do editor markdown
- [ ] Criar guia de sintaxe markdown suportada
- [ ] Atualizar documentação de arquitetura
- [ ] Criar exemplos de uso

---

## 🔒 Segurança

### Sanitização de HTML
- Usar `DOMPurify` para remover scripts, eventos, etc.
- Configurar whitelist de tags permitidas
- Permitir apenas atributos seguros

### Validação de Entrada
- Validar markdown antes de salvar
- Limitar tamanho de conteúdo
- Prevenir injeção de código

---

## ⚡ Performance

### Otimizações
- Renderização pré-processada (admin)
- Cache de versões renderizadas
- Lazy loading de capítulos
- Compressão de HTML (opcional)

### Métricas Esperadas
- Tempo de renderização: < 100ms (capítulo médio)
- Tempo de carregamento público: < 50ms (já renderizado)
- Tamanho de HTML renderizado: ~30% maior que markdown

---

## 🧪 Testes

### Testes Unitários
- Renderização de markdown básico
- Sanitização de HTML malicioso
- Conversão de blocos para HTML

### Testes de Integração
- Fluxo completo de criação/edição
- Migração de dados
- Leitura pública

### Testes de Segurança
- XSS injection
- Script injection
- HTML malicioso

---

## 📊 Métricas de Sucesso

1. ✅ Todos os blocos existentes migrados para markdown
2. ✅ Editor split-screen funcional
3. ✅ Preview em tempo real funcionando
4. ✅ Renderização pré-processada salva corretamente
5. ✅ Leitura pública usando versão renderizada
6. ✅ Sanitização bloqueando XSS
7. ✅ Performance de leitura < 100ms

---

## 🚨 Riscos e Mitigações

### Risco 1: Perda de dados na migração
**Mitigação:** Backup completo antes da migração, script de rollback

### Risco 2: Performance de renderização
**Mitigação:** Renderização assíncrona, cache, fallback

### Risco 3: HTML malicioso passar pela sanitização
**Mitigação:** Testes extensivos, whitelist restritiva, auditoria

### Risco 4: Incompatibilidade com conteúdo existente
**Mitigação:** Migração automática, validação pré-migração

---

## 📅 Cronograma Estimado

**Total:** ~10 horas de desenvolvimento

- **Fase 1-3:** 2.5 horas (preparação e infraestrutura)
- **Fase 4-5:** 2 horas (use cases e migração)
- **Fase 6-7:** 3 horas (UI e renderização)
- **Fase 8-10:** 2.5 horas (finalização e testes)

---

## 🔄 Próximos Passos Após Implementação

1. Adicionar suporte a syntax highlighting para código
2. Adicionar toolbar de formatação (opcional)
3. Adicionar atalhos de teclado
4. Suporte a tabelas markdown
5. Suporte a diagramas (Mermaid, etc.)

---

## ✅ Checklist de Aprovação

Antes de iniciar a implementação, confirmar:

- [ ] Plano aprovado
- [ ] Dependências aprovadas
- [ ] Estrutura de banco aprovada
- [ ] Fluxo de dados validado
- [ ] Segurança revisada
- [ ] Performance validada

---

**Status:** Aguardando aprovação para iniciar implementação

