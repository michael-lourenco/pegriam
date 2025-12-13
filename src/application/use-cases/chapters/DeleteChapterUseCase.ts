/**
 * Use Case: Deletar Capítulo
 * 
 * Implementa a lógica de negócio para deletar um capítulo.
 */

import { ChapterId } from '@/domain/entities/Chapter';
import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Permission, User } from '@/domain/value-objects/Permission';

export class DeleteChapterUseCase {
  constructor(
    private readonly chapterRepository: IChapterRepository,
    private readonly storyRepository: IStoryRepository
  ) {}

  async execute(user: User, chapterId: ChapterId): Promise<void> {
    // Verificar permissões
    if (!Permission.canDeleteChapter(user, String(chapterId))) {
      throw new Error('Usuário não tem permissão para deletar este capítulo');
    }

    // Verificar se o capítulo existe
    const chapter = await this.chapterRepository.findById(chapterId);
    if (!chapter) {
      throw new Error('Capítulo não encontrado');
    }

    // Deletar capítulo
    await this.chapterRepository.delete(chapterId);

    // Atualizar metadata da história
    const story = await this.storyRepository.findById(chapter.storyId);
    if (story) {
      const chapterCount = await this.chapterRepository.countByStoryId(chapter.storyId);
      const updatedStory = story.updateMetadata({
        totalChapters: chapterCount,
        estimatedReadTime: story.metadata.estimatedReadTime - chapter.estimatedReadTime,
      });
      await this.storyRepository.save(updatedStory);
    }
  }
}

