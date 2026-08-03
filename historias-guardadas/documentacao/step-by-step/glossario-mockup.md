# Glossário — layout do mockup

## Data: 2025-08-02
## Status: Concluído

---

## Referência

- `EXEMPLO PAGINA DE GLOSSARIO.png`
- `EXEMPLO PAGINA DE ITEM DE GLOSSARIO.png`

## Listagem `/glossario`

- Hero com título dourado, retrato de Pegriam e Guia do Bardo
- Busca, filtros por categoria, índice A–Z, toggle grade/lista
- Cards com miniatura, nome, categoria e descrição
- Sidebar: notas, como usar, explorar
- CTA “Sugerir um novo termo” → `/sobre`

## Verbete `/glossario/[termId]`

- Título + tag de categoria + citação (descrição curta)
- Imagem em moldura dourada
- Corpo em pergaminho (parágrafos → seções Visão geral / Características / …)
- Relacionados em cards
- Sidebar: guia, info rápida, tags, explorar, nota

## Arquivos novos

| Arquivo | Função |
|---------|--------|
| `glossary/glossaryUi.ts` | Cores de categoria + A–Z |
| `glossary/GlossaryHero.tsx` | Hero da listagem |
| `glossary/GlossaryTermCard.tsx` | Card do verbete |
| `glossary/GlossaryListSidebar.tsx` | Sidebar da listagem |
| `glossary/GlossaryTermSidebar.tsx` | Sidebar do detalhe |

## Limitações

- Áudio “Ouvir Pegriam…” desabilitado
- Seções do pergaminho derivadas de parágrafos do `fullDescription` (sem CMS de seções)
- “Sugerir termo” aponta para `/sobre` (sem formulário dedicado)
