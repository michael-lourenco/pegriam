# Redesign home + tema global Pegriam

## Data: 2025-08-02
## Status: Concluído

---

## Objetivo

Aplicar o modelo do `EXEMPLO DE LAYOUT.png` na home e um tema visual global (navy + dourado + tipografia serif), sem newsletter.

## Decisões

- Hero: `/public/images/PEGRIAM_CONTANDO_HISTORIAS.png`
- Categorias: links simbólicos
- Tema default: dark
- Sem faixa de newsletter

## Arquivos

| Arquivo | Função |
|---------|--------|
| `src/app/globals.css` | Paleta Pegriam, utilitários parchment/gold/navy |
| `src/app/layout.tsx` | Source Sans 3 + Merriweather; `defaultTheme="dark"` |
| `tailwind.config.ts` | `font-display`, cores gold/navy, animações fade-up / kenburns |
| `Navigation.tsx` / `Footer.tsx` | Barra escura, accents dourados |
| `HeroSection.tsx` | Hero full-bleed com arte e CTAs |
| `CategoryStrip.tsx` | Faixa de 4 categorias simbólicas |
| `FeaturedStories.tsx` | Seção pergaminho + cards escuros 16:9 |
| `HomeSecondary.tsx` | Quem é Pegriam / citação / Último conto |
| `src/app/page.tsx` | Composição full-bleed da home |
| `FeaturedCover.tsx` | Removido `rounded-t-lg` fixo (consumidor controla) |

## Fluxo da home

Hero → CategoryStrip → FeaturedStories → (AdminQuickAccess) → HomeSecondary

`AuthCallToAction` deixou de ser usado na home (login permanece na nav).
