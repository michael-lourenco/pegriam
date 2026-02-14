-- ============================================================
-- Tabela: users
-- Registro de usuários do sistema (vinculados ao Firebase Auth)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                    -- Firebase Auth UID
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Foreign key na tabela purchases (referenciando users)
-- Nota: só adicionar se a tabela purchases já existir e não tiver FK
-- ALTER TABLE purchases ADD CONSTRAINT fk_purchases_user
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (controle real feito na camada de aplicação,
-- pois usamos Firebase Auth e não Supabase Auth)
CREATE POLICY "Permitir leitura de users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de users" ON users
  FOR UPDATE USING (true);
