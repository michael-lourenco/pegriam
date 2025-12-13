# Correção: Erro "Access Denied" no S3

## Problema
Ao tentar acessar uma imagem diretamente via URL do S3, aparece o erro:
```xml
<Error>
<Code>AccessDenied</Code>
<Message>Access Denied</Message>
</Error>
```

## Causa
O bucket S3 não está configurado para permitir acesso público de leitura aos objetos.

## Solução Rápida

### 1. Desbloquear Acesso Público no Bucket

1. Acesse o [AWS Console](https://console.aws.amazon.com)
2. Vá para **S3** → Seu bucket (`controle-eventos`)
3. Vá para a aba **Permissions** (Permissões)
4. Em **Block public access (bucket settings)**, clique em **Edit**
5. **Desmarque TODAS as 4 opções**:
   - ☐ Block all public access
   - ☐ Block public access to buckets and objects granted through new access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through any access control lists (ACLs)
   - ☐ Block public access to buckets and objects granted through new public bucket or access point policies
6. Clique em **Save changes**
7. Confirme digitando `confirm`

### 2. Adicionar Bucket Policy

1. Ainda na aba **Permissions**, role até **Bucket policy**
2. Clique em **Edit**
3. Cole a política abaixo:

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

4. Clique em **Save changes**

### 3. Verificar

1. Tente acessar uma URL de imagem diretamente no navegador:
   ```
   https://controle-eventos.s3.us-east-1.amazonaws.com/stories/covers/1765597399174-d521hnsqyfr.jpg
   ```

2. Se a imagem carregar, está funcionando! ✅
3. Se ainda aparecer "Access Denied", verifique:
   - Se desmarcou todas as opções de Block public access
   - Se a Bucket Policy foi salva corretamente
   - Se o nome do bucket na política está correto

## Segurança

⚠️ **Atenção:** Esta configuração torna TODOS os objetos do bucket acessíveis publicamente. 

Para produção, considere:
- Usar CloudFront com signed URLs
- Restringir a política para apenas pastas específicas
- Implementar autenticação antes de servir as imagens

## Próximos Passos

Após configurar:
1. Teste fazer upload de uma nova imagem
2. Verifique se a imagem aparece na página de histórias
3. Se ainda não funcionar, verifique os logs no console do navegador

