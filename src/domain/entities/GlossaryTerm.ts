/**
 * Entidade de Dominio: GlossaryTerm
 * 
 * Representa um termo do glossario interativo do universo de Pegriam.
 */

import type { GlossaryCategory } from '@/shared/constants';

export type GlossaryTermId = string & { readonly __brand: 'GlossaryTermId' };

export interface CreateGlossaryTermDTO {
  term: string;
  aliases?: string[];
  category: GlossaryCategory;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  relatedTerms?: string[];
  firstAppearanceStoryId?: string;
  firstAppearanceChapterId?: string;
}

export class GlossaryTerm {
  constructor(
    public readonly id: GlossaryTermId,
    public readonly term: string,
    public readonly aliases: string[],
    public readonly category: GlossaryCategory,
    public readonly shortDescription: string,
    public readonly fullDescription: string,
    public readonly imageUrl: string | undefined,
    public readonly relatedTerms: string[],
    public readonly firstAppearanceStoryId: string | undefined,
    public readonly firstAppearanceChapterId: string | undefined,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  static create(dto: CreateGlossaryTermDTO): GlossaryTerm {
    const now = new Date();
    const id = `glossary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as GlossaryTermId;

    return new GlossaryTerm(
      id,
      dto.term,
      dto.aliases || [],
      dto.category,
      dto.shortDescription,
      dto.fullDescription,
      dto.imageUrl,
      dto.relatedTerms || [],
      dto.firstAppearanceStoryId,
      dto.firstAppearanceChapterId,
      now,
      now
    );
  }

  getAllNames(): string[] {
    return [this.term, ...this.aliases];
  }

  private validate(): void {
    if (!this.term || this.term.trim().length === 0) {
      throw new Error('Nome do termo e obrigatorio');
    }
    if (!this.shortDescription || this.shortDescription.trim().length === 0) {
      throw new Error('Descricao curta e obrigatoria');
    }
    if (!this.fullDescription || this.fullDescription.trim().length === 0) {
      throw new Error('Descricao completa e obrigatoria');
    }
  }
}
