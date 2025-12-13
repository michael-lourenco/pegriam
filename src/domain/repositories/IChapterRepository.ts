/**
 * Interface de Repositório: IChapterRepository
 * 
 * Define o contrato para persistência de Chapters.
 */

import { Chapter, ChapterId } from '../entities/Chapter';
import { StoryId } from '../entities/Story';

export interface IChapterRepository {
  /**
   * Salvar ou atualizar um capítulo
   */
  save(chapter: Chapter): Promise<void>;

  /**
   * Buscar capítulo por ID
   */
  findById(id: ChapterId): Promise<Chapter | null>;

  /**
   * Buscar todos os capítulos de uma história
   */
  findByStoryId(storyId: StoryId): Promise<Chapter[]>;

  /**
   * Buscar capítulo por número e história
   */
  findByStoryIdAndNumber(storyId: StoryId, number: number): Promise<Chapter | null>;

  /**
   * Deletar um capítulo
   */
  delete(id: ChapterId): Promise<void>;

  /**
   * Verificar se um capítulo existe
   */
  exists(id: ChapterId): Promise<boolean>;

  /**
   * Contar capítulos de uma história
   */
  countByStoryId(storyId: StoryId): Promise<number>;
}


