# Como Usar o Firebase Emulator

## 🚀 Iniciar o Emulator

Antes de executar o script `populate-glossary.js`, você precisa iniciar o Firebase Emulator:

```bash
firebase emulators:start --only firestore
```

O emulator estará disponível em `http://localhost:8080`

## 📋 Verificar se o Emulator Está Rodando

Você verá uma mensagem como:

```
✔  All emulators ready! It is now safe to connect.
┌─────────────────────────────────────────────────────────────┐
│ ✔  firestore | Firestore Emulator running at localhost:8080 │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuração no .env

No seu arquivo `.env`, certifique-se de ter:

```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=set-the-best
USE_EMULATOR=true
```

**Importante:** O script usa `localhost:8080` por padrão quando `USE_EMULATOR=true`.

## ⚠️ Problema Comum

Se você ver requisições indo para:
```
POST /v1/projects/set-the-best/databases/(default)/documents/glossary
```

Isso significa que o emulator **não está rodando** ou não está configurado corretamente.

### Solução:

1. **Inicie o emulator:**
   ```bash
   firebase emulators:start --only firestore
   ```

2. **Verifique se está rodando na porta 8080:**
   ```bash
   curl http://localhost:8080
   ```

3. **Execute o script novamente:**
   ```bash
   npm run populate-glossary
   ```

## 🔍 Debug

Se ainda não funcionar, adicione no início do script (antes de importar firebase-admin):

```javascript
console.log('FIRESTORE_EMULATOR_HOST:', process.env.FIRESTORE_EMULATOR_HOST);
```

Deve mostrar: `FIRESTORE_EMULATOR_HOST: localhost:8080`

