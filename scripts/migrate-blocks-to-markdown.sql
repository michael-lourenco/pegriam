-- Script SQL para migrar blocos de texto de 'plain' para 'markdown'
-- Execute este script no SQL Editor do Supabase após a atualização do código

-- Atualizar todos os blocos de texto que têm format: 'plain' ou format ausente
-- para format: 'markdown'
UPDATE public.chapters
SET blocks = (
  SELECT jsonb_agg(
    CASE 
      WHEN block->>'type' = 'text' THEN
        jsonb_set(
          block,
          '{data,format}',
          '"markdown"',
          true
        )
      ELSE
        block
    END
  )
  FROM jsonb_array_elements(blocks) AS block
)
WHERE EXISTS (
  SELECT 1
  FROM jsonb_array_elements(blocks) AS block
  WHERE block->>'type' = 'text'
    AND (
      (block->'data'->>'format' IS NULL)
      OR (block->'data'->>'format' = 'plain')
    )
);

-- Verificar quantos blocos foram atualizados
SELECT 
  COUNT(*) as total_chapters,
  COUNT(CASE WHEN blocks::text LIKE '%"format":"markdown"%' THEN 1 END) as chapters_with_markdown
FROM public.chapters
WHERE blocks IS NOT NULL AND jsonb_array_length(blocks) > 0;
