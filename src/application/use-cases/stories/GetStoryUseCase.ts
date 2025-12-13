/**
 * Use Case: Buscar História
 * 
 * Implementa a lógica de negócio para buscar uma história por ID.
 */

import { Story, StoryId } from '@/domain/entities/Story';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';

export class GetStoryUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(storyId: StoryId): Promise<Story | null> {
    return await this.storyRepository.findById(storyId);
  }
}

