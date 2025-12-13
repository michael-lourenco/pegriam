# Script de População de Stories e Chapters

## Data: 2025
## Status: Implementado

---

## 📋 Resumo

Script Node.js criado para popular stories e chapters no Firestore usando o Firebase Admin SDK. O script lê arquivos Markdown da pasta `/capitulos` e os envia para o Firestore.

---

## ✅ Arquivos Criados

### Script Principal
- ✅ `scripts/populate-stories.js` - Script para popular stories e chapters

### Package.json
- ✅ Adicionado script `populate-stories` para facilitar execução

---

## 🔧 Configuração

### Variáveis de Ambiente

O script usa as mesmas variáveis de ambiente do Firebase já configuradas no `.env`:

**Obrigatória:**
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ou `GOOGLE_CREDENTIALS_PROJECT_ID` ou `PROJECT_ID`

**Credenciais (uma das opções):**
- `GOOGLE_APPLICATION_CREDENTIALS` (caminho para arquivo JSON)
- `GOOGLE_CREDENTIALS_PRIVATE_KEY` e `GOOGLE_CREDENTIALS_CLIENT_EMAIL`
- `serviceAccountKey.json` na raiz do projeto

---

## 🚀 Como Usar

### Executar o Script

```bash
# Via npm script (recomendado)
npm run populate-stories

# Ou diretamente
node scripts/populate-stories.js
```

### Estrutura de Arquivos

O script espera encontrar arquivos Markdown na pasta `/capitulos` com o formato:
- `capitulo-01.md`
- `capitulo-02.md`
- `capitulo-03.md`
- etc.

### Formato dos Arquivos Markdown

Cada arquivo deve ter:
- Título principal: `# Contos de Pegriam: A Lenda de Nix`
- Título do capítulo: `## Capítulo X: Título do Capítulo`
- Conteúdo em Markdown

Exemplo:
```markdown
# Contos de Pegriam: A Lenda de Nix
## Capítulo 1: O Despertar das Chamas Adormecidas

---

Conteúdo do capítulo aqui...
```

---

## 📊 O que o Script Faz

1. **Lê arquivos Markdown** da pasta `/capitulos`
2. **Extrai informações** de cada capítulo:
   - Número (do nome do arquivo)
   - Título (do conteúdo)
   - Conteúdo completo
   - Contagem de palavras
   - Tempo estimado de leitura (200 palavras/minuto)
3. **Cria a Story** "Contos de Pegriam: A Lenda de Nix" no Firestore
4. **Cria os Chapters** no Firestore com:
   - ID: `capitulo-01`, `capitulo-02`, etc.
   - Story ID: `lenda-de-nix`
   - Número, título, conteúdo
   - `isFree`: true para os 2 primeiros capítulos
   - `wordCount` e `estimatedReadTime`
   - `publishedAt`: timestamp atual

---

## 📝 Dados Criados

### Story
- **ID**: `lenda-de-nix`
- **Título**: "Contos de Pegriam: A Lenda de Nix"
- **Autor**: "Pegriam, o Bardo"
- **Status**: `publishing`
- **Capítulos gratuitos**: 2
- **Preço do PDF**: R$ 29,90 (2990 centavos)
- **Tags**: fantasia, aventura, magia, épico, heroína

### Chapters
- Cada capítulo é criado com:
  - ID baseado no número (`capitulo-01`, `capitulo-02`)
  - Link para a story (`storyId: 'lenda-de-nix'`)
  - Conteúdo Markdown completo
  - Metadados (palavras, tempo de leitura)

---

## ⚠️ Notas Importantes

1. **Idempotência**: O script pode ser executado múltiplas vezes - ele sobrescreve documentos existentes
2. **Ordem**: Os capítulos são ordenados pelo número extraído do nome do arquivo
3. **Capítulos Gratuitos**: Os 2 primeiros capítulos são marcados como `isFree: true`
4. **Conteúdo**: O conteúdo Markdown é armazenado como está (será processado no frontend)

---

## 🐛 Troubleshooting

### Erro: "Pasta /capitulos não encontrada"
- **Solução**: Certifique-se de que a pasta `capitulos` existe na raiz do projeto

### Erro: "Nenhum arquivo .md encontrado"
- **Solução**: Verifique se os arquivos têm extensão `.md` e estão na pasta `/capitulos`

### Erro: "Não foi possível extrair número do capítulo"
- **Solução**: Certifique-se de que os arquivos seguem o padrão `capitulo-XX.md` (ex: `capitulo-01.md`)

### Erro: "Permission denied"
- **Solução**: Verifique se o service account tem permissões de escrita no Firestore

---

## 📚 Referências

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Node.js SDK](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Estrutura de Dados - Story e Chapter](../step-by-step/proximo-passo-implementacao.md)

---

**Criado em:** 2025  
**Última atualização:** 2025  
**Versão:** 1.0

