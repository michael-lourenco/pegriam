/**
 * Use Case: Atualizar Capítulo
 * 
 * Implementa a lógica de negócio para atualizar um capítulo existente.
 */

import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { IChapterRenderedRepository } from '@/domain/repositories/IChapterRenderedRepository';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Permission, User } from '@/domain/value-objects/Permission';
import { MarkdownRendererService } from '@/application/services/MarkdownRendererService';
import { ContentBlock } from '@/domain/entities/ContentBlock';

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
    private readonly storyRepository: IStoryRepository,
    private readonly chapterRenderedRepository: IChapterRenderedRepository
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

      // Recalcular wordCount e estimatedReadTime baseado nos novos blocos
      const wordCount = this.calculateWordCount(blocks);
      const estimatedReadTime = Math.ceil(wordCount / 200);

      updatedChapter = new Chapter(
        updatedChapter.id,
        updatedChapter.storyId,
        updatedChapter.number,
        updatedChapter.title,
        blocks,
        updatedChapter.publishedAt,
        dto.isFree !== undefined ? dto.isFree : updatedChapter.isFree,
        estimatedReadTime,
        wordCount,
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

    // Renderizar e salvar versão renderizada
    try {
      const renderedHtml = this.renderChapter(updatedChapter);
      await this.chapterRenderedRepository.save(updatedChapter.id, renderedHtml);
    } catch (error) {
      console.error('Erro ao renderizar capítulo:', error);
      // Não falhar a atualização se a renderização falhar
      // O capítulo pode ser renderizado depois
    }

    return updatedChapter;
  }

  /**
   * Renderiza um capítulo completo em HTML
   */
  private renderChapter(chapter: Chapter): string {
    const fullMarkdown = chapter.toMarkdown();
    return MarkdownRendererService.renderWithProse(fullMarkdown);
  }

  /**
   * Calcula a contagem de palavras dos blocos de texto
   */
  private calculateWordCount(blocks: ContentBlock[]): number {
    return blocks.reduce((count, block) => {
      if (block.type === 'text') {
        const textBlock = block as import('@/domain/entities/ContentBlock').TextBlock;
        const words = textBlock.content.trim().split(/\s+/).filter(w => w.length > 0);
        return count + words.length;
      }
      return count;
    }, 0);
  }
}

