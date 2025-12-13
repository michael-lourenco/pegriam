-- Script SQL para criar as tabelas no Supabase
-- Execute este script no SQL Editor do Supabase

-- Tabela: stories
CREATE TABLE IF NOT EXISTS public.stories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_image TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('draft', 'publishing', 'completed')),
  free_chapters INTEGER NOT NULL DEFAULT 0,
  pdf_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB NOT NULL DEFAULT '{"total_chapters": 0, "estimated_read_time": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela: chapters
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_free BOOLEAN NOT NULL DEFAULT false,
  estimated_read_time INTEGER NOT NULL DEFAULT 0,
  word_count INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(story_id, number)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_chapters_story_id ON public.chapters(story_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON public.chapters(story_id, "order");
CREATE INDEX IF NOT EXISTS idx_stories_status ON public.stories(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE public.stories IS 'Tabela de histórias do sistema';
COMMENT ON TABLE public.chapters IS 'Tabela de capítulos das histórias';

-- Habilitar Row Level Security (RLS) - opcional, mas recomendado
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (permitir leitura pública, escrita apenas para autenticados)
-- Ajuste conforme suas necessidades de segurança

-- Política para stories: leitura pública
CREATE POLICY "Stories are viewable by everyone" ON public.stories
    FOR SELECT USING (true);

-- Política para chapters: leitura pública
CREATE POLICY "Chapters are viewable by everyone" ON public.chapters
    FOR SELECT USING (true);

-- Política para stories: escrita apenas para autenticados (você pode ajustar isso)
-- Por enquanto, vamos permitir escrita para todos (ajuste conforme necessário)
CREATE POLICY "Stories are insertable by authenticated users" ON public.stories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Stories are updatable by authenticated users" ON public.stories
    FOR UPDATE USING (true);

CREATE POLICY "Stories are deletable by authenticated users" ON public.stories
    FOR DELETE USING (true);

-- Política para chapters: escrita apenas para autenticados
CREATE POLICY "Chapters are insertable by authenticated users" ON public.chapters
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Chapters are updatable by authenticated users" ON public.chapters
    FOR UPDATE USING (true);

CREATE POLICY "Chapters are deletable by authenticated users" ON public.chapters
    FOR DELETE USING (true);

