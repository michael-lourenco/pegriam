/**
 * Use Case: Buscar Capítulo
 * 
 * Implementa a lógica de negócio para buscar um capítulo por ID.
 */

import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { User } from '@/domain/value-objects/Permission';

export class GetChapterUseCase {
  constructor(
    private readonly chapterRepository: IChapterRepository,
    private readonly storyRepository: IStoryRepository
  ) {}

  async execute(user: User | null, chapterId: ChapterId): Promise<Chapter | null> {
    const chapter = await this.chapterRepository.findById(chapterId);
    
    if (!chapter) {
      return null;
    }

    // Verificar se o capítulo é gratuito ou se o usuário tem acesso
    if (chapter.isFree) {
      return chapter;
    }

    // Se não é gratuito, verificar se o usuário tem acesso
    // TODO: Implementar lógica de verificação de compra/acesso
    // Por enquanto, apenas admin pode ver capítulos pagos
    if (user) {
      const { Permission } = require('@/domain/value-objects/Permission');
      if (Permission.isAdmin(user)) {
        return chapter;
      }
    }

    // Usuário não tem acesso
    throw new Error('Capítulo não disponível. Faça login ou compre o acesso.');
  }
}

