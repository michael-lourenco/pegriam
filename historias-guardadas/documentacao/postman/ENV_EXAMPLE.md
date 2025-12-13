# Variáveis de Ambiente para o Script de População

## 📋 Variáveis Necessárias no .env

O script `populate-glossary.js` usa as variáveis de ambiente do Firebase já configuradas no seu projeto.

### Variáveis Obrigatórias

```env
# Project ID do Firebase (já existe no seu .env)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
# ou
PROJECT_ID=seu-project-id
```

### Variáveis para Credenciais do Service Account

O script tenta usar as credenciais nesta ordem:

#### Opção 1: Arquivo JSON (Recomendado)

```env
# Caminho para o arquivo JSON do service account
GOOGLE_APPLICATION_CREDENTIALS=/caminho/para/serviceAccountKey.json
```

#### Opção 2: Variáveis de Ambiente

```env
# Credenciais do Service Account (obtidas do Firebase Console)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY_ID=xxxxx
FIREBASE_CLIENT_ID=xxxxx
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
```

#### Opção 3: Arquivo na Raiz (Fallback)

Se nenhuma das opções acima estiver configurada, o script tentará usar:
- `serviceAccountKey.json` na raiz do projeto

## 🔑 Como Obter as Credenciais

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Project Settings** > **Service Accounts**
4. Clique em **Generate New Private Key**
5. Baixe o arquivo JSON

### Se usar GOOGLE_APPLICATION_CREDENTIALS:

Coloque o arquivo JSON em um local seguro e configure o caminho no `.env`:

```env
GOOGLE_APPLICATION_CREDENTIALS=/caminho/absoluto/para/serviceAccountKey.json
```

### Se usar variáveis de ambiente:

Copie os valores do JSON para as variáveis de ambiente:

```json
{
  "type": "service_account",
  "project_id": "seu-project-id",           → Já existe (NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  "private_key_id": "xxxxx",                → FIREBASE_PRIVATE_KEY_ID
  "private_key": "-----BEGIN...",           → FIREBASE_PRIVATE_KEY
  "client_email": "firebase-adminsdk...",    → FIREBASE_CLIENT_EMAIL
  "client_id": "xxxxx",                      → FIREBASE_CLIENT_ID
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://..."      → FIREBASE_CLIENT_X509_CERT_URL
}
```

## ⚠️ Importante

- **FIREBASE_PRIVATE_KEY**: Mantenha as quebras de linha `\n` no valor. O script converte automaticamente `\\n` para `\n`.
- **Segurança**: Nunca commite o arquivo `.env` ou `serviceAccountKey.json` no Git!
- **Variáveis Existentes**: O script usa as variáveis do Firebase que você já tem configuradas no `.env` do projeto.

## 🚀 Uso

```bash
# Executar o script (usa automaticamente as variáveis do .env)
npm run populate-glossary
```

O script conecta-se automaticamente ao Firebase de produção usando as credenciais configuradas.
