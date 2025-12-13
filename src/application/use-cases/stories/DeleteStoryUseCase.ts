/**
 * Use Case: Deletar História
 * 
 * Implementa a lógica de negócio para deletar uma história.
 */

import { StoryId } from '@/domain/entities/Story';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Permission, User } from '@/domain/value-objects/Permission';

export class DeleteStoryUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(user: User, storyId: StoryId): Promise<void> {
    // Verificar permissões
    if (!Permission.canDeleteStory(user, storyId)) {
      throw new Error('Usuário não tem permissão para deletar esta história');
    }

    // Verificar se a história existe
    const exists = await this.storyRepository.exists(storyId);
    if (!exists) {
      throw new Error('História não encontrada');
    }

    // Deletar
    await this.storyRepository.delete(storyId);
  }
}

