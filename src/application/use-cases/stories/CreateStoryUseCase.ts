/**
 * Use Case: Criar Nova História
 * 
 * Implementa a lógica de negócio para criar uma nova história.
 * Valida permissões e cria a entidade Story.
 */

import { Story, CreateStoryDTO } from '@/domain/entities/Story';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Permission, User } from '@/domain/value-objects/Permission';

export class CreateStoryUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(user: User, dto: CreateStoryDTO): Promise<Story> {
    // Verificar permissões
    if (!Permission.canCreateStory(user)) {
      throw new Error('Usuário não tem permissão para criar histórias');
    }

    // Criar entidade Story
    const story = Story.create(dto);

    // Salvar no repositório
    await this.storyRepository.save(story);

    return story;
  }
}

