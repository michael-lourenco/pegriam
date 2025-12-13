/**
 * Serviço de Renderização de Markdown
 * 
 * Responsável por converter markdown em HTML sanitizado.
 * Usado para pré-processar capítulos no admin e otimizar leitura pública.
 */

import { marked } from 'marked';
import DOMPurify from 'dompurify';

export class MarkdownRendererService {
  /**
   * Configurar marked com opções seguras
   */
  private static configureMarked() {
    marked.setOptions({
      breaks: true, // Converter quebras de linha em <br>
      gfm: true, // GitHub Flavored Markdown
    });
  }

  /**
   * Renderizar markdown para HTML sanitizado
   * 
   * @param markdown Texto em markdown
   * @returns HTML sanitizado e seguro
   */
  static render(markdown: string): string {
    // Configurar marked na primeira chamada
    if (!marked.getDefaults().breaks) {
      this.configureMarked();
    }

    // Converter markdown para HTML
    const html = marked.parse(markdown) as string;

    // Sanitizar HTML para prevenir XSS
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote',
        'a', 'img', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'alt', 'src', 'class', 'id',
        'target', 'rel', // Para links
      ],
      ALLOW_DATA_ATTR: false,
      KEEP_CONTENT: true,
    });

    return sanitized;
  }

  /**
   * Renderizar múltiplos blocos de markdown em HTML unificado
   * 
   * @param markdownBlocks Array de strings markdown
   * @returns HTML sanitizado unificado
   */
  static renderMultiple(markdownBlocks: string[]): string {
    const combined = markdownBlocks
      .filter(block => block && block.trim().length > 0)
      .join('\n\n');

    return this.render(combined);
  }

  /**
   * Renderizar markdown com classes CSS do Tailwind Typography
   * 
   * @param markdown Texto em markdown
   * @returns HTML sanitizado com classes do prose
   */
  static renderWithProse(markdown: string): string {
    const html = this.render(markdown);
    
    // Envolver em div com classes do Tailwind Typography
    return `<div class="prose prose-lg dark:prose-invert max-w-none">${html}</div>`;
  }
}
