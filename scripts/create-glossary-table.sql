-- Tabela de Glossario - Termos do Universo de Pegriam
-- Execute no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS glossary (
  id TEXT PRIMARY KEY,
  term TEXT NOT NULL,
  aliases TEXT[] DEFAULT '{}',
  category TEXT NOT NULL CHECK (category IN ('character', 'location', 'magic', 'object', 'creature', 'organization', 'concept')),
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  image_url TEXT,
  related_terms TEXT[] DEFAULT '{}',
  first_appearance_story_id TEXT,
  first_appearance_chapter_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices para buscas frequentes
CREATE INDEX IF NOT EXISTS idx_glossary_category ON glossary(category);
CREATE INDEX IF NOT EXISTS idx_glossary_term ON glossary(term);

-- RLS
ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "glossary_read_all" ON glossary
  FOR SELECT TO PUBLIC
  USING (true);

CREATE POLICY "glossary_insert_auth" ON glossary
  FOR INSERT TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "glossary_update_auth" ON glossary
  FOR UPDATE TO PUBLIC
  USING (true)
  WITH CHECK (true);

CREATE POLICY "glossary_delete_auth" ON glossary
  FOR DELETE TO PUBLIC
  USING (true);
