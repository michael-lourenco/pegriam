'use client';

import { cn } from '@/lib/utils';
import { SafeImage } from './SafeImage';

interface BookCoverProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-24', // ~96px de largura, altura será ~144px (2:3)
  md: 'w-32', // ~128px de largura, altura será ~192px
  lg: 'w-48', // ~192px de largura, altura será ~288px
  xl: 'w-64 md:w-80', // ~256px-320px de largura, altura será ~384px-480px
};

export function BookCover({ src, alt, className, size = 'md' }: BookCoverProps) {
  const widthClass = sizeClasses[size];

  return (
    <div className={cn("relative bg-muted rounded-lg overflow-hidden", widthClass, className)}>
      {/* Container com proporção 2:3 (altura = 1.5x largura) */}
      <div className={cn("relative w-full")} style={{ paddingBottom: '150%' }}>
        {src ? (
          <SafeImage
            src={src}
            alt={alt}
            className={cn("absolute inset-0 w-full h-full object-contain")}
          />
        ) : (
          <div className={cn("absolute inset-0 flex items-center justify-center")}>
            <span className={cn("text-xs text-muted-foreground")}>Sem capa</span>
          </div>
        )}
      </div>
    </div>
  );
}

