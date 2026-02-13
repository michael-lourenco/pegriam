/**
 * Use Case: Buscar Capítulo
 * 
 * Implementa a lógica de negócio para buscar um capítulo por ID.
 * Verifica permissão de acesso: gratuito, admin ou compra confirmada.
 */

import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { IPurchaseRepository } from '@/domain/repositories/IPurchaseRepository';
import { Permission, User } from '@/domain/value-objects/Permission';

export class GetChapterUseCase {
  constructor(
    private readonly chapterRepository: IChapterRepository,
    private readonly storyRepository: IStoryRepository,
    private readonly purchaseRepository?: IPurchaseRepository
  ) {}

  async execute(user: User | null, chapterId: ChapterId): Promise<Chapter | null> {
    const chapter = await this.chapterRepository.findById(chapterId);
    
    if (!chapter) {
      return null;
    }

    // Capítulo gratuito: acesso livre
    if (chapter.isFree) {
      return chapter;
    }

    // Admin: acesso total
    if (user && Permission.isAdmin(user)) {
      return chapter;
    }

    // Usuário autenticado com compra confirmada
    if (user && this.purchaseRepository) {
      const purchase = await this.purchaseRepository.findByUserAndStory(
        user.id,
        chapter.storyId
      );

      if (purchase && purchase.isAccessGranted()) {
        return chapter;
      }
    }

    // Sem acesso
    throw new Error('Capítulo não disponível. Compre o acesso completo à história para continuar lendo.');
  }
}
