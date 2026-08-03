# Admin: preview de capa 16:9 e editor Markdown em tela cheia

## Data: 2025-08-02
## Status: Concluído

---

## 1. Preview da capa no admin

### Problema
Em `/admin/stories/[id]` (e nova história), o preview usava `BookCover` (2:3 / centralizado), diferente da home e das listagens (16:9).

### Solução
Troca por `FeaturedCover` (proporção 16:9, `object-cover`). Texto de orientação atualizado para "16:9 (1920×1080)".

### Arquivos
| Arquivo | Função |
|---------|--------|
| `src/app/admin/stories/[id]/page.tsx` | Preview com `FeaturedCover` |
| `src/app/admin/stories/new/page.tsx` | Mesmo preview na criação |

---

## 2. Editor Markdown do bloco de capítulo

### Problema
O diálogo "Adicionar/Editar Bloco" tinha `max-w-2xl` e o `MarkdownEditor` limitado a `max-h-[60vh]`, deixando editor e preview pequenos.

### Solução
- Diálogo quase tela cheia: `98vw` × `96vh`.
- Prop `fillHeight` no `MarkdownEditor`: editor e preview ocupam a altura disponível do modal.
- Outros tipos de bloco (imagem, citação, separador) mantêm scroll normal.

### Arquivos
| Arquivo | Função |
|---------|--------|
| `src/presentation/components/editor/MarkdownEditor.tsx` | Suporte a `fillHeight` |
| `src/app/admin/stories/[id]/editor/page.tsx` | Dialog expandido + `fillHeight` no bloco de texto |
