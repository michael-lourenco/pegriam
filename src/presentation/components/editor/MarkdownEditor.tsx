'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownRendererService } from '@/application/services/MarkdownRendererService';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Quando true, editor e preview preenchem a altura do container pai */
  fillHeight?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Digite seu texto em Markdown...',
  disabled = false,
  className,
  fillHeight = false,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (value.trim()) {
      // HTML puro — o container prose-parchment cuida das cores
      setPreview(MarkdownRendererService.render(value));
    } else {
      setPreview('');
    }
  }, [value]);

  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-4',
        fillHeight && 'h-full min-h-0',
        className
      )}
    >
      {/* Editor — fundo escuro, texto claro (código) */}
      <div className={cn('flex flex-col min-h-0', fillHeight && 'h-full')}>
        <label
          className={cn(
            'text-sm font-medium mb-2 flex-shrink-0',
            'text-[hsl(var(--parchment))]'
          )}
        >
          Editor Markdown
        </label>
        {fillHeight ? (
          <div className={cn('relative flex-1 min-h-0')}>
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'absolute inset-0 h-full font-mono text-sm resize-none',
                'bg-[hsl(var(--navy))] border-gold/30',
                'text-[hsl(var(--parchment))] placeholder:text-white/35',
                'focus-visible:ring-gold/40'
              )}
            />
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex-1 font-mono text-sm resize-none min-h-[300px] max-h-[60vh]',
              'bg-[hsl(var(--navy))] border-gold/30',
              'text-[hsl(var(--parchment))] placeholder:text-white/35',
              'focus-visible:ring-gold/40'
            )}
          />
        )}
        <p className={cn('text-xs text-white/45 mt-2 flex-shrink-0')}>
          Use sintaxe Markdown: # para títulos, ** para negrito, * para itálico, etc.
        </p>
      </div>

      {/* Preview — pergaminho como no leitor público */}
      <div className={cn('flex flex-col min-h-0', fillHeight && 'h-full')}>
        <label
          className={cn(
            'text-sm font-medium mb-2 flex-shrink-0',
            'text-[hsl(var(--parchment))]'
          )}
        >
          Preview (como o leitor verá)
        </label>
        <div
          className={cn(
            'border border-gold/35 rounded-md p-4 overflow-y-auto',
            'reader-parchment prose-parchment max-w-none',
            fillHeight
              ? 'flex-1 min-h-0'
              : 'flex-1 min-h-[300px] max-h-[60vh]',
            !preview && 'flex items-center justify-center'
          )}
        >
          {preview ? (
            <div dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <p className={cn('text-sm text-[hsl(215_30%_40%)]')}>
              Preview aparecerá aqui...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
