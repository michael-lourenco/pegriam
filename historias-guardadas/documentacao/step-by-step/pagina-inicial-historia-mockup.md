# Página inicial da história (antes dos capítulos)

## Data: 2025-08-02
## Status: Concluído

---

## Referência

`EXEMPLO PAGINA INICIAL DA HISTORIA ANTES DE ENTRAR NOS CAPITULOS.png`

## Layout

- Coluna principal (~70%): título central, meta, citação, capa 16:9 com CTAs, banner de acesso, lista de capítulos em pergaminho
- Sidebar (~30%): Contado por Pegriam, Sobre (pergaminho), Temas, nota poética

## Arquivos

| Arquivo | Função |
|---------|--------|
| `StoryHero.tsx` | Título, tags, meta, capa + Começar / Ouvir |
| `StorySidebar.tsx` | Cards laterais |
| `StoryChapterList.tsx` | Cards de capítulo em pergaminho |
| `stories/[id]/page.tsx` | Composição |
| `PurchaseCard.tsx` | Banner “Acesso Completo Liberado” no estilo do mockup |

## Limitações conscientes

- “Ouvir com Pegriam” desabilitado (áudio em breve)
- Citação do hero = descrição (ou recorte) da história — sem campo `quote` dedicado
