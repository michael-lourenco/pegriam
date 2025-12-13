# Script de População do Glossário - Atualização

## Data: 2025
## Status: Implementado e Atualizado

---

## 📋 Resumo

Script Node.js criado para popular o glossário no Firestore usando o Firebase Admin SDK. O script foi atualizado para usar apenas o Firebase de produção (sem emulator) e utiliza as variáveis de ambiente já configuradas no projeto.

---

## ✅ Arquivos Criados/Atualizados

### Script Principal
- ✅ `scripts/populate-glossary.js` - Script para popular o glossário

### Documentação
- ✅ `documentacao/postman/README.md` - Instruções de uso do script e collection Postman
- ✅ `documentacao/postman/ENV_EXAMPLE.md` - Exemplo de variáveis de ambiente
- ✅ `documentacao/postman/pegriam-glossary.postman_collection.json` - Collection Postman (alternativa)

### Package.json
- ✅ Adicionado script `populate-glossary` para facilitar execução

---

## 🔧 Configuração

### Variáveis de Ambiente

O script usa as variáveis de ambiente do Firebase já configuradas no `.env`:

**Obrigatória:**
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` ou `PROJECT_ID` - ID do projeto Firebase

**Credenciais (uma das opções abaixo):**

#### Opção 1: Arquivo JSON (Recomendado)
```env
GOOGLE_APPLICATION_CREDENTIALS=/caminho/para/serviceAccountKey.json
```

#### Opção 2: Variáveis de Ambiente
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY_ID=xxxxx
FIREBASE_CLIENT_ID=xxxxx
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

#### Opção 3: Arquivo na Raiz (Fallback)
- `serviceAccountKey.json` na raiz do projeto

### Ordem de Prioridade

O script tenta usar as credenciais nesta ordem:
1. `GOOGLE_APPLICATION_CREDENTIALS` (caminho para arquivo JSON)
2. Variáveis de ambiente (`FIREBASE_PRIVATE_KEY` e `FIREBASE_CLIENT_EMAIL`)
3. `serviceAccountKey.json` na raiz do projeto

---

## 🚀 Como Usar

### Executar o Script

```bash
# Via npm script (recomendado)
npm run populate-glossary

# Ou diretamente
node scripts/populate-glossary.js
```

### O que o Script Faz

1. Carrega variáveis de ambiente do `.env` e `.env.local`
2. Inicializa o Firebase Admin SDK usando as credenciais configuradas
3. Conecta-se ao Firestore de produção
4. Popula a collection `glossary` com 19 termos iniciais:
   - 8 personagens
   - 7 lugares
   - 4 conceitos mágicos

### Dados Populados

**Personagens:**
- Nix Volstein
- Emmantor
- Galneon
- Pegriam
- Einar
- Denver
- Rain
- Vorax

**Lugares:**
- Kontempler
- Lorium
- Floresta de Eldoria
- Sylvandor
- Arcanis Librarium
- Rendant
- Castelo Sem Fim

**Conceitos Mágicos:**
- Feiticeira dos Elementos
- Lágrimas de Nix
- Aumar
- Canção do Imperador

---

## 🔄 Mudanças Realizadas

### Removido
- ❌ Toda a lógica do Firebase Emulator
- ❌ Variável `USE_EMULATOR`
- ❌ Configuração de `FIRESTORE_EMULATOR_HOST`
- ❌ Referências a `localhost:8080`

### Adicionado
- ✅ Suporte para `GOOGLE_APPLICATION_CREDENTIALS`
- ✅ Uso das variáveis de ambiente já existentes no projeto
- ✅ Fallback para `serviceAccountKey.json`
- ✅ Mensagens de erro mais claras

### Melhorias
- ✅ Script mais simples e direto
- ✅ Usa apenas Firebase de produção
- ✅ Melhor tratamento de erros
- ✅ Documentação atualizada

---

## ⚠️ Notas Importantes

1. **Segurança**: Nunca commite o arquivo `.env` ou `serviceAccountKey.json` no Git
2. **Credenciais**: O script usa as mesmas variáveis de ambiente já configuradas no projeto
3. **Produção**: O script conecta-se diretamente ao Firebase de produção
4. **Idempotência**: O script pode ser executado múltiplas vezes - ele sobrescreve documentos existentes

---

## 🐛 Troubleshooting

### Erro: "NEXT_PUBLIC_FIREBASE_PROJECT_ID não encontrado"
- **Solução**: Verifique se a variável está configurada no `.env`

### Erro: "Não foi possível inicializar o Firebase Admin"
- **Solução**: Configure uma das opções de credenciais (GOOGLE_APPLICATION_CREDENTIALS, variáveis de ambiente ou serviceAccountKey.json)

### Erro: "Permission denied"
- **Solução**: Verifique se o service account tem permissões de escrita no Firestore

---

## 📚 Referências

- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Node.js SDK](https://firebase.google.com/docs/firestore/manage-data/add-data)
- [Service Accounts](https://firebase.google.com/docs/admin/setup#initialize-sdk)

---

**Criado em:** 2025  
**Última atualização:** 2025  
**Versão:** 2.0

