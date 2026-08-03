# Leitor de capítulo — layout do mockup

## Data: 2025-08-02
## Status: Concluído

---

## Referência

`EXEMPLO PAGINA DA HISTORIA.png` — UI de leitura de capítulo (pergaminho + sidebar + banner do bardo).

## O que foi feito

Layout do leitor em `/stories/[id]/chapter/[chapterId]` alinhado ao mockup, dentro do possível:

- Breadcrumbs + cabeçalho com stats e botão Ajustes
- Banner **Contado por Pegriam**
- Área principal em **pergaminho** (drop cap, títulos com ✦, tipografia serif)
- Sidebar: progresso, índice (h2/h3 do HTML), tags, nota do bardo
- Navegação inferior anterior/próximo (áudio só como “em breve”)

## Fora desta entrega

- Player de áudio real
- Fundo com cidade desfocada full-page (mantido navy profundo)
- Índice gerado por seções manuais no CMS (usa headings do markdown)

## Arquivos

| Arquivo | Função |
|---------|--------|
| `BardIntroBanner.tsx` | Banner introdutório do bardo |
| `ReaderSidebar.tsx` | Widgets laterais + extração de seções do HTML |
| `ChapterBottomNav.tsx` | Navegação entre capítulos |
| `chapter/[chapterId]/page.tsx` | Composição do leitor |
| `globals.css` | `.reader-parchment` / `.prose-parchment` |
## 2025-08-02 — Contraste do texto no pergaminho

Problema: HTML pré-renderizado usava `dark:prose-invert`, deixando texto claro sobre fundo claro.

Correção:
- `.prose-parchment` redefine variáveis `--tw-prose-*` / `--tw-prose-invert-*` para navy escuro
- `MarkdownRendererService.renderWithProse` deixa de injetar `dark:prose-invert`
- `ContentBlockRenderer` sem `dark:prose-invert` (herda o container)

