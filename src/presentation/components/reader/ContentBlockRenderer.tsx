/**
 * Componente para renderizar blocos de conteúdo
 * 
 * Renderiza diferentes tipos de blocos (texto, imagem, citação, separador)
 */

'use client';

import { ContentBlock, TextBlock, ImageBlock, QuoteBlock, SeparatorBlock } from '@/domain/entities/ContentBlock';
import { cn } from '@/lib/utils';

interface ContentBlockRendererProps {
  block: ContentBlock;
}

export function ContentBlockRenderer({ block }: ContentBlockRendererProps) {
  switch (block.type) {
    case 'text':
      return <TextBlockComponent block={block as TextBlock} />;
    case 'image':
      return <ImageBlockComponent block={block as ImageBlock} />;
    case 'quote':
      return <QuoteBlockComponent block={block as QuoteBlock} />;
    case 'separator':
      return <SeparatorBlockComponent block={block as SeparatorBlock} />;
    default:
      return null;
  }
}

function TextBlockComponent({ block }: { block: TextBlock }) {
  // Se for markdown, pode usar um parser no futuro
  const content = block.format === 'markdown' 
    ? block.content 
    : block.content;

  return (
    <div className={cn("prose prose-lg max-w-none dark:prose-invert my-6")}>
      <div 
        className={cn("whitespace-pre-wrap")}
        dangerouslySetInnerHTML={{ __html: block.toHTML() }}
      />
    </div>
  );
}

function ImageBlockComponent({ block }: { block: ImageBlock }) {
  return (
    <figure className={cn("my-8")}>
      <div className={cn("w-full bg-muted rounded-lg overflow-hidden")}>
        <img
          src={block.url}
          alt={block.alt}
          className={cn("w-full h-auto")}
        />
      </div>
      {block.caption && (
        <figcaption className={cn("text-sm text-muted-foreground text-center mt-2")}>
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function QuoteBlockComponent({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className={cn("border-l-4 border-primary pl-6 py-4 my-8 italic")}>
      <p className={cn("text-lg text-foreground mb-2")}>
        {block.quote}
      </p>
      {block.author && (
        <cite className={cn("text-sm text-muted-foreground not-italic")}>
          — {block.author}
        </cite>
      )}
    </blockquote>
  );
}

function SeparatorBlockComponent({ block }: { block: SeparatorBlock }) {
  return (
    <hr className={cn("my-8 border-border")} />
  );
}

