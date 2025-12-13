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
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Digite seu texto em Markdown...',
  disabled = false,
  className,
}: MarkdownEditorProps) {
  const [preview, setPreview] = useState<string>('');

  // Atualizar preview quando o valor mudar
  useEffect(() => {
    if (value.trim()) {
      const rendered = MarkdownRendererService.renderWithProse(value);
      setPreview(rendered);
    } else {
      setPreview('');
    }
  }, [value]);

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
      {/* Editor (Markdown) */}
      <div className={cn("flex flex-col min-h-0")}>
        <label className={cn("text-sm font-medium mb-2 text-foreground flex-shrink-0")}>
          Editor Markdown
        </label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 font-mono text-sm resize-none min-h-[300px] max-h-[60vh]",
            "focus-visible:ring-2 focus-visible:ring-ring"
          )}
        />
        <p className={cn("text-xs text-muted-foreground mt-2 flex-shrink-0")}>
          Use sintaxe Markdown: # para títulos, ** para negrito, * para itálico, etc.
        </p>
      </div>

      {/* Preview (HTML Renderizado) */}
      <div className={cn("flex flex-col min-h-0")}>
        <label className={cn("text-sm font-medium mb-2 text-foreground flex-shrink-0")}>
          Preview
        </label>
        <div
          className={cn(
            "flex-1 border rounded-md p-4 overflow-y-auto bg-background min-h-[300px] max-h-[60vh]",
            "prose prose-lg dark:prose-invert max-w-none",
            preview ? '' : 'text-muted-foreground flex items-center justify-center'
          )}
        >
          {preview ? (
            <div dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <p className={cn("text-sm")}>Preview aparecerá aqui...</p>
          )}
        </div>
      </div>
    </div>
  );
}

