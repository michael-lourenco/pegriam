'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { GetStoryUseCase, UpdateStoryUseCase, DeleteStoryUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository } from '@/infrastructure/database/supabase';
import { SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter } from '@/domain/entities/Chapter';
import { adminStoryRoute, chapterRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/presentation/components/shared/ImageUpload';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';

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

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'publishing' | 'completed'>('draft');
  const [freeChapters, setFreeChapters] = useState(0);
  const [pdfPrice, setPdfPrice] = useState(0);
  const [tags, setTags] = useState('');

  // Modal state
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

      // Recarregar dados
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
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <p className={cn("text-muted-foreground")}>Carregando...</p>
      </div>
    );
  }

  if (error && !story) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center")}>
        <div className={cn("text-center space-y-4")}>
          <p className={cn("text-destructive")}>{error}</p>
          <Button onClick={() => router.push('/admin/stories' as any)}>Voltar</Button>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8 max-w-6xl")}>
        <div className={cn("flex items-center justify-between mb-8")}>
          <div>
            <Link href="/admin/stories" className={cn("text-sm text-muted-foreground hover:text-foreground")}>
              ← Voltar para Histórias
            </Link>
            <h1 className={cn("text-4xl font-bold text-foreground mt-2")}>
              Editar História
            </h1>
          </div>
          <div className={cn("flex gap-2")}>
            <Link href={adminStoryRoute(String(story.id)) + '/editor' as any}>
              <Button>Editor de Capítulos</Button>
            </Link>
            <Button variant="destructive" onClick={handleDeleteRequest}>
              Deletar
            </Button>
          </div>
        </div>

        {error && (
          <div className={cn("mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm")}>
            {error}
          </div>
        )}

        <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6")}>
          {/* Formulário de Edição */}
          <div className={cn("lg:col-span-2")}>
            <Card>
              <CardHeader>
                <CardTitle>Informações da História</CardTitle>
                <CardDescription>
                  Edite as informações básicas da história
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className={cn("space-y-6")}>
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={200}
                      disabled={saving}
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
                      disabled={saving}
                    />
                  </div>

                  <div className={cn("space-y-4")}>
                    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6")}>
                      <div className={cn("space-y-2")}>
                        <ImageUpload
                          label="Imagem de Capa"
                          value={coverImage}
                          onChange={setCoverImage}
                          disabled={saving}
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
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className={cn("w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2")}
                        disabled={saving}
                      >
                        <option value="draft">Rascunho</option>
                        <option value="publishing">Publicando</option>
                        <option value="completed">Completa</option>
                      </select>
                    </div>

                    <div className={cn("space-y-2")}>
                      <Label htmlFor="freeChapters">Capítulos Gratuitos</Label>
                      <Input
                        id="freeChapters"
                        type="number"
                        min="0"
                        value={freeChapters}
                        onChange={(e) => setFreeChapters(parseInt(e.target.value) || 0)}
                        disabled={saving}
                      />
                    </div>
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
                      disabled={saving}
                    />
                  </div>

                  <div className={cn("space-y-2")}>
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="fantasia, aventura, magia"
                      disabled={saving}
                    />
                  </div>

                  <div className={cn("flex gap-4")}>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/stories' as any)}
                      disabled={saving}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Capítulos */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Capítulos ({chapters.length})</CardTitle>
                <CardDescription>
                  Gerencie os capítulos desta história
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={adminStoryRoute(String(story.id)) + '/editor' as any}>
                  <Button className={cn("w-full mb-4")}>Novo Capítulo</Button>
                </Link>

                {chapters.length === 0 ? (
                  <p className={cn("text-sm text-muted-foreground text-center py-4")}>
                    Nenhum capítulo ainda
                  </p>
                ) : (
                  <div className={cn("space-y-2")}>
                    {chapters.map((chapter) => (
                      <Link
                        key={chapter.id}
                        href={adminStoryRoute(String(story.id)) + `/editor?chapter=${String(chapter.id)}` as any}
                      >
                        <div className={cn("p-3 rounded-md border border-border hover:bg-accent cursor-pointer")}>
                          <div className={cn("flex items-center justify-between")}>
                            <div>
                              <p className={cn("font-medium text-sm")}>
                                Cap. {chapter.number}: {chapter.title}
                              </p>
                              <p className={cn("text-xs text-muted-foreground")}>
                                {chapter.blocks.length} blocos • {chapter.isFree ? 'Gratuito' : 'Pago'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal de Sucesso */}
        <FeedbackDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          type="success"
          title="Salvo com sucesso"
          description="A história foi atualizada com sucesso."
        />

        {/* Modal de Confirmação para Deletar */}
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Deletar história"
          description="Tem certeza que deseja deletar esta história? Todos os capítulos associados também serão removidos. Esta ação não pode ser desfeita."
          confirmLabel="Deletar"
          variant="destructive"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </div>
  );
}

