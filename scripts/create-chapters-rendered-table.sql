-- Script SQL para criar a tabela de capítulos renderizados
-- Execute este script no SQL Editor do Supabase

-- Tabela: chapters_rendered
-- Armazena a versão HTML pré-processada dos capítulos para otimização de leitura
CREATE TABLE IF NOT EXISTS public.chapters_rendered (
  chapter_id TEXT PRIMARY KEY REFERENCES public.chapters(id) ON DELETE CASCADE,
  rendered_html TEXT NOT NULL,
  rendered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índice para melhor performance (já é PK, mas garantindo)
CREATE INDEX IF NOT EXISTS idx_chapters_rendered_chapter_id ON public.chapters_rendered(chapter_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_chapters_rendered_updated_at BEFORE UPDATE ON public.chapters_rendered
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentário na tabela
COMMENT ON TABLE public.chapters_rendered IS 'Tabela de capítulos renderizados em HTML para otimização de leitura pública';

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.chapters_rendered ENABLE ROW LEVEL SECURITY;

-- Política para chapters_rendered: leitura pública
CREATE POLICY "Chapters rendered are viewable by everyone" ON public.chapters_rendered
    FOR SELECT USING (true);

-- Política para chapters_rendered: escrita apenas para autenticados
CREATE POLICY "Chapters rendered are insertable by authenticated users" ON public.chapters_rendered
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Chapters rendered are updatable by authenticated users" ON public.chapters_rendered
    FOR UPDATE USING (true);

CREATE POLICY "Chapters rendered are deletable by authenticated users" ON public.chapters_rendered
    FOR DELETE USING (true);
