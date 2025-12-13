/**
 * Entidade de Domínio: ContentBlock (Bloco de Conteúdo)
 * 
 * Representa um bloco modular de conteúdo dentro de um capítulo.
 * Suporta diferentes tipos: texto, imagem, citação, separador.
 */

export type ContentBlockType = 'text' | 'image' | 'quote' | 'separator';

export interface ContentBlockDTO {
  id: string;
  type: ContentBlockType;
  order: number;
  data: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Classe abstrata base para todos os tipos de blocos
 */
export abstract class ContentBlock {
  constructor(
    public readonly id: string,
    public readonly type: ContentBlockType,
    public readonly order: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Converter bloco para Markdown
   */
  abstract toMarkdown(): string;

  /**
   * Converter bloco para HTML
   */
  abstract toHTML(): string;

  /**
   * Converter bloco para DTO
   */
  abstract toDTO(): ContentBlockDTO;

  /**
   * Atualizar ordem do bloco
   */
  updateOrder(newOrder: number): ContentBlock {
    return this.createCopyWith({ order: newOrder });
  }

  /**
   * Método abstrato para criar cópia com alterações
   */
  protected abstract createCopyWith(changes: Partial<ContentBlockDTO>): ContentBlock;
}

/**
 * Bloco de Texto
 */
export class TextBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    public readonly content: string,
    public readonly format: 'markdown' = 'markdown', // Sempre markdown agora
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      id,
      'text',
      order,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  toMarkdown(): string {
    return this.content;
  }

  toHTML(): string {
    // Usar MarkdownRendererService para renderizar markdown
    // Importação dinâmica para evitar dependência circular
    try {
      const { MarkdownRendererService } = require('@/application/services/MarkdownRendererService');
      return MarkdownRendererService.render(this.content);
    } catch (error) {
      // Fallback se o serviço não estiver disponível
      return `<p>${this.content.replace(/\n/g, '<br>')}</p>`;
    }
  }

  toDTO(): ContentBlockDTO {
    return {
      id: this.id,
      type: this.type,
      order: this.order,
      data: {
        content: this.content,
        format: this.format || 'markdown', // Sempre markdown
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  protected createCopyWith(changes: Partial<ContentBlockDTO>): ContentBlock {
    const data = changes.data as { content?: string; format?: 'plain' | 'markdown' } | undefined;
    // Sempre usar 'markdown' (migração automática de 'plain')
    const format: 'markdown' = 'markdown';
    return new TextBlock(
      changes.id || this.id,
      changes.order ?? this.order,
      data?.content || this.content,
      format,
      changes.createdAt || this.createdAt,
      changes.updatedAt || new Date()
    );
  }

  /**
   * Atualizar conteúdo do bloco
   */
  updateContent(newContent: string): TextBlock {
    return new TextBlock(
      this.id,
      this.order,
      newContent,
      this.format,
      this.createdAt,
      new Date()
    );
  }
}

/**
 * Bloco de Imagem
 */
export class ImageBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    public readonly url: string,
    public readonly alt: string,
    public readonly caption?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      id,
      'image',
      order,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  toMarkdown(): string {
    let markdown = `![${this.alt}](${this.url})`;
    if (this.caption) {
      markdown += `\n*${this.caption}*`;
    }
    return markdown;
  }

  toHTML(): string {
    let html = `<img src="${this.url}" alt="${this.alt}" />`;
    if (this.caption) {
      html += `<p class="image-caption">${this.caption}</p>`;
    }
    return html;
  }

  toDTO(): ContentBlockDTO {
    return {
      id: this.id,
      type: this.type,
      order: this.order,
      data: {
        url: this.url,
        alt: this.alt,
        caption: this.caption,
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  protected createCopyWith(changes: Partial<ContentBlockDTO>): ContentBlock {
    const data = changes.data as { url?: string; alt?: string; caption?: string } || {};
    return new ImageBlock(
      changes.id || this.id,
      changes.order ?? this.order,
      data.url || this.url,
      data.alt || this.alt,
      data.caption !== undefined ? data.caption : this.caption,
      changes.createdAt || this.createdAt,
      changes.updatedAt || new Date()
    );
  }
}

/**
 * Bloco de Citação
 */
export class QuoteBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    public readonly quote: string,
    public readonly author?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      id,
      'quote',
      order,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  toMarkdown(): string {
    let markdown = `> ${this.quote}`;
    if (this.author) {
      markdown += `\n> — ${this.author}`;
    }
    return markdown;
  }

  toHTML(): string {
    let html = `<blockquote><p>${this.quote}</p>`;
    if (this.author) {
      html += `<cite>— ${this.author}</cite>`;
    }
    html += `</blockquote>`;
    return html;
  }

  toDTO(): ContentBlockDTO {
    return {
      id: this.id,
      type: this.type,
      order: this.order,
      data: {
        quote: this.quote,
        author: this.author,
      },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  protected createCopyWith(changes: Partial<ContentBlockDTO>): ContentBlock {
    const data = changes.data as { quote?: string; author?: string } || {};
    return new QuoteBlock(
      changes.id || this.id,
      changes.order ?? this.order,
      data.quote || this.quote,
      data.author !== undefined ? data.author : this.author,
      changes.createdAt || this.createdAt,
      changes.updatedAt || new Date()
    );
  }
}

/**
 * Bloco Separador
 */
export class SeparatorBlock extends ContentBlock {
  constructor(
    id: string,
    order: number,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(
      id,
      'separator',
      order,
      createdAt || new Date(),
      updatedAt || new Date()
    );
  }

  toMarkdown(): string {
    return '---';
  }

  toHTML(): string {
    return '<hr />';
  }

  toDTO(): ContentBlockDTO {
    return {
      id: this.id,
      type: this.type,
      order: this.order,
      data: {},
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  protected createCopyWith(changes: Partial<ContentBlockDTO>): ContentBlock {
    return new SeparatorBlock(
      changes.id || this.id,
      changes.order ?? this.order,
      changes.createdAt || this.createdAt,
      changes.updatedAt || new Date()
    );
  }
}

/**
 * Factory para criar blocos a partir de DTOs
 */
export class ContentBlockFactory {
  static fromDTO(dto: ContentBlockDTO): ContentBlock {
    switch (dto.type) {
      case 'text': {
        const data = dto.data as { content: string; format?: 'plain' | 'markdown' };
        // Migração automática: se format for 'plain' ou ausente, usar 'markdown'
        const format = (data.format === 'plain' || !data.format) ? 'markdown' : data.format;
        return new TextBlock(
          dto.id,
          dto.order,
          data.content,
          format,
          dto.createdAt,
          dto.updatedAt
        );
      }
      case 'image': {
        const data = dto.data as { url: string; alt: string; caption?: string };
        return new ImageBlock(
          dto.id,
          dto.order,
          data.url,
          data.alt,
          data.caption,
          dto.createdAt,
          dto.updatedAt
        );
      }
      case 'quote': {
        const data = dto.data as { quote: string; author?: string };
        return new QuoteBlock(
          dto.id,
          dto.order,
          data.quote,
          data.author,
          dto.createdAt,
          dto.updatedAt
        );
      }
      case 'separator':
        return new SeparatorBlock(
          dto.id,
          dto.order,
          dto.createdAt,
          dto.updatedAt
        );
      default:
        throw new Error(`Tipo de bloco desconhecido: ${(dto as { type: string }).type}`);
    }
  }
}


