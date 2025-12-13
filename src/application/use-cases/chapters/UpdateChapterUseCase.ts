/**
 * Use Case: Atualizar Capítulo
 * 
 * Implementa a lógica de negócio para atualizar um capítulo existente.
 */

import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Permission, User } from '@/domain/value-objects/Permission';

export interface UpdateChapterDTO {
  title?: string;
  blocks?: Array<{
    id: string;
    type: 'text' | 'image' | 'quote' | 'separator';
    order: number;
    data: Record<string, unknown>;
  }>;
  isFree?: boolean;
}

export class UpdateChapterUseCase {
  constructor(
    private readonly chapterRepository: IChapterRepository,
    private readonly storyRepository: IStoryRepository
  ) {}

  async execute(user: User, chapterId: ChapterId, dto: UpdateChapterDTO): Promise<Chapter> {
    // Verificar permissões
    if (!Permission.canEditChapter(user, String(chapterId))) {
      throw new Error('Usuário não tem permissão para editar este capítulo');
    }

    // Buscar capítulo existente
    const existingChapter = await this.chapterRepository.findById(chapterId);
    if (!existingChapter) {
      throw new Error('Capítulo não encontrado');
    }

    // Criar nova instância com valores atualizados
    let updatedChapter = existingChapter;

    // Atualizar título se fornecido
    if (dto.title !== undefined) {
      updatedChapter = new Chapter(
        updatedChapter.id,
        updatedChapter.storyId,
        updatedChapter.number,
        dto.title,
        updatedChapter.blocks,
        updatedChapter.publishedAt,
        updatedChapter.isFree,
        updatedChapter.estimatedReadTime,
        updatedChapter.wordCount,
        updatedChapter.order,
        updatedChapter.createdAt,
        new Date()
      );
    }

    // Atualizar blocos se fornecidos
    if (dto.blocks !== undefined) {
      const { ContentBlockFactory } = require('@/domain/entities/ContentBlock');
      const blocks = dto.blocks
        .map(blockDto => {
          const blockWithDates = {
            ...blockDto,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          return ContentBlockFactory.fromDTO(blockWithDates);
        })
        .sort((a, b) => a.order - b.order);

      updatedChapter = new Chapter(
        updatedChapter.id,
        updatedChapter.storyId,
        updatedChapter.number,
        updatedChapter.title,
        blocks,
        updatedChapter.publishedAt,
        dto.isFree !== undefined ? dto.isFree : updatedChapter.isFree,
        updatedChapter.estimatedReadTime,
        updatedChapter.wordCount,
        updatedChapter.order,
        updatedChapter.createdAt,
        new Date()
      );
    }

    // Atualizar isFree se fornecido
    if (dto.isFree !== undefined && dto.blocks === undefined) {
      updatedChapter = new Chapter(
        updatedChapter.id,
        updatedChapter.storyId,
        updatedChapter.number,
        updatedChapter.title,
        updatedChapter.blocks,
        updatedChapter.publishedAt,
        dto.isFree,
        updatedChapter.estimatedReadTime,
        updatedChapter.wordCount,
        updatedChapter.order,
        updatedChapter.createdAt,
        new Date()
      );
    }

    // Salvar atualização
    await this.chapterRepository.save(updatedChapter);

    return updatedChapter;
  }
}

