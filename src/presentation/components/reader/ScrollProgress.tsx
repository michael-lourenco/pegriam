'use client';

import { cn } from '@/lib/utils';

interface ScrollProgressProps {
  percentage: number;
  className?: string;
}

export function ScrollProgress({ percentage, className }: ScrollProgressProps) {
  return (
    <div
      className={cn("fixed top-0 left-0 right-0 z-50 h-1 bg-muted", className)}
      role="progressbar"
      aria-valuenow={Math.round(percentage)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso de leitura"
    >
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
