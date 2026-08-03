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
      const rendered = MarkdownRendererService.renderWithProse(value);
      setPreview(rendered);
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
      <div className={cn('flex flex-col min-h-0', fillHeight && 'h-full')}>
        <label className={cn('text-sm font-medium mb-2 text-foreground flex-shrink-0')}>
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
                'focus-visible:ring-2 focus-visible:ring-ring'
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
              'focus-visible:ring-2 focus-visible:ring-ring'
            )}
          />
        )}
        <p className={cn('text-xs text-muted-foreground mt-2 flex-shrink-0')}>
          Use sintaxe Markdown: # para títulos, ** para negrito, * para itálico, etc.
        </p>
      </div>

      <div className={cn('flex flex-col min-h-0', fillHeight && 'h-full')}>
        <label className={cn('text-sm font-medium mb-2 text-foreground flex-shrink-0')}>
          Preview
        </label>
        <div
          className={cn(
            'border rounded-md p-4 overflow-y-auto bg-background',
            'prose prose-lg dark:prose-invert max-w-none',
            fillHeight
              ? 'flex-1 min-h-0'
              : 'flex-1 min-h-[300px] max-h-[60vh]',
            preview ? '' : 'text-muted-foreground flex items-center justify-center'
          )}
        >
          {preview ? (
            <div dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <p className={cn('text-sm')}>Preview aparecerá aqui...</p>
          )}
        </div>
      </div>
    </div>
  );
}
