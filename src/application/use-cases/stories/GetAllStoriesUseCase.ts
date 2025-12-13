/**
 * Use Case: Buscar Todas as Histórias
 * 
 * Implementa a lógica de negócio para buscar todas as histórias publicadas.
 */

import { Story } from '@/domain/entities/Story';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';

export class GetAllStoriesUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(): Promise<Story[]> {
    // Buscar apenas histórias publicadas para usuários não-admin
    return await this.storyRepository.findByStatus('publishing');
  }

  /**
   * Buscar todas as histórias (incluindo rascunhos) - apenas para admin
   */
  async executeForAdmin(): Promise<Story[]> {
    return await this.storyRepository.findAll();
  }
}

