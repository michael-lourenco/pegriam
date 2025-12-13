/**
 * Use Case: Criar Novo Capítulo
 * 
 * Implementa a lógica de negócio para criar um novo capítulo.
 */

import { Chapter, CreateChapterDTO } from '@/domain/entities/Chapter';
import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { IChapterRenderedRepository } from '@/domain/repositories/IChapterRenderedRepository';
import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { Permission, User } from '@/domain/value-objects/Permission';
import { MarkdownRendererService } from '@/application/services/MarkdownRendererService';
import { ContentBlock } from '@/domain/entities/ContentBlock';

export class CreateChapterUseCase {
  constructor(
    private readonly chapterRepository: IChapterRepository,
    private readonly storyRepository: IStoryRepository,
    private readonly chapterRenderedRepository: IChapterRenderedRepository
  ) {}

  async execute(user: User, dto: CreateChapterDTO): Promise<Chapter> {
    // Verificar permissões
    if (!Permission.canCreateChapter(user, dto.storyId)) {
      throw new Error('Usuário não tem permissão para criar capítulos');
    }

    // Verificar se a história existe
    const story = await this.storyRepository.findById(dto.storyId);
    if (!story) {
      throw new Error('História não encontrada');
    }

    // Criar entidade Chapter
    const chapter = Chapter.create(dto);

    // Salvar no repositório
    await this.chapterRepository.save(chapter);

    // Renderizar e salvar versão renderizada
    try {
      const renderedHtml = this.renderChapter(chapter);
      await this.chapterRenderedRepository.save(chapter.id, renderedHtml);
    } catch (error) {
      console.error('Erro ao renderizar capítulo:', error);
      // Não falhar a criação se a renderização falhar
      // O capítulo pode ser renderizado depois
    }

    // Atualizar metadata da história
    const chapterCount = await this.chapterRepository.countByStoryId(dto.storyId);
    const updatedStory = story.updateMetadata({
      totalChapters: chapterCount,
      estimatedReadTime: story.metadata.estimatedReadTime + chapter.estimatedReadTime,
    });
    await this.storyRepository.save(updatedStory);

    return chapter;
  }

  /**
   * Renderiza um capítulo completo em HTML
   */
  private renderChapter(chapter: Chapter): string {
    const fullMarkdown = chapter.toMarkdown();
    return MarkdownRendererService.renderWithProse(fullMarkdown);
  }
}

