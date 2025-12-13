/**
 * Interface de Repositório: IStoryRepository
 * 
 * Define o contrato para persistência de Stories.
 * Segue o padrão Repository para inversão de dependência.
 */

import { Story, StoryId } from '../entities/Story';

export interface IStoryRepository {
  /**
   * Salvar ou atualizar uma história
   */
  save(story: Story): Promise<void>;

  /**
   * Buscar história por ID
   */
  findById(id: StoryId): Promise<Story | null>;

  /**
   * Buscar todas as histórias
   */
  findAll(): Promise<Story[]>;

  /**
   * Buscar histórias por status
   */
  findByStatus(status: 'draft' | 'publishing' | 'completed'): Promise<Story[]>;

  /**
   * Deletar uma história
   */
  delete(id: StoryId): Promise<void>;

  /**
   * Verificar se uma história existe
   */
  exists(id: StoryId): Promise<boolean>;
}


