'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { CreateStoryUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { adminStoryRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/presentation/components/shared/ImageUpload';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';

export default function NewStoryPage() {
  const { isAdmin, user } = useRequireAdmin();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('Pegriam');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'publishing' | 'completed'>('draft');
  const [freeChapters, setFreeChapters] = useState(2);
  const [pdfPrice, setPdfPrice] = useState(0);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin || !user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const storyRepository = new SupabaseStoryRepository();
      const createStory = new CreateStoryUseCase(storyRepository);

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const story = await createStory.execute(user, {
        title,
        description,
        author,
        coverImage: coverImage || undefined,
        status,
        freeChapters,
        pdfPrice,
        tags: tagsArray,
      });

      router.push(adminStoryRoute(String(story.id)) as any);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar história');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8 max-w-4xl")}>
        <div className={cn("mb-8")}>
          <h1 className={cn("text-4xl font-bold text-foreground mb-2")}>
            Nova História
          </h1>
          <p className={cn("text-muted-foreground")}>
            Crie uma nova história para o sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da História</CardTitle>
            <CardDescription>
              Preencha os dados básicos da história
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className={cn("space-y-6")}>
              {error && (
                <div className={cn("p-3 rounded-md bg-destructive/10 text-destructive text-sm")}>
                  {error}
                </div>
              )}

              <div className={cn("space-y-2")}>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={200}
                  disabled={loading}
                />
              </div>

              <div className={cn("space-y-2")}>
                <Label htmlFor="description">Descrição *</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  maxLength={1000}
                  rows={4}
                  className={cn("w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50")}
                  disabled={loading}
                />
              </div>

              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4")}>
                <div className={cn("space-y-2")}>
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className={cn("space-y-2")}>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className={cn("w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2")}
                    disabled={loading}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="publishing">Publicando</option>
                    <option value="completed">Completa</option>
                  </select>
                </div>
              </div>

              <div className={cn("space-y-4")}>
                <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6")}>
                  <div className={cn("space-y-2")}>
                    <ImageUpload
                      label="Imagem de Capa"
                      value={coverImage}
                      onChange={setCoverImage}
                      disabled={loading}
                      folder="stories/covers"
                    />
                    <p className={cn("text-xs text-muted-foreground")}>
                      Proporção recomendada: 16:9 (1920×1080)
                    </p>
                  </div>
                  <div className={cn("space-y-2")}>
                    <Label>Preview da Capa</Label>
                    <FeaturedCover
                      src={coverImage || undefined}
                      alt={title || 'Preview'}
                      className={cn("rounded-lg shadow-md")}
                    />
                  </div>
                </div>
              </div>

              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4")}>
                <div className={cn("space-y-2")}>
                  <Label htmlFor="freeChapters">Capítulos Gratuitos</Label>
                  <Input
                    id="freeChapters"
                    type="number"
                    min="0"
                    value={freeChapters}
                    onChange={(e) => setFreeChapters(parseInt(e.target.value) || 0)}
                    disabled={loading}
                  />
                </div>

                <div className={cn("space-y-2")}>
                  <Label htmlFor="pdfPrice">Preço do PDF (R$)</Label>
                  <Input
                    id="pdfPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={pdfPrice}
                    onChange={(e) => setPdfPrice(parseFloat(e.target.value) || 0)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={cn("space-y-2")}>
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="fantasia, aventura, magia"
                  disabled={loading}
                />
                <p className={cn("text-xs text-muted-foreground")}>
                  Máximo de 10 tags
                </p>
              </div>

              <div className={cn("flex gap-4")}>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Criando...' : 'Criar História'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/stories')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

