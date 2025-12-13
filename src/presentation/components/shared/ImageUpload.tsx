'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
  folder?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Imagem',
  disabled = false,
  folder = 'stories/covers',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de arquivo não permitido. Use apenas imagens (JPEG, PNG, WebP, GIF)');
      return;
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Fazer upload
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload');
      }

      console.log('URL recebida do upload:', data.url);
      onChange(data.url);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da imagem');
      setPreview(null);
    } finally {
      setUploading(false);
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn("space-y-2")}>
      <Label>{label}</Label>
      
      {preview ? (
        <div className={cn("space-y-2")}>
          <div className={cn("relative w-full h-48 bg-muted rounded-md overflow-hidden border border-border")}>
            <img
              src={preview}
              alt="Preview"
              className={cn("w-full h-full object-cover")}
            />
          </div>
          <div className={cn("flex gap-2")}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || disabled}
            >
              {uploading ? 'Enviando...' : 'Trocar Imagem'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={uploading || disabled}
            >
              Remover
            </Button>
          </div>
          {value && (
            <p className={cn("text-xs text-muted-foreground break-all")}>
              URL: {value}
            </p>
          )}
        </div>
      ) : (
        <div className={cn("space-y-2")}>
          <div
            className={cn(
              "border-2 border-dashed border-border rounded-md p-8 text-center cursor-pointer",
              "hover:border-primary transition-colors",
              uploading && "opacity-50 cursor-not-allowed",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              disabled={uploading || disabled}
              className={cn("hidden")}
            />
            {uploading ? (
              <p className={cn("text-sm text-muted-foreground")}>
                Enviando imagem...
              </p>
            ) : (
              <>
                <p className={cn("text-sm text-muted-foreground mb-2")}>
                  Clique para fazer upload ou arraste uma imagem aqui
                </p>
                <p className={cn("text-xs text-muted-foreground")}>
                  JPEG, PNG, WebP ou GIF (máx. 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {error && (
        <p className={cn("text-sm text-destructive")}>{error}</p>
      )}

      {/* Input oculto para URL manual (fallback) */}
      {!preview && (
        <div className={cn("space-y-2")}>
          <Label htmlFor="imageUrl">Ou cole a URL da imagem</Label>
          <Input
            id="imageUrl"
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://exemplo.com/imagem.jpg"
            disabled={uploading || disabled}
          />
        </div>
      )}
    </div>
  );
}

