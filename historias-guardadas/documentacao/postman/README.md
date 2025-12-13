# Collection Postman - Glossário Pegriam

## 📋 Descrição

Esta collection do Postman contém todas as requisições necessárias para popular o glossário do projeto Pegriam no Firestore.

## 🚀 Como Usar

### Opção 1: Script Node.js (Recomendado) ⭐

A forma mais fácil é usar o script Node.js:

```bash
# Instalar dependência (se ainda não tiver)
npm install firebase-admin

# Executar o script
npm run populate-glossary

# Ou diretamente
node scripts/populate-glossary.js
```

**Configuração:**

O script usa automaticamente as variáveis de ambiente do Firebase já configuradas no seu `.env`:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ou `PROJECT_ID` - ID do projeto Firebase
- `GOOGLE_APPLICATION_CREDENTIALS` - Caminho para o arquivo JSON do service account (opcional)
- `FIREBASE_PRIVATE_KEY` - Chave privada do service account (opcional)
- `FIREBASE_CLIENT_EMAIL` - Email do service account (opcional)

O script tenta usar as credenciais nesta ordem:
1. `GOOGLE_APPLICATION_CREDENTIALS` (caminho para arquivo JSON)
2. Variáveis de ambiente (`FIREBASE_PRIVATE_KEY` e `FIREBASE_CLIENT_EMAIL`)
3. `serviceAccountKey.json` na raiz do projeto (fallback)

### Opção 2: Postman Collection

#### 1. Importar a Collection

1. Abra o Postman
2. Clique em **Import**
3. Selecione o arquivo `pegriam-glossary.postman_collection.json`
4. A collection será importada com todas as requisições organizadas por categorias

#### 2. Configurar Variáveis

1. Na collection, vá em **Variables**
2. Configure a variável:
   - `project_id`: Seu Project ID do Firebase (ex: `pegriam-dev`)

#### 3. Configurar Autenticação

O Firestore REST API requer autenticação. Você precisa:

1. **Obter um Access Token do Firebase:**
   - Acesse o Firebase Console
   - Vá em Project Settings > Service Accounts
   - Gere uma nova chave privada (JSON)
   - Use este token para autenticação

2. **No Postman:**
   - Vá em **Authorization** de cada requisição
   - Selecione **Bearer Token**
   - Cole o token de acesso

   **OU**

   - Configure uma variável de ambiente `firebase_token`
   - Use `{{firebase_token}}` no campo Bearer Token

#### 4. Executar as Requisições

1. Selecione todas as requisições (ou por categoria)
2. Clique em **Run** (ícone de play)
3. Execute todas as requisições em sequência

**Nota:** A collection do Postman está configurada para usar a API REST do Firestore em produção. Se você preferir usar o script Node.js, ele é mais simples e recomendado.

## 📝 Estrutura da Collection

A collection está organizada em 3 pastas:

### Personagens
- Nix Volstein
- Emmantor
- Galneon
- Pegriam
- Einar
- Denver
- Rain
- Vorax

### Lugares
- Kontempler
- Lorium
- Floresta de Eldoria
- Sylvandor
- Arcanis Librarium
- Rendant
- Castelo Sem Fim

### Conceitos Mágicos
- Feiticeira dos Elementos
- Lágrimas de Nix
- Aumar
- Canção do Imperador

## 🔧 Formato dos Dados

Cada requisição envia um documento no formato:

```json
{
  "term": "Nome do Termo",
  "aliases": ["Alias 1", "Alias 2"],
  "category": "character" | "location" | "magic" | "object" | "creature" | "organization" | "concept",
  "shortDescription": "Descrição curta para tooltips",
  "fullDescription": "Descrição completa para página dedicada",
  "relatedTerms": ["id-termo-1", "id-termo-2"],
  "firstAppearance": {
    "storyId": "lenda-de-nix",
    "chapterId": "capitulo-01"
  },
  "appearances": [
    {
      "storyId": "lenda-de-nix",
      "chapterId": "capitulo-01",
      "context": "Trecho onde aparece..."
    }
  ],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z"
}
```

## ⚠️ Importante

1. **IDs dos Documentos**: Cada requisição usa um `documentId` específico (ex: `nix-volstein`)
2. **Datas**: As datas estão em formato ISO 8601
3. **Relacionamentos**: Os `relatedTerms` usam IDs de outros termos (certifique-se de criar os termos relacionados primeiro ou atualizar depois)
4. **Story IDs**: Certifique-se de que os `storyId` e `chapterId` correspondem aos dados reais no Firestore
5. **Credenciais**: O script usa as variáveis de ambiente já configuradas no seu `.env`

## 📚 Referências

- [Firestore REST API](https://firebase.google.com/docs/firestore/reference/rest)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Postman Documentation](https://learning.postman.com/docs/)

---

**Criado em:** 2025  
**Versão:** 2.0
