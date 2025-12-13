/**
 * Implementação do Repositório de Capítulos Renderizados usando Supabase
 * 
 * Armazena versões HTML pré-processadas dos capítulos para otimização de leitura.
 */

import { IChapterRenderedRepository, ChapterRendered } from '@/domain/repositories/IChapterRenderedRepository';
import { ChapterId } from '@/domain/entities/Chapter';
import { getSupabaseClient } from '@/infrastructure/config/supabase.config';

interface ChapterRenderedDocument {
  chapter_id: string;
  rendered_html: string;
  rendered_at: string;
  updated_at: string;
}

export class SupabaseChapterRenderedRepository implements IChapterRenderedRepository {
  private readonly tableName = 'chapters_rendered';

  /**
   * Converter documento do banco para ChapterRendered
   */
  private toEntity(doc: ChapterRenderedDocument): ChapterRendered {
    return {
      chapterId: doc.chapter_id as ChapterId,
      renderedHtml: doc.rendered_html,
      renderedAt: new Date(doc.rendered_at),
      updatedAt: new Date(doc.updated_at),
    };
  }

  /**
   * Salvar ou atualizar versão renderizada
   */
  async save(chapterId: ChapterId, renderedHtml: string): Promise<void> {
    const supabase = getSupabaseClient();

    const document: ChapterRenderedDocument = {
      chapter_id: chapterId,
      rendered_html: renderedHtml,
      rendered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from(this.tableName)
      .upsert(document, {
        onConflict: 'chapter_id',
      });

    if (error) {
      throw new Error(`Erro ao salvar capítulo renderizado: ${error.message}`);
    }
  }

  /**
   * Buscar versão renderizada por ID do capítulo
   */
  async findByChapterId(chapterId: ChapterId): Promise<ChapterRendered | null> {
    const supabase = getSupabaseClient();

    console.log(`[SupabaseChapterRenderedRepository] Buscando chapter_id: ${chapterId} na tabela: ${this.tableName}`);

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('chapter_id', chapterId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum registro encontrado
        console.log(`[SupabaseChapterRenderedRepository] Nenhum registro encontrado para chapter_id: ${chapterId}`);
        return null;
      }
      console.error(`[SupabaseChapterRenderedRepository] Erro ao buscar:`, error);
      throw new Error(`Erro ao buscar capítulo renderizado: ${error.message}`);
    }

    if (!data) {
      console.log(`[SupabaseChapterRenderedRepository] Data é null para chapter_id: ${chapterId}`);
      return null;
    }

    console.log(`[SupabaseChapterRenderedRepository] ✅ Registro encontrado!`);
    return this.toEntity(data as ChapterRenderedDocument);
  }

  /**
   * Deletar versão renderizada
   */
  async delete(chapterId: ChapterId): Promise<void> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('chapter_id', chapterId);

    if (error) {
      throw new Error(`Erro ao deletar capítulo renderizado: ${error.message}`);
    }
  }
}
