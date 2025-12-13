/**
 * Entidade de Domínio: Story (História)
 * 
 * Representa uma história completa no sistema.
 * Contém regras de negócio e validações.
 */

export type StoryId = string & { readonly __brand: 'StoryId' };
export type StoryStatus = 'draft' | 'publishing' | 'completed';

export interface StoryMetadata {
  totalChapters: number;
  estimatedReadTime: number; // em minutos
}

export interface CreateStoryDTO {
  title: string;
  description: string;
  author: string;
  coverImage?: string;
  status: StoryStatus;
  freeChapters: number;
  pdfPrice: number;
  tags: string[];
}

export class Story {
  constructor(
    public readonly id: StoryId,
    public readonly title: string,
    public readonly description: string,
    public readonly author: string,
    public readonly coverImage: string | undefined,
    public readonly publishedAt: Date,
    public readonly status: StoryStatus,
    public readonly freeChapters: number,
    public readonly pdfPrice: number,
    public readonly tags: string[],
    public readonly metadata: StoryMetadata,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Factory method para criar uma nova Story
   */
  static create(dto: CreateStoryDTO): Story {
    const now = new Date();
    const id = this.generateId();

    return new Story(
      id,
      dto.title,
      dto.description,
      dto.author,
      dto.coverImage,
      now,
      dto.status,
      dto.freeChapters,
      dto.pdfPrice,
      dto.tags,
      {
        totalChapters: 0,
        estimatedReadTime: 0,
      },
      now,
      now
    );
  }

  /**
   * Atualizar metadata da história
   */
  updateMetadata(metadata: StoryMetadata): Story {
    return new Story(
      this.id,
      this.title,
      this.description,
      this.author,
      this.coverImage,
      this.publishedAt,
      this.status,
      this.freeChapters,
      this.pdfPrice,
      this.tags,
      metadata,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Publicar a história
   */
  publish(): Story {
    if (this.status === 'completed') {
      throw new Error('História já está completa e não pode ser publicada novamente');
    }

    return new Story(
      this.id,
      this.title,
      this.description,
      this.author,
      this.coverImage,
      this.publishedAt,
      'publishing',
      this.freeChapters,
      this.pdfPrice,
      this.tags,
      this.metadata,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Marcar como completa
   */
  complete(): Story {
    return new Story(
      this.id,
      this.title,
      this.description,
      this.author,
      this.coverImage,
      this.publishedAt,
      'completed',
      this.freeChapters,
      this.pdfPrice,
      this.tags,
      this.metadata,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Validações de negócio
   */
  private validate(): void {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Título da história é obrigatório');
    }

    if (this.title.length > 200) {
      throw new Error('Título não pode ter mais de 200 caracteres');
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new Error('Descrição da história é obrigatória');
    }

    if (this.description.length > 1000) {
      throw new Error('Descrição não pode ter mais de 1000 caracteres');
    }

    if (!this.author || this.author.trim().length === 0) {
      throw new Error('Autor da história é obrigatório');
    }

    if (this.freeChapters < 0) {
      throw new Error('Número de capítulos gratuitos não pode ser negativo');
    }

    if (this.pdfPrice < 0) {
      throw new Error('Preço do PDF não pode ser negativo');
    }

    if (this.tags.length > 10) {
      throw new Error('Máximo de 10 tags permitidas');
    }
  }

  /**
   * Gerar ID único para a história
   */
  private static generateId(): StoryId {
    return `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` as StoryId;
  }
}


