# Debug: Imagens não aparecem nas páginas de histórias

## Problema Reportado
As imagens de capa são salvas no S3, mas não aparecem nas páginas de histórias - apenas o ícone de imagem quebrada é exibido.

## Alterações Implementadas

### 1. Componente SafeImage
Criado componente `SafeImage` que:
- Trata erros de carregamento de imagem
- Exibe fallback quando a imagem não carrega
- Adiciona logs para debug

**Arquivo**: `src/presentation/components/shared/SafeImage.tsx`

### 2. Configuração Next.js
Adicionada configuração de `remotePatterns` no `next.config.js` para permitir imagens de:
- Domínios AWS S3 (`**.amazonaws.com`)
- CloudFront (`**.cloudfront.net`)
- Qualquer domínio HTTPS/HTTP (para desenvolvimento)

### 3. Correção de Variáveis de Ambiente
Ajustado o código de upload para usar `AWS_CUSTOM_REGION` (que está no `.env`) em vez de apenas `AWS_REGION`.

### 4. Logs de Debug
Adicionados logs em:
- `src/app/api/upload/route.ts`: Loga a URL gerada após upload
- `src/presentation/components/shared/ImageUpload.tsx`: Loga a URL recebida
- `src/presentation/components/shared/SafeImage.tsx`: Loga erros e sucessos de carregamento

## Possíveis Causas do Problema

### 1. Permissões do Bucket S3
O bucket pode não estar configurado como público ou pode não ter a política de acesso correta.

**Verificar**:
- No console AWS S3, verificar se o bucket tem política de acesso público
- Verificar se os objetos têm permissão de leitura pública

**Solução**:
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

### 2. CORS não configurado
O bucket pode não ter CORS configurado para permitir requisições do domínio da aplicação.

**Solução**: Adicionar configuração CORS no bucket:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 3. URL incorreta sendo gerada
A URL pode estar sendo gerada com região ou formato incorreto.

**Verificar**: 
- Abrir o console do navegador e verificar os logs
- Verificar a URL exata que está sendo usada
- Testar a URL diretamente no navegador

### 4. Objeto não existe no S3
O upload pode ter falhado silenciosamente.

**Verificar**:
- No console AWS S3, verificar se o arquivo realmente existe
- Verificar o caminho completo do arquivo

## Como Debugar

1. **Abrir o console do navegador** (F12)
2. **Verificar os logs**:
   - "Upload concluído:" - mostra a URL gerada
   - "URL recebida do upload:" - mostra a URL recebida pelo componente
   - "Erro ao carregar imagem:" - mostra quando a imagem falha ao carregar
   - "Imagem carregada:" - mostra quando a imagem carrega com sucesso

3. **Copiar a URL** que aparece nos logs e testar diretamente no navegador

4. **Verificar no Supabase** se a URL está sendo salva corretamente:
   ```sql
   SELECT id, title, cover_image FROM stories WHERE cover_image IS NOT NULL;
   ```

5. **Verificar no S3** se o arquivo existe:
   - Acessar o console AWS S3
   - Navegar até o bucket `controle-eventos`
   - Verificar se existe a pasta `stories/covers/` e os arquivos dentro

## Próximos Passos

1. Testar o upload novamente e verificar os logs no console
2. Verificar se a URL gerada está correta
3. Testar a URL diretamente no navegador
4. Se a URL não funcionar, verificar permissões do bucket S3
5. Se necessário, configurar CORS no bucket

