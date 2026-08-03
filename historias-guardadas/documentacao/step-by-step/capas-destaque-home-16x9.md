# Capas de listagem (Home e /stories) — proporção 16:9

## Data: 2025-08-02
## Status: Concluído

---

## Problema

Nas listagens da home ("Histórias em Destaque") e de `/stories`, as capas usavam o componente `BookCover` (proporção de livro 2:3, `object-contain`) dentro de um container com padding e centralização. Isso gerava faixas vazias ao redor da imagem e aparência inconsistente.

---

## Solução

Padronizar o slot de capa dessas listagens para **proporção 16:9** (equivalente a 1920×1080). Imagens em qualquer outra proporção preenchem o quadro com `object-cover` + `object-center` (recorte central), sem faixas laterais ou superiores.

---

## Arquivos alterados / criados

| Arquivo | Função |
|---------|--------|
| `src/presentation/components/home/FeaturedCover.tsx` | **Novo.** Container widescreen (`aspect-video` = 16:9) com `SafeImage` e `object-cover`. Placeholder quando não há capa. |
| `src/presentation/components/home/FeaturedStories.tsx` | Troca `BookCover` por `FeaturedCover`; remove padding/centralização; skeleton passa a usar `aspect-video`. |
| `src/app/stories/page.tsx` | Mesma troca: `FeaturedCover` no grid de contos, sem padding/centralização. |
| `src/app/stories/[id]/page.tsx` | Capa da história com `FeaturedCover` em largura total (`w-full`), 16:9, sem centralização estreita. |
| `src/presentation/components/shared/BookCover.tsx` | Continua 2:3 em admin, biblioteca e checkout. |

---

## Comportamento visual

1. Container sempre 16:9 (largura 100% do card).
2. Imagem 16:9: preenche sem corte relevante.
3. Imagem mais larga ou mais alta que 16:9: escala até cobrir o quadro e corta o excesso no centro.
4. Sem capa: fundo muted + texto "Sem capa".

---

## Próximos passos (opcional)

- Ao fazer upload no admin, oferecer opção/orientação de banner 16:9 para destaque (mantendo capa 2:3 do livro).
- Campo separado `featuredImage` caso capa de livro e banner de destaque precisem ser assets distintos.
