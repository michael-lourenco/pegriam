# Admin — tema Pegriam (navy / dourado)

## Data: 2025-08-02
## Status: Concluído

---

## Objetivo

Alinhar **todas** as telas do admin ao padrão visual do site (navy profundo, dourado, tipografia display).

## Infra compartilhada

| Arquivo | Função |
|---------|--------|
| `presentation/components/admin/adminUi.ts` | Classes: card, input, botões, pills de status |
| `presentation/components/admin/AdminShell.tsx` | Shell de página + header + loading |

## Páginas atualizadas

- `/admin` — dashboard
- `/admin/stories` — listagem
- `/admin/stories/new` — criar
- `/admin/stories/[id]` — editar
- `/admin/stories/[id]/editor` — editor de capítulos
- `/admin/glossario` — listagem
- `/admin/glossario/novo` — criar termo
- `/admin/glossario/[termId]` — editar termo
- `admin/loading.tsx`
- `AdminQuickAccess` (home)
- `ImageUpload` (usado nos forms admin)

## Padrão visual

- Fundo `navy-deep`
- Cards `bg-navy` + borda `gold/25`
- Títulos `font-display` em parchment/gold
- Botão primário dourado; outline dourado
- Inputs com borda gold e fundo navy

## 2025-08-02 — Contraste do preview no editor de capítulos

Problema: blocos e preview usavam tipografia clara/escura conflitante com o fundo navy do admin.

Correção:
- Preview lateral + miniaturas de bloco → superfície `adminReaderPreview` (pergaminho, texto navy)
- `MarkdownEditor`: editor escuro (código); preview em pergaminho como o leitor
- `ContentBlockRenderer`: cores fixas de pergaminho (sem `text-foreground` do tema)
