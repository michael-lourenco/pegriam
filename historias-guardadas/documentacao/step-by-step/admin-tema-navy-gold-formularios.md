# Step-by-step: Tema navy/gold nos formulários admin

**Data:** 2026-08-02  
**Escopo:** Aplicar o tema Pegriam (navy/gold) nas páginas de formulário/editor do admin, sem alterar lógica de negócio.

## Objetivo

Alinhar as páginas de criação/edição de histórias, editor de capítulos e glossário ao mesmo visual já usado em `/admin`, `/admin/stories` e `/admin/glossario`, reutilizando `AdminShell`, `AdminPageHeader`, `AdminLoadingState` e helpers de `adminUi`.

## Arquivos alterados

| Arquivo | Função | maxWidth |
|---------|--------|----------|
| `src/app/admin/stories/new/page.tsx` | Formulário de nova história | `4xl` |
| `src/app/admin/stories/[id]/page.tsx` | Edição de história + lista de capítulos | `6xl` |
| `src/app/admin/stories/[id]/editor/page.tsx` | Editor de capítulos e blocos | `7xl` |
| `src/app/admin/glossario/novo/page.tsx` | Formulário de novo termo | `3xl` |
| `src/app/admin/glossario/[termId]/page.tsx` | Edição de termo do glossário | `3xl` |

## Helpers reutilizados (não alterados)

- `src/presentation/components/admin/AdminShell.tsx` — shell, header e loading
- `src/presentation/components/admin/adminUi.ts` — classes de card, input, botões, etc.

## Padrão aplicado em cada página

1. Outer layout → `<AdminShell maxWidth="...">`
2. Loading/auth → `<AdminLoadingState message="..." />`
3. Header → `<AdminPageHeader backHref backLabel title description? actions? />`
4. `Card` → `className={cn(adminCard)}`
5. `CardTitle` → `font-display text-gold`
6. `CardDescription` / textos secundários → `adminMuted`
7. Inputs / selects / textareas / labels → `adminInput` / `adminSelect` / `adminTextarea` / `adminLabel`
8. Botões → `adminPrimaryBtn` / `adminOutlineBtn` / `adminGhostBtn` / `adminDangerBtn`
9. Erros → `adminErrorBanner`
10. Itens de lista / blocos → `adminListItem`
11. Preview do editor → `prose prose-lg max-w-none text-[hsl(var(--parchment))]` (sem `dark:prose-invert`)
12. `DialogContent` do editor → `border-gold/30 bg-[hsl(var(--navy-deep))] text-[hsl(var(--parchment))]`

## O que não mudou

- Use-cases, repositórios, estado e handlers
- Strings de UI em português
- Upload de capa (`ImageUpload` / `FeaturedCover`) e fluxos de save/delete

## Validação

- `npx tsc --noEmit` — OK (sem erros de tipo)

## Observações de tamanho

- O editor (`editor/page.tsx`) permanece acima de ~300 linhas porque já concentrava formulário + preview + dialog de blocos; a mudança foi só visual.
- Próximo passo opcional: extrair o dialog de blocos e a lista de blocos para componentes de apresentação menores, sem tocar na lógica.
