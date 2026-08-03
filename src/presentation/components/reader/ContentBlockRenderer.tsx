/**
 * Componente para renderizar blocos de conteúdo.
 * Cores pensadas para superfície de pergaminho (leitura / preview admin).
 */

'use client';

import {
  ContentBlock,
  TextBlock,
  ImageBlock,
  QuoteBlock,
  SeparatorBlock,
} from '@/domain/entities/ContentBlock';
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
      return <SeparatorBlockComponent />;
    default:
      return null;
  }
}

function TextBlockComponent({ block }: { block: TextBlock }) {
  return (
    <div className={cn('prose-parchment max-w-none my-4')}>
      <div dangerouslySetInnerHTML={{ __html: block.toHTML() }} />
    </div>
  );
}

function ImageBlockComponent({ block }: { block: ImageBlock }) {
  return (
    <figure className={cn('my-6')}>
      <div
        className={cn(
          'w-full overflow-hidden rounded-lg',
          'border border-[hsl(215_50%_14%_/_0.2)] bg-[hsl(215_30%_90%)]'
        )}
      >
        <img src={block.url} alt={block.alt} className={cn('w-full h-auto')} />
      </div>
      {block.caption && (
        <figcaption
          className={cn(
            'text-sm text-center mt-2 italic',
            'text-[hsl(215_35%_28%)]'
          )}
        >
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

function QuoteBlockComponent({ block }: { block: QuoteBlock }) {
  return (
    <blockquote
      className={cn(
        'border-l-4 border-[hsl(38_72%_42%)] pl-6 py-4 my-6 italic',
        'text-[hsl(215_40%_22%)]'
      )}
    >
      <p className={cn('text-lg mb-2')}>{block.quote}</p>
      {block.author && (
        <cite className={cn('text-sm not-italic text-[hsl(215_30%_35%)]')}>
          — {block.author}
        </cite>
      )}
    </blockquote>
  );
}

function SeparatorBlockComponent() {
  return (
    <hr
      className={cn(
        'my-8 border-0 h-px',
        'bg-gradient-to-r from-transparent via-[hsl(38_50%_50%_/_0.55)] to-transparent'
      )}
    />
  );
}
