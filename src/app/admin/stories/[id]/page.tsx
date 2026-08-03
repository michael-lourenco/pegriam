'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { GetStoryUseCase, UpdateStoryUseCase, DeleteStoryUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter } from '@/domain/entities/Chapter';
import { adminStoryRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/presentation/components/shared/ImageUpload';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';
import {
  AdminLoadingState,
  AdminPageHeader,
  AdminShell,
} from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminDangerBtn,
  adminErrorBanner,
  adminInput,
  adminLabel,
  adminListItem,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
  adminSelect,
  adminTextarea,
} from '@/presentation/components/admin/adminUi';

export default function EditStoryPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, user } = useRequireAdmin();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'publishing' | 'completed'>('draft');
  const [freeChapters, setFreeChapters] = useState(0);
  const [pdfPrice, setPdfPrice] = useState(0);
  const [tags, setTags] = useState('');

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isAdmin || !user) return;

    async function loadStory() {
      try {
        setLoading(true);
        const storyRepository = new SupabaseStoryRepository();
        const chapterRepository = new SupabaseChapterRepository();

        const getStory = new GetStoryUseCase(storyRepository);
        const storyData = await getStory.execute(storyId as StoryId);

        if (!storyData) {
          setError('História não encontrada');
          return;
        }

        setStory(storyData);
        setTitle(storyData.title);
        setDescription(storyData.description);
        setCoverImage(storyData.coverImage || '');
        setStatus(storyData.status);
        setFreeChapters(storyData.freeChapters);
        setPdfPrice(storyData.pdfPrice);
        setTags(storyData.tags.join(', '));

        const chaptersList = await chapterRepository.findByStoryId(storyId as StoryId);
        setChapters(chaptersList);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar história');
      } finally {
        setLoading(false);
      }
    }

    loadStory();
  }, [storyId, isAdmin, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !story) return;

    setSaving(true);
    setError(null);

    try {
      const storyRepository = new SupabaseStoryRepository();
      const updateStory = new UpdateStoryUseCase(storyRepository);

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await updateStory.execute(user, story.id, {
        title,
        description,
        coverImage: coverImage || undefined,
        status,
        freeChapters,
        pdfPrice,
        tags: tagsArray,
      });

      const getStory = new GetStoryUseCase(storyRepository);
      const updatedStory = await getStory.execute(story.id);
      if (updatedStory) {
        setStory(updatedStory);
      }

      setShowSuccessDialog(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar história');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user || !story) return;

    try {
      const storyRepository = new SupabaseStoryRepository();
      const deleteStory = new DeleteStoryUseCase(storyRepository);

      await deleteStory.execute(user, story.id);
      router.push('/admin/stories' as any);
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar história');
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return <AdminLoadingState message="Carregando..." />;
  }

  if (error && !story) {
    return (
      <AdminShell maxWidth="6xl">
        <div className={cn('text-center space-y-4 py-16')}>
          <p className={cn('text-destructive')}>{error}</p>
          <Button
            onClick={() => router.push('/admin/stories' as any)}
            className={cn(adminPrimaryBtn)}
          >
            Voltar
          </Button>
        </div>
      </AdminShell>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <AdminShell maxWidth="6xl">
      <AdminPageHeader
        backHref="/admin/stories"
        backLabel="Voltar para Histórias"
        title="Editar História"
        actions={
          <>
            <Link href={adminStoryRoute(String(story.id)) + '/editor' as any}>
              <Button className={cn(adminPrimaryBtn)}>Editor de Capítulos</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleDeleteRequest}
              className={cn(adminDangerBtn)}
            >
              Deletar
            </Button>
          </>
        }
      />

      {error && <div className={cn(adminErrorBanner)}>{error}</div>}

      <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6')}>
        <div className={cn('lg:col-span-2')}>
          <Card className={cn(adminCard)}>
            <CardHeader>
              <CardTitle className={cn('font-display text-gold')}>
                Informações da História
              </CardTitle>
              <CardDescription className={cn(adminMuted)}>
                Edite as informações básicas da história
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className={cn('space-y-6')}>
                <div className={cn('space-y-2')}>
                  <Label htmlFor="title" className={cn(adminLabel)}>Título *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={200}
                    disabled={saving}
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
                    disabled={saving}
                  />
                </div>

                <div className={cn('space-y-4')}>
                  <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-6')}>
                    <div className={cn('space-y-2')}>
                      <ImageUpload
                        label="Imagem de Capa"
                        value={coverImage}
                        onChange={setCoverImage}
                        disabled={saving}
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
                    <Label htmlFor="status" className={cn(adminLabel)}>Status</Label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className={cn(adminSelect)}
                      disabled={saving}
                    >
                      <option value="draft">Rascunho</option>
                      <option value="publishing">Publicando</option>
                      <option value="completed">Completa</option>
                    </select>
                  </div>

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
                      disabled={saving}
                      className={cn(adminInput)}
                    />
                  </div>
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
                    disabled={saving}
                    className={cn(adminInput)}
                  />
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
                    disabled={saving}
                    className={cn(adminInput)}
                  />
                </div>

                <div className={cn('flex gap-4')}>
                  <Button type="submit" disabled={saving} className={cn(adminPrimaryBtn)}>
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/stories' as any)}
                    disabled={saving}
                    className={cn(adminOutlineBtn)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={cn(adminCard)}>
            <CardHeader>
              <CardTitle className={cn('font-display text-gold')}>
                Capítulos ({chapters.length})
              </CardTitle>
              <CardDescription className={cn(adminMuted)}>
                Gerencie os capítulos desta história
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={adminStoryRoute(String(story.id)) + '/editor' as any}>
                <Button className={cn(adminPrimaryBtn, 'w-full mb-4')}>
                  Novo Capítulo
                </Button>
              </Link>

              {chapters.length === 0 ? (
                <p className={cn('text-sm text-center py-4', adminMuted)}>
                  Nenhum capítulo ainda
                </p>
              ) : (
                <div className={cn('space-y-2')}>
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={
                        adminStoryRoute(String(story.id)) +
                        `/editor?chapter=${String(chapter.id)}` as any
                      }
                    >
                      <div className={cn(adminListItem, 'p-3 cursor-pointer')}>
                        <p className={cn('font-medium text-sm text-[hsl(var(--parchment))]')}>
                          Cap. {chapter.number}: {chapter.title}
                        </p>
                        <p className={cn('text-xs', adminMuted)}>
                          {chapter.blocks.length} blocos •{' '}
                          {chapter.isFree ? 'Gratuito' : 'Pago'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <FeedbackDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        type="success"
        title="Salvo com sucesso"
        description="A história foi atualizada com sucesso."
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Deletar história"
        description="Tem certeza que deseja deletar esta história? Todos os capítulos associados também serão removidos. Esta ação não pode ser desfeita."
        confirmLabel="Deletar"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </AdminShell>
  );
}
