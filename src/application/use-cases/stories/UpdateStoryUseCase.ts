/**
 * Use Case: Atualizar História
 * 
 * Implementa a lógica de negócio para atualizar uma história existente.
 */

import { Story, StoryId } from '@/domain/entities/Story';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Permission, User } from '@/domain/value-objects/Permission';

export interface UpdateStoryDTO {
  title?: string;
  description?: string;
  coverImage?: string;
  status?: 'draft' | 'publishing' | 'completed';
  freeChapters?: number;
  pdfPrice?: number;
  tags?: string[];
}

export class UpdateStoryUseCase {
  constructor(private readonly storyRepository: IStoryRepository) {}

  async execute(user: User, storyId: StoryId, dto: UpdateStoryDTO): Promise<Story> {
    // Verificar permissões
    if (!Permission.canEditStory(user, storyId)) {
      throw new Error('Usuário não tem permissão para editar esta história');
    }

    // Buscar história existente
    const existingStory = await this.storyRepository.findById(storyId);
    if (!existingStory) {
      throw new Error('História não encontrada');
    }

    // Criar nova instância com valores atualizados
    const updatedStory = new Story(
      existingStory.id,
      dto.title ?? existingStory.title,
      dto.description ?? existingStory.description,
      existingStory.author,
      dto.coverImage ?? existingStory.coverImage,
      existingStory.publishedAt,
      dto.status ?? existingStory.status,
      dto.freeChapters ?? existingStory.freeChapters,
      dto.pdfPrice ?? existingStory.pdfPrice,
      dto.tags ?? existingStory.tags,
      existingStory.metadata,
      existingStory.createdAt,
      new Date()
    );

    // Salvar atualização
    await this.storyRepository.save(updatedStory);

    return updatedStory;
  }
}

