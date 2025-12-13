'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export function SafeImage({ src, alt, fallback, className, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.error('Erro ao carregar imagem:', imgSrc);
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
    } else {
      setHasError(true);
    }
  };

  if (hasError && !fallback) {
    return (
      <div className={cn("w-full h-full bg-muted flex items-center justify-center", className)}>
        <span className={cn("text-xs text-muted-foreground")}>Imagem não disponível</span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={() => {
        console.log('Imagem carregada:', imgSrc);
      }}
    />
  );
}

