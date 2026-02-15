'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { READING } from '@/shared/constants';
import type { ReadingPreferences } from '@/shared/hooks/useReadingPreferences';

interface ReadingToolbarProps {
  prefs: ReadingPreferences;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onIncreaseLineHeight: () => void;
  onDecreaseLineHeight: () => void;
  onToggleFontFamily: () => void;
  onToggleImmersiveMode: () => void;
  onReset: () => void;
  className?: string;
}

export function ReadingToolbar({
  prefs,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onIncreaseLineHeight,
  onDecreaseLineHeight,
  onToggleFontFamily,
  onToggleImmersiveMode,
  onReset,
  className,
}: ReadingToolbarProps) {
  return (
    <div className={cn(
      "flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border bg-card",
      className
    )}>
      {/* Font size */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Fonte</span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 text-xs"
          onClick={onDecreaseFontSize}
          disabled={prefs.fontSize <= READING.minFontSize}
          aria-label="Diminuir fonte"
        >
          A-
        </Button>
        <span className="text-xs text-muted-foreground w-8 text-center">{prefs.fontSize}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0 text-xs"
          onClick={onIncreaseFontSize}
          disabled={prefs.fontSize >= READING.maxFontSize}
          aria-label="Aumentar fonte"
        >
          A+
        </Button>
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Line height */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Espaco</span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onDecreaseLineHeight}
          disabled={prefs.lineHeight <= READING.minLineHeight}
          aria-label="Diminuir espacamento"
        >
          <LineHeightDownIcon />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onIncreaseLineHeight}
          disabled={prefs.lineHeight >= READING.maxLineHeight}
          aria-label="Aumentar espacamento"
        >
          <LineHeightUpIcon />
        </Button>
      </div>

      <div className="h-5 w-px bg-border" />

      {/* Font family toggle */}
      <Button
        variant={prefs.fontFamily === 'serif' ? 'default' : 'outline'}
        size="sm"
        className="h-7 text-xs"
        onClick={onToggleFontFamily}
        aria-label="Alternar fonte"
      >
        {prefs.fontFamily === 'serif' ? 'Serifada' : 'Sem Serifa'}
      </Button>

      <div className="h-5 w-px bg-border" />

      {/* Immersive mode */}
      <Button
        variant={prefs.immersiveMode ? 'default' : 'outline'}
        size="sm"
        className="h-7 text-xs"
        onClick={onToggleImmersiveMode}
        aria-label="Modo imersivo"
      >
        {prefs.immersiveMode ? 'Sair Imersivo' : 'Imersivo'}
      </Button>

      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs ml-auto"
        onClick={onReset}
        aria-label="Resetar configuracoes"
      >
        Resetar
      </Button>
    </div>
  );
}

function LineHeightDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function LineHeightUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="4" x2="20" y2="4" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="20" x2="20" y2="20" />
    </svg>
  );
}
