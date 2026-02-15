/**
 * Interface de Repositorio: IGlossaryRepository
 */

import { GlossaryTerm, GlossaryTermId } from '../entities/GlossaryTerm';
import type { GlossaryCategory } from '@/shared/constants';

export interface IGlossaryRepository {
  save(term: GlossaryTerm): Promise<void>;
  findById(id: GlossaryTermId): Promise<GlossaryTerm | null>;
  findAll(): Promise<GlossaryTerm[]>;
  findByCategory(category: GlossaryCategory): Promise<GlossaryTerm[]>;
  search(query: string): Promise<GlossaryTerm[]>;
  delete(id: GlossaryTermId): Promise<void>;
}
