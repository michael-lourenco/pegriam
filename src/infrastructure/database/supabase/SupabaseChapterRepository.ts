/**
 * Implementação do Repositório de Chapters usando Supabase
 * 
 * Segue o padrão Repository para inversão de dependência.
 * Implementa IChapterRepository usando Supabase como persistência.
 */

import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { Chapter, ChapterId, CreateChapterDTO } from '@/domain/entities/Chapter';
import { StoryId } from '@/domain/entities/Story';
import { ContentBlockDTO } from '@/domain/entities/ContentBlock';
import { getSupabaseClient } from '@/infrastructure/config/supabase.config';

interface ChapterDocument {
  id: string;
  story_id: string;
  number: number;
  title: string;
  blocks: ContentBlockDTO[];
  published_at: string;
  is_free: boolean;
  estimated_read_time: number;
  word_count: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export class SupabaseChapterRepository implements IChapterRepository {
  private readonly tableName = 'chapters';

  /**
   * Converter Chapter para formato do banco
   */
  private toDocument(chapter: Chapter): ChapterDocument {
    return {
      id: chapter.id,
      story_id: chapter.storyId,
      number: chapter.number,
      title: chapter.title,
      blocks: chapter.blocks.map((block) => block.toDTO()),
      published_at: chapter.publishedAt.toISOString(),
      is_free: chapter.isFree,
      estimated_read_time: chapter.estimatedReadTime,
      word_count: chapter.wordCount,
      order: chapter.order,
      created_at: chapter.createdAt.toISOString(),
      updated_at: chapter.updatedAt.toISOString(),
    };
  }

  /**
   * Converter documento do banco para Chapter
   */
  private toEntity(doc: ChapterDocument): Chapter {
    const { ContentBlockFactory } = require('@/domain/entities/ContentBlock');
    
    const blocks = doc.blocks.map((blockDto) => {
      // Converter datas de string para Date
      const blockWithDates = {
        ...blockDto,
        createdAt: new Date(blockDto.createdAt),
        updatedAt: new Date(blockDto.updatedAt),
      };
      return ContentBlockFactory.fromDTO(blockWithDates);
    });

    return new Chapter(
      doc.id as ChapterId,
      doc.story_id as StoryId,
      doc.number,
      doc.title,
      blocks,
      new Date(doc.published_at),
      doc.is_free,
      doc.estimated_read_time,
      doc.word_count,
      doc.order,
      new Date(doc.created_at),
      new Date(doc.updated_at)
    );
  }

  async save(chapter: Chapter): Promise<void> {
    const supabase = getSupabaseClient();
    const document = this.toDocument(chapter);

    const { error } = await supabase
      .from(this.tableName)
      .upsert(document, {
        onConflict: 'id',
      });

    if (error) {
      throw new Error(`Erro ao salvar capítulo: ${error.message}`);
    }
  }

  async findById(id: ChapterId): Promise<Chapter | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar capítulo: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.toEntity(data as ChapterDocument);
  }

  async findByStoryId(storyId: StoryId): Promise<Chapter[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('story_id', storyId)
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar capítulos: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((doc) => this.toEntity(doc as ChapterDocument));
  }

  async findByStoryIdAndNumber(storyId: StoryId, number: number): Promise<Chapter | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('story_id', storyId)
      .eq('number', number)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar capítulo: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.toEntity(data as ChapterDocument);
  }

  async delete(id: ChapterId): Promise<void> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar capítulo: ${error.message}`);
    }
  }

  async exists(id: ChapterId): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw new Error(`Erro ao verificar existência do capítulo: ${error.message}`);
    }

    return !!data;
  }

  async countByStoryId(storyId: StoryId): Promise<number> {
    const supabase = getSupabaseClient();

    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .eq('story_id', storyId);

    if (error) {
      throw new Error(`Erro ao contar capítulos: ${error.message}`);
    }

    return count || 0;
  }
}

