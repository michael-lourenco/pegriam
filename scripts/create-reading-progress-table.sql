-- Tabela de Progresso de Leitura (futuro - quando migrar do localStorage)
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS reading_progress (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  story_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  scroll_position NUMERIC DEFAULT 0,
  percentage NUMERIC DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_read TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, story_id, chapter_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_story ON reading_progress(user_id, story_id);

-- RLS
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reading_progress_user_read" ON reading_progress
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "reading_progress_user_insert" ON reading_progress
  FOR INSERT TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "reading_progress_user_update" ON reading_progress
  FOR UPDATE TO PUBLIC
  USING (true)
  WITH CHECK (true);
