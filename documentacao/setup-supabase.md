# Setup do Supabase - Contos de Pegriam

**Data:** 2025  
**Status:** Guia de Configuração

---

## 🚀 Como Criar as Tabelas no Supabase

### Passo 1: Acessar o Supabase

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **SQL Editor** no menu lateral

### Passo 2: Executar o Script SQL

1. Clique em **New Query**
2. Copie e cole o conteúdo do arquivo `scripts/create-tables.sql`
3. Clique em **Run** ou pressione `Ctrl+Enter` (ou `Cmd+Enter` no Mac)

### Passo 3: Verificar as Tabelas

1. Vá para **Table Editor** no menu lateral
2. Você deve ver duas tabelas:
   - `stories`
   - `chapters`

---

## 📋 Estrutura das Tabelas

### Tabela: `stories`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | TEXT (PK) | ID único da história |
| `title` | TEXT | Título da história |
| `description` | TEXT | Descrição da história |
| `author` | TEXT | Autor da história |
| `cover_image` | TEXT | URL da imagem de capa |
| `published_at` | TIMESTAMP | Data de publicação |
| `status` | TEXT | Status: 'draft', 'publishing', 'completed' |
| `free_chapters` | INTEGER | Número de capítulos gratuitos |
| `pdf_price` | DECIMAL | Preço do PDF |
| `tags` | TEXT[] | Array de tags |
| `metadata` | JSONB | Metadados (total_chapters, estimated_read_time) |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

### Tabela: `chapters`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | TEXT (PK) | ID único do capítulo |
| `story_id` | TEXT (FK) | ID da história |
| `number` | INTEGER | Número do capítulo |
| `title` | TEXT | Título do capítulo |
| `blocks` | JSONB | Array de blocos de conteúdo |
| `published_at` | TIMESTAMP | Data de publicação |
| `is_free` | BOOLEAN | Se o capítulo é gratuito |
| `estimated_read_time` | INTEGER | Tempo estimado de leitura (minutos) |
| `word_count` | INTEGER | Contagem de palavras |
| `order` | INTEGER | Ordem do capítulo |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

---

## 🔒 Row Level Security (RLS)

O script habilita RLS nas tabelas com políticas básicas:

- **Leitura**: Pública (qualquer um pode ler)
- **Escrita**: Autenticados (ajuste conforme necessário)

**⚠️ Importante:** Se você quiser restringir a escrita apenas para admins, você precisará ajustar as políticas RLS no Supabase.

---

## ✅ Verificação

Após executar o script, você deve ver:

1. ✅ Tabelas criadas no Table Editor
2. ✅ Índices criados
3. ✅ Triggers criados (para atualizar `updated_at`)
4. ✅ Políticas RLS habilitadas

---

## 🐛 Troubleshooting

### Erro: "permission denied"
- Verifique se você tem permissões de administrador no projeto Supabase
- Tente executar o script em partes menores

### Erro: "relation already exists"
- As tabelas já existem
- Use `DROP TABLE` se quiser recriar (cuidado: apaga dados!)

### Erro: "Could not find the table"
- Verifique se executou o script completamente
- Verifique se está no schema correto (`public`)
- Recarregue a página do Supabase

---

## 📝 Próximos Passos

Após criar as tabelas:

1. ✅ Teste criar uma história no admin
2. ✅ Teste criar um capítulo
3. ✅ Verifique se os dados aparecem no Supabase
4. ✅ Teste a leitura pública em `/stories`

---

**Status:** Execute o script SQL no Supabase para criar as tabelas!

