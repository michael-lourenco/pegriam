'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
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
import { AdminPageHeader, AdminShell } from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminErrorBanner,
  adminInput,
  adminLabel,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
  adminSelect,
  adminTextarea,
} from '@/presentation/components/admin/adminUi';

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
    <AdminShell maxWidth="4xl">
      <AdminPageHeader
        backHref="/admin/stories"
        backLabel="Voltar para Histórias"
        title="Nova História"
        description="Crie uma nova história para o sistema"
      />

      <Card className={cn(adminCard)}>
        <CardHeader>
          <CardTitle className={cn('font-display text-gold')}>
            Informações da História
          </CardTitle>
          <CardDescription className={cn(adminMuted)}>
            Preencha os dados básicos da história
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={cn('space-y-6')}>
            {error && (
              <div className={cn(adminErrorBanner)}>{error}</div>
            )}

            <div className={cn('space-y-2')}>
              <Label htmlFor="title" className={cn(adminLabel)}>Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
                disabled={loading}
                className={cn(adminInput)}
              />
            </div>

            <div className={cn('space-y-2')}>
              <Label htmlFor="description" className={cn(adminLabel)}>Descrição *</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={1000}
                rows={4}
                className={cn(adminTextarea)}
                disabled={loading}
              />
            </div>

            <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4')}>
              <div className={cn('space-y-2')}>
                <Label htmlFor="author" className={cn(adminLabel)}>Autor *</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                  disabled={loading}
                  className={cn(adminInput)}
                />
              </div>

              <div className={cn('space-y-2')}>
                <Label htmlFor="status" className={cn(adminLabel)}>Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className={cn(adminSelect)}
                  disabled={loading}
                >
                  <option value="draft">Rascunho</option>
                  <option value="publishing">Publicando</option>
                  <option value="completed">Completa</option>
                </select>
              </div>
            </div>

            <div className={cn('space-y-4')}>
              <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6')}>
                <div className={cn('space-y-2')}>
                  <ImageUpload
                    label="Imagem de Capa"
                    value={coverImage}
                    onChange={setCoverImage}
                    disabled={loading}
                    folder="stories/covers"
                  />
                  <p className={cn('text-xs', adminMuted)}>
                    Proporção recomendada: 16:9 (1920×1080)
                  </p>
                </div>
                <div className={cn('space-y-2')}>
                  <Label className={cn(adminLabel)}>Preview da Capa</Label>
                  <FeaturedCover
                    src={coverImage || undefined}
                    alt={title || 'Preview'}
                    className={cn('rounded-lg shadow-md')}
                  />
                </div>
              </div>
            </div>

            <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4')}>
              <div className={cn('space-y-2')}>
                <Label htmlFor="freeChapters" className={cn(adminLabel)}>
                  Capítulos Gratuitos
                </Label>
                <Input
                  id="freeChapters"
                  type="number"
                  min="0"
                  value={freeChapters}
                  onChange={(e) => setFreeChapters(parseInt(e.target.value) || 0)}
                  disabled={loading}
                  className={cn(adminInput)}
                />
              </div>

              <div className={cn('space-y-2')}>
                <Label htmlFor="pdfPrice" className={cn(adminLabel)}>
                  Preço do PDF (R$)
                </Label>
                <Input
                  id="pdfPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pdfPrice}
                  onChange={(e) => setPdfPrice(parseFloat(e.target.value) || 0)}
                  disabled={loading}
                  className={cn(adminInput)}
                />
              </div>
            </div>

            <div className={cn('space-y-2')}>
              <Label htmlFor="tags" className={cn(adminLabel)}>
                Tags (separadas por vírgula)
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="fantasia, aventura, magia"
                disabled={loading}
                className={cn(adminInput)}
              />
              <p className={cn('text-xs', adminMuted)}>Máximo de 10 tags</p>
            </div>

            <div className={cn('flex gap-4')}>
              <Button type="submit" disabled={loading} className={cn(adminPrimaryBtn)}>
                {loading ? 'Criando...' : 'Criar História'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/stories')}
                disabled={loading}
                className={cn(adminOutlineBtn)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
