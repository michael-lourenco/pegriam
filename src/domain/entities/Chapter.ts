/**
 * Entidade de Domínio: Chapter (Capítulo)
 * 
 * Representa um capítulo de uma história.
 * Contém blocos modulares de conteúdo.
 */

import { StoryId } from './Story';
import { ContentBlock, ContentBlockFactory, ContentBlockDTO } from './ContentBlock';

export type ChapterId = string & { readonly __brand: 'ChapterId' };

export interface CreateChapterDTO {
  storyId: StoryId;
  number: number;
  title: string;
  blocks: ContentBlockDTO[];
  isFree: boolean;
}

export class Chapter {
  constructor(
    public readonly id: ChapterId,
    public readonly storyId: StoryId,
    public readonly number: number,
    public readonly title: string,
    public readonly blocks: ContentBlock[],
    public readonly publishedAt: Date,
    public readonly isFree: boolean,
    public readonly estimatedReadTime: number,
    public readonly wordCount: number,
    public readonly order: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Factory method para criar um novo Chapter
   */
  static create(dto: CreateChapterDTO): Chapter {
    const now = new Date();
    const id = this.generateId();
    const blocks = dto.blocks.map(block => ContentBlockFactory.fromDTO(block));

    const wordCount = this.calculateWordCount(blocks);
    const estimatedReadTime = Math.ceil(wordCount / 200); // 200 palavras/minuto

    return new Chapter(
      id,
      dto.storyId,
      dto.number,
      dto.title,
      blocks,
      now,
      dto.isFree,
      estimatedReadTime,
      wordCount,
      dto.number,
      now,
      now
    );
  }

  /**
   * Reordenar blocos
   */
  reorderBlocks(newOrder: number[]): Chapter {
    if (newOrder.length !== this.blocks.length) {
      throw new Error('A nova ordem deve conter todos os blocos');
    }

    const reorderedBlocks = newOrder
      .map((newIndex, oldIndex) => ({
        block: this.blocks[oldIndex],
        newOrder: newIndex,
      }))
      .sort((a, b) => a.newOrder - b.newOrder)
      .map(({ block, newOrder }) => block.updateOrder(newOrder));

    return new Chapter(
      this.id,
      this.storyId,
      this.number,
      this.title,
      reorderedBlocks,
      this.publishedAt,
      this.isFree,
      this.estimatedReadTime,
      this.wordCount,
      this.order,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Adicionar bloco em uma posição específica
   */
  addBlock(block: ContentBlock, position: number): Chapter {
    if (position < 0 || position > this.blocks.length) {
      throw new Error('Posição inválida para adicionar bloco');
    }

    const newBlocks = [...this.blocks];
    const blockWithOrder = block.updateOrder(position);
    newBlocks.splice(position, 0, blockWithOrder);

    // Reordenar blocos seguintes
    const reorderedBlocks = newBlocks.map((b, index) =>
      b.updateOrder(index)
    );

    const wordCount = Chapter.calculateWordCount(reorderedBlocks);
    const estimatedReadTime = Math.ceil(wordCount / 200);

    return new Chapter(
      this.id,
      this.storyId,
      this.number,
      this.title,
      reorderedBlocks,
      this.publishedAt,
      this.isFree,
      estimatedReadTime,
      wordCount,
      this.order,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Remover bloco
   */
  removeBlock(blockId: string): Chapter {
    const blockIndex = this.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
      throw new Error('Bloco não encontrado');
    }

    const newBlocks = this.blocks
      .filter(b => b.id !== blockId)
      .map((b, index) => b.updateOrder(index));

    const wordCount = Chapter.calculateWordCount(newBlocks);
    const estimatedReadTime = Math.ceil(wordCount / 200);

    return new Chapter(
      this.id,
      this.storyId,
      this.number,
      this.title,
      newBlocks,
      this.publishedAt,
      this.isFree,
      estimatedReadTime,
      wordCount,
      this.order,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Atualizar bloco
   */
  updateBlock(blockId: string, updatedBlock: ContentBlock): Chapter {
    const blockIndex = this.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
      throw new Error('Bloco não encontrado');
    }

    const newBlocks = [...this.blocks];
    newBlocks[blockIndex] = updatedBlock.updateOrder(blockIndex);

    const wordCount = Chapter.calculateWordCount(newBlocks);
    const estimatedReadTime = Math.ceil(wordCount / 200);

    return new Chapter(
      this.id,
      this.storyId,
      this.number,
      this.title,
      newBlocks,
      this.publishedAt,
      this.isFree,
      estimatedReadTime,
      wordCount,
      this.order,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Converter capítulo para Markdown completo
   */
  toMarkdown(): string {
    const blocks = this.blocks
      .sort((a, b) => a.order - b.order)
      .map(block => block.toMarkdown())
      .join('\n\n');

    return `# ${this.title}\n\n${blocks}`;
  }

  /**
   * Converter capítulo para HTML completo
   */
  toHTML(): string {
    const blocks = this.blocks
      .sort((a, b) => a.order - b.order)
      .map(block => block.toHTML())
      .join('\n');

    return `<article><h1>${this.title}</h1>${blocks}</article>`;
  }

  /**
   * Validações de negócio
   */
  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Título do capítulo é obrigatório');
    }

    if (this.title.length > 200) {
      throw new Error('Título não pode ter mais de 200 caracteres');
    }

    if (this.number < 1) {
      throw new Error('Número do capítulo deve ser maior que zero');
    }

    if (this.blocks.length === 0) {
      throw new Error('Capítulo deve ter pelo menos um bloco de conteúdo');
    }
  }

  /**
   * Calcular contagem de palavras
   */
  private static calculateWordCount(blocks: ContentBlock[]): number {
    return blocks.reduce((count, block) => {
      if (block.type === 'text') {
        const textBlock = block as import('./ContentBlock').TextBlock;
        const words = textBlock.content.trim().split(/\s+/).filter(w => w.length > 0);
        return count + words.length;
      }
      return count;
    }, 0);
  }

  /**
   * Gerar ID único para o capítulo
   */
  private static generateId(): ChapterId {
    return `chapter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as ChapterId;
  }
}


