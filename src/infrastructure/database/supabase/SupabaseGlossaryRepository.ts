/**
 * Implementacao do Repositorio de Glossario usando Supabase
 */

import { IGlossaryRepository } from '@/domain/repositories/IGlossaryRepository';
import { GlossaryTerm, GlossaryTermId } from '@/domain/entities/GlossaryTerm';
import type { GlossaryCategory } from '@/shared/constants';
import { getSupabaseClient } from '@/infrastructure/config/supabase.config';

interface GlossaryDocument {
  id: string;
  term: string;
  aliases: string[];
  category: string;
  short_description: string;
  full_description: string;
  image_url?: string;
  related_terms: string[];
  first_appearance_story_id?: string;
  first_appearance_chapter_id?: string;
  created_at: string;
  updated_at: string;
}

function toDomain(doc: GlossaryDocument): GlossaryTerm {
  return new GlossaryTerm(
    doc.id as GlossaryTermId,
    doc.term,
    doc.aliases || [],
    doc.category as GlossaryCategory,
    doc.short_description,
    doc.full_description,
    doc.image_url,
    doc.related_terms || [],
    doc.first_appearance_story_id,
    doc.first_appearance_chapter_id,
    new Date(doc.created_at),
    new Date(doc.updated_at)
  );
}

function toDocument(term: GlossaryTerm): GlossaryDocument {
  return {
    id: term.id,
    term: term.term,
    aliases: term.aliases,
    category: term.category,
    short_description: term.shortDescription,
    full_description: term.fullDescription,
    image_url: term.imageUrl,
    related_terms: term.relatedTerms,
    first_appearance_story_id: term.firstAppearanceStoryId,
    first_appearance_chapter_id: term.firstAppearanceChapterId,
    created_at: term.createdAt.toISOString(),
    updated_at: term.updatedAt.toISOString(),
  };
}

export class SupabaseGlossaryRepository implements IGlossaryRepository {
  private get supabase() {
    return getSupabaseClient();
  }

  async save(term: GlossaryTerm): Promise<void> {
    const doc = toDocument(term);
    const { error } = await this.supabase
      .from('glossary')
      .upsert(doc as any, { onConflict: 'id' });
    if (error) throw new Error(`Erro ao salvar termo: ${error.message}`);
  }

  async findById(id: GlossaryTermId): Promise<GlossaryTerm | null> {
    const { data, error } = await this.supabase
      .from('glossary')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return toDomain(data as GlossaryDocument);
  }

  async findAll(): Promise<GlossaryTerm[]> {
    const { data, error } = await this.supabase
      .from('glossary')
      .select('*')
      .order('term', { ascending: true });
    if (error) throw new Error(`Erro ao buscar glossario: ${error.message}`);
    return (data || []).map((d: any) => toDomain(d as GlossaryDocument));
  }

  async findByCategory(category: GlossaryCategory): Promise<GlossaryTerm[]> {
    const { data, error } = await this.supabase
      .from('glossary')
      .select('*')
      .eq('category', category)
      .order('term', { ascending: true });
    if (error) throw new Error(`Erro ao buscar por categoria: ${error.message}`);
    return (data || []).map((d: any) => toDomain(d as GlossaryDocument));
  }

  async search(query: string): Promise<GlossaryTerm[]> {
    const q = query.toLowerCase().trim();
    const { data, error } = await this.supabase
      .from('glossary')
      .select('*')
      .or(`term.ilike.%${q}%,short_description.ilike.%${q}%`)
      .order('term', { ascending: true })
      .limit(20);
    if (error) throw new Error(`Erro ao buscar termos: ${error.message}`);
    return (data || []).map((d: any) => toDomain(d as GlossaryDocument));
  }

  async delete(id: GlossaryTermId): Promise<void> {
    const { error } = await this.supabase
      .from('glossary')
      .delete()
      .eq('id', id);
    if (error) throw new Error(`Erro ao deletar termo: ${error.message}`);
  }
}
