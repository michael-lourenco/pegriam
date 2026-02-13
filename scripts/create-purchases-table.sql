-- ============================================================
-- Tabela: purchases
-- Sistema de compras de acesso completo às histórias
-- ============================================================

CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  story_id TEXT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  payment_provider TEXT NOT NULL DEFAULT 'mock',
  payment_external_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Um usuário só pode comprar cada história uma vez
  CONSTRAINT unique_user_story UNIQUE (user_id, story_id)
);

-- Índices para consultas frequentes
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_story_id ON purchases(story_id);
CREATE INDEX IF NOT EXISTS idx_purchases_external_id ON purchases(payment_external_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);

-- RLS (Row Level Security)
-- Como usamos Firebase Auth (não Supabase Auth), as políticas são permissivas.
-- O controle de acesso real é feito na camada de aplicação.
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (controlada pela aplicação)
CREATE POLICY "Permitir leitura de compras" ON purchases
  FOR SELECT USING (true);

-- Política de inserção para usuários autenticados
CREATE POLICY "Permitir inserção de compras" ON purchases
  FOR INSERT WITH CHECK (true);

-- Política de atualização (webhooks e admin)
CREATE POLICY "Permitir atualização de compras" ON purchases
  FOR UPDATE USING (true);
