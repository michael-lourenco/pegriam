# Setup AWS S3 - Upload de Imagens

**Data:** 2025  
**Status:** Guia de Configuração

---

## 🚀 Como Configurar AWS S3 para Upload de Imagens

### Passo 1: Criar Bucket no AWS S3

1. Acesse o [AWS Console](https://console.aws.amazon.com)
2. Vá para **S3** (Simple Storage Service)
3. Clique em **Create bucket**
4. Configure:
   - **Bucket name**: Escolha um nome único (ex: `pegriam-images`)
   - **Region**: Escolha a região (ex: `us-east-1`)
   - **Block Public Access**: Desmarque "Block all public access" (ou configure CORS depois)
   - **Bucket Versioning**: Opcional
5. Clique em **Create bucket**

### Passo 2: Configurar Permissões Públicas (OBRIGATÓRIO)

**⚠️ ATENÇÃO:** Sem esta configuração, as imagens não serão acessíveis e você verá erro "Access Denied".

1. No bucket criado, vá para **Permissions** (Permissões)
2. Em **Block public access (bucket settings)**, clique em **Edit**
3. **Desmarque todas as 4 opções**:
   - ☐ Block all public access
   - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
4. Clique em **Save changes**
5. Confirme digitando `confirm` e clique em **Confirm**

6. Agora, em **Bucket policy**, clique em **Edit** e adicione a política abaixo:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::controle-eventos/*"
    }
  ]
}
```

**⚠️ IMPORTANTE:** 
- Substitua `controle-eventos` pelo nome do seu bucket se for diferente
- Esta política permite que QUALQUER pessoa leia os objetos (GetObject)
- Para produção, considere usar CloudFront com signed URLs para maior segurança

7. Clique em **Save changes**

**Teste:** Após configurar, tente acessar uma URL de imagem diretamente no navegador. Deve carregar a imagem, não o erro "Access Denied".

### Passo 3: Configurar CORS (se necessário)

1. No bucket, vá para **Permissions** → **Cross-origin resource sharing (CORS)**
2. Adicione a configuração:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://seu-dominio.com"],
    "ExposeHeaders": []
  }
]
```

### Passo 4: Criar IAM User para Acesso

1. Acesse **IAM** no AWS Console
2. Vá para **Users** → **Create user**
3. Nome: `pegriam-s3-uploader`
4. Em **Set permissions**, selecione **Attach policies directly**
5. Crie uma política customizada ou use `AmazonS3FullAccess` (não recomendado para produção)
6. Para produção, crie uma política mais restrita:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::SEU_BUCKET_NAME/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::SEU_BUCKET_NAME"
    }
  ]
}
```

7. Crie o usuário e salve as credenciais (Access Key ID e Secret Access Key)

### Passo 5: Configurar Variáveis de Ambiente

Adicione ao seu arquivo `.env`:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua_access_key_id
AWS_SECRET_ACCESS_KEY=sua_secret_access_key
AWS_S3_BUCKET_NAME=seu_bucket_name
```

**⚠️ Importante:** 
- Nunca commite o `.env` no Git
- Use variáveis de ambiente no servidor de produção
- Rotacione as credenciais periodicamente

---

## 📁 Estrutura de Pastas no S3

As imagens serão organizadas assim:

```
seu-bucket/
└── stories/
    └── covers/
        ├── 1234567890-abc123.jpg
        ├── 1234567891-def456.png
        └── ...
```

---

## 🧪 Testar Upload

1. Acesse `/admin/stories/new` ou `/admin/stories/[id]`
2. Clique na área de upload de imagem
3. Selecione uma imagem
4. A imagem será enviada para S3
5. A URL será preenchida automaticamente

---

## 🔒 Segurança

### Recomendações

1. **Política IAM Restrita**: Use apenas as permissões necessárias
2. **Validação de Tipo**: Apenas imagens são aceitas
3. **Validação de Tamanho**: Máximo de 5MB
4. **Nomes Únicos**: Evita sobrescrever arquivos
5. **HTTPS**: Use sempre HTTPS em produção

### Para Produção

- Use variáveis de ambiente do servidor (Vercel, etc.)
- Configure CORS corretamente
- Use CloudFront para CDN (opcional)
- Implemente rate limiting na API route

---

## 🐛 Troubleshooting

### Erro: "Access Denied"
- Verifique as credenciais AWS
- Verifique as permissões do IAM user
- Verifique a bucket policy

### Erro: "CORS policy"
- Configure CORS no bucket S3
- Verifique os origins permitidos

### Erro: "Bucket not found"
- Verifique o nome do bucket
- Verifique a região

---

**Status:** Configure as variáveis de ambiente e teste o upload!

