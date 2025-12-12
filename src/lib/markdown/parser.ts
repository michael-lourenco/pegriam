/**
 * Parser de Markdown para HTML usando a biblioteca 'marked'
 */

import { marked } from 'marked'

// Configurar marked com opções customizadas
marked.setOptions({
  breaks: true, // Converter quebras de linha simples em <br>
  gfm: true, // GitHub Flavored Markdown
})

export function parseMarkdownToHTML(markdown: string): string {
  // Converter Markdown para HTML
  let html = marked.parse(markdown) as string

  // Processar itálicos de Pegriam (comentários do narrador)
  // Padrão: *texto em itálico* no início de parágrafo
  html = html.replace(
    /<p>\*([^*]+)\*<\/p>/g,
    '<p class="italic text-primary pl-4 border-l-2 border-primary mb-6">$1</p>'
  )

  // Converter separadores --- em HR estilizado
  html = html.replace(/<hr>/g, '<hr class="my-8 border-border">')

  // Adicionar classes Tailwind para tipografia
  html = html
    .replace(/<h1>/g, '<h1 class="text-4xl font-bold text-primary mb-4 mt-8">')
    .replace(/<h2>/g, '<h2 class="text-3xl font-bold text-primary mb-3 mt-6">')
    .replace(/<h3>/g, '<h3 class="text-2xl font-semibold text-primary mb-2 mt-4">')
    .replace(/<p>/g, '<p class="mb-6 text-foreground leading-relaxed">')
    .replace(/<strong>/g, '<strong class="font-semibold text-primary">')
    .replace(/<em>/g, '<em class="italic text-primary">')
    .replace(/<a /g, '<a class="text-primary underline hover:text-primary/80" ')

  return html
}

// Função auxiliar para estimar tempo de leitura
export function estimateReadingTime(wordCount: number): number {
  // Média de 200 palavras por minuto
  return Math.ceil(wordCount / 200)
}

// Função auxiliar para contar palavras
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

