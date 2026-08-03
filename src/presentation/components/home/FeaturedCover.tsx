/**
 * Componente: FeaturedCover
 *
 * Capa widescreen (listagens e página da história).
 * Proporção fixa 16:9 (1920×1080). Imagens fora dessa proporção
 * preenchem o espaço com object-cover (recorte central).
 */

'use client';

import { cn } from '@/lib/utils';
import { SafeImage } from '@/presentation/components/shared/SafeImage';

interface FeaturedCoverProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function FeaturedCover({ src, alt, className }: FeaturedCoverProps) {
  return (
    <div
      className={cn(
        'relative w-full aspect-video overflow-hidden bg-muted',
        className
      )}
    >
      {src ? (
        <SafeImage
          src={src}
          alt={alt}
          className={cn('absolute inset-0 w-full h-full object-cover object-center')}
        />
      ) : (
        <div className={cn('absolute inset-0 flex items-center justify-center')}>
          <span className={cn('text-xs text-muted-foreground')}>Sem capa</span>
        </div>
      )}
    </div>
  );
}
