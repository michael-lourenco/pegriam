# Debug: Verificação de chapters_rendered

## Status Atual

O código **ESTÁ** configurado para buscar de `chapters_rendered`, mas pode não estar encontrando registros.

## Verificações Necessárias

### 1. Tabela foi criada?

Execute no Supabase SQL Editor:
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'chapters_rendered';
```

Se não retornar nada, execute:
```sql
-- Execute o script
\i scripts/create-chapters-rendered-table.sql
```

### 2. Existem registros na tabela?

```sql
SELECT COUNT(*) FROM public.chapters_rendered;
```

Se retornar 0, os capítulos ainda não foram renderizados.

### 3. Verificar se um capítulo específico tem versão renderizada

```sql
SELECT * FROM public.chapters_rendered 
WHERE chapter_id = 'SEU_CHAPTER_ID_AQUI';
```

### 4. Verificar logs no console do navegador

Ao acessar um capítulo, verifique o console (F12) para ver:
- `🔍 Buscando versão renderizada para chapterId: ...`
- `✅ Versão renderizada encontrada!` OU
- `⚠️ Versão renderizada NÃO encontrada.`

## Como Renderizar Capítulos Existentes

Se os capítulos já existem mas não têm versão renderizada, você precisa:

1. **Editar e salvar cada capítulo no admin** - Isso vai renderizar automaticamente
2. **OU criar um script de migração** para renderizar todos os capítulos existentes

## Script de Migração (Opcional)

Se quiser renderizar todos os capítulos existentes de uma vez:

```typescript
// scripts/render-existing-chapters.ts
import { SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { SupabaseChapterRenderedRepository } from '@/infrastructure/database/supabase';
import { MarkdownRendererService } from '@/application/services/MarkdownRendererService';

async function renderAllChapters() {
  const chapterRepo = new SupabaseChapterRepository();
  const renderedRepo = new SupabaseChapterRenderedRepository();
  
  // Buscar todos os capítulos
  const chapters = await chapterRepo.findAll(); // Você precisaria implementar este método
  
  for (const chapter of chapters) {
    try {
      const html = MarkdownRendererService.renderWithProse(chapter.toMarkdown());
      await renderedRepo.save(chapter.id, html);
      console.log(`✅ Renderizado: ${chapter.id}`);
    } catch (error) {
      console.error(`❌ Erro ao renderizar ${chapter.id}:`, error);
    }
  }
}
```

## Próximos Passos

1. Verificar se a tabela existe
2. Verificar se há registros
3. Se não houver, editar e salvar um capítulo no admin para testar
4. Verificar os logs no console do navegador

