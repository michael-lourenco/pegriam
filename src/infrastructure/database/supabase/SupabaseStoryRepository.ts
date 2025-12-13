/**
 * Implementação do Repositório de Stories usando Supabase
 * 
 * Segue o padrão Repository para inversão de dependência.
 * Implementa IStoryRepository usando Supabase como persistência.
 */

import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Story, StoryId, StoryStatus, CreateStoryDTO } from '@/domain/entities/Story';
import { getSupabaseClient } from '@/infrastructure/config/supabase.config';

interface StoryDocument {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_image?: string;
  published_at: string;
  status: StoryStatus;
  free_chapters: number;
  pdf_price: number;
  tags: string[];
  metadata: {
    total_chapters: number;
    estimated_read_time: number;
  };
  created_at: string;
  updated_at: string;
}

export class SupabaseStoryRepository implements IStoryRepository {
  private readonly tableName = 'stories';

  /**
   * Converter Story para formato do banco
   */
  private toDocument(story: Story): StoryDocument {
    return {
      id: story.id,
      title: story.title,
      description: story.description,
      author: story.author,
      cover_image: story.coverImage,
      published_at: story.publishedAt.toISOString(),
      status: story.status,
      free_chapters: story.freeChapters,
      pdf_price: story.pdfPrice,
      tags: story.tags,
      metadata: {
        total_chapters: story.metadata.totalChapters,
        estimated_read_time: story.metadata.estimatedReadTime,
      },
      created_at: story.createdAt.toISOString(),
      updated_at: story.updatedAt.toISOString(),
    };
  }

  /**
   * Converter documento do banco para Story
   */
  private toEntity(doc: StoryDocument): Story {
    return new Story(
      doc.id as StoryId,
      doc.title,
      doc.description,
      doc.author,
      doc.cover_image,
      new Date(doc.published_at),
      doc.status,
      doc.free_chapters,
      doc.pdf_price,
      doc.tags,
      {
        totalChapters: doc.metadata.total_chapters,
        estimatedReadTime: doc.metadata.estimated_read_time,
      },
      new Date(doc.created_at),
      new Date(doc.updated_at)
    );
  }

  async save(story: Story): Promise<void> {
    const supabase = getSupabaseClient();
    const document = this.toDocument(story);

    const { error } = await supabase
      .from(this.tableName)
      .upsert(document, {
        onConflict: 'id',
      });

    if (error) {
      throw new Error(`Erro ao salvar história: ${error.message}`);
    }
  }

  async findById(id: StoryId): Promise<Story | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum registro encontrado
        return null;
      }
      throw new Error(`Erro ao buscar história: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.toEntity(data as StoryDocument);
  }

  async findAll(): Promise<Story[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar histórias: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((doc) => this.toEntity(doc as StoryDocument));
  }

  async findByStatus(status: StoryStatus): Promise<Story[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar histórias por status: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((doc) => this.toEntity(doc as StoryDocument));
  }

  async delete(id: StoryId): Promise<void> {
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Erro ao deletar história: ${error.message}`);
    }
  }

  async exists(id: StoryId): Promise<boolean> {
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
      throw new Error(`Erro ao verificar existência da história: ${error.message}`);
    }

    return !!data;
  }
}

