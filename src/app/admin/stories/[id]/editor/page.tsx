'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import {
  GetStoryUseCase,
  CreateChapterUseCase,
  UpdateChapterUseCase,
  GetChapterUseCase,
} from '@/application/use-cases';
import {
  SupabaseStoryRepository,
  SupabaseChapterRepository,
  SupabaseChapterRenderedRepository,
} from '@/infrastructure/database/supabase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import {
  ContentBlock,
  ContentBlockDTO,
  TextBlock,
  ImageBlock,
  QuoteBlock,
  SeparatorBlock,
} from '@/domain/entities/ContentBlock';
import { adminStoryRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentBlockRenderer } from '@/presentation/components/reader/ContentBlockRenderer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/presentation/components/shared/ImageUpload';
import { MarkdownEditor } from '@/presentation/components/editor/MarkdownEditor';
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';
import {
  AdminLoadingState,
  AdminPageHeader,
  AdminShell,
} from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminErrorBanner,
  adminGhostBtn,
  adminInput,
  adminLabel,
  adminListItem,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
  adminReaderPreview,
  adminSelect,
  adminTextarea,
} from '@/presentation/components/admin/adminUi';

export default function ChapterEditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAdmin, user } = useRequireAdmin();
  const storyId = params.id as string;
  const chapterIdParam = searchParams.get('chapter');

  const [story, setStory] = useState<Story | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [blockType, setBlockType] = useState<'text' | 'image' | 'quote' | 'separator'>('text');

  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');

  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    description: string;
  }>({ open: false, type: 'warning', title: '', description: '' });
  const [confirmRemoveBlock, setConfirmRemoveBlock] = useState<{
    open: boolean;
    blockId: string | null;
  }>({ open: false, blockId: null });

  useEffect(() => {
    if (!isAdmin || !user) return;

    async function loadData() {
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

        if (chapterIdParam) {
          const getChapter = new GetChapterUseCase(chapterRepository, storyRepository);
          const chapterData = await getChapter.execute(user, chapterIdParam as ChapterId);
          if (chapterData) {
            setChapter(chapterData);
            setChapterNumber(chapterData.number);
            setChapterTitle(chapterData.title);
            setIsFree(chapterData.isFree);
            setBlocks([...chapterData.blocks].sort((a, b) => a.order - b.order));
          }
        } else {
          const existingChapters = await chapterRepository.findByStoryId(storyId as StoryId);
          setChapterNumber(existingChapters.length + 1);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [storyId, chapterIdParam, isAdmin, user]);

  const handleAddBlock = () => {
    setEditingBlock(null);
    setBlockType('text');
    setTextContent('');
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setQuoteText('');
    setQuoteAuthor('');
    setBlockDialogOpen(true);
  };

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block);
    setBlockType(block.type);

    if (block.type === 'text') {
      setTextContent((block as TextBlock).content);
    } else if (block.type === 'image') {
      const imageBlock = block as ImageBlock;
      setImageUrl(imageBlock.url);
      setImageAlt(imageBlock.alt);
      setImageCaption(imageBlock.caption || '');
    } else if (block.type === 'quote') {
      const quoteBlock = block as QuoteBlock;
      setQuoteText(quoteBlock.quote);
      setQuoteAuthor(quoteBlock.author || '');
    }

    setBlockDialogOpen(true);
  };

  const handleSaveBlock = () => {
    let newBlock: ContentBlock;

    if (blockType === 'text') {
      if (!textContent.trim()) {
        setFeedbackDialog({
          open: true,
          type: 'warning',
          title: 'Campo obrigatório',
          description: 'O conteúdo do texto é obrigatório.',
        });
        return;
      }
      newBlock = new TextBlock(
        editingBlock?.id || `block-${Date.now()}`,
        editingBlock?.order ?? blocks.length,
        textContent,
        'markdown'
      );
    } else if (blockType === 'image') {
      if (!imageUrl.trim() || !imageAlt.trim()) {
        setFeedbackDialog({
          open: true,
          type: 'warning',
          title: 'Campos obrigatórios',
          description: 'URL e texto alternativo são obrigatórios.',
        });
        return;
      }
      newBlock = new ImageBlock(
        editingBlock?.id || `block-${Date.now()}`,
        editingBlock?.order ?? blocks.length,
        imageUrl,
        imageAlt,
        imageCaption || undefined
      );
    } else if (blockType === 'quote') {
      if (!quoteText.trim()) {
        setFeedbackDialog({
          open: true,
          type: 'warning',
          title: 'Campo obrigatório',
          description: 'O texto da citação é obrigatório.',
        });
        return;
      }
      newBlock = new QuoteBlock(
        editingBlock?.id || `block-${Date.now()}`,
        editingBlock?.order ?? blocks.length,
        quoteText,
        quoteAuthor || undefined
      );
    } else {
      newBlock = new SeparatorBlock(
        editingBlock?.id || `block-${Date.now()}`,
        editingBlock?.order ?? blocks.length
      );
    }

    if (editingBlock) {
      setBlocks(blocks.map(b => (b.id === editingBlock.id ? newBlock : b)));
    } else {
      setBlocks([...blocks, newBlock.updateOrder(blocks.length)]);
    }

    setBlockDialogOpen(false);
    resetBlockForm();
  };

  const resetBlockForm = () => {
    setEditingBlock(null);
    setTextContent('');
    setImageUrl('');
    setImageAlt('');
    setImageCaption('');
    setQuoteText('');
    setQuoteAuthor('');
  };

  const handleRemoveBlock = (blockId: string) => {
    setConfirmRemoveBlock({ open: true, blockId });
  };

  const executeRemoveBlock = () => {
    if (!confirmRemoveBlock.blockId) return;
    setBlocks(
      blocks
        .filter(b => b.id !== confirmRemoveBlock.blockId)
        .map((b, index) => b.updateOrder(index))
    );
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks.map((b, i) => b.updateOrder(i)));
  };

  const handleSaveChapter = async () => {
    if (!user || !story) return;
    if (!chapterTitle.trim()) {
      setFeedbackDialog({
        open: true,
        type: 'warning',
        title: 'Campo obrigatório',
        description: 'O título do capítulo é obrigatório.',
      });
      return;
    }
    if (blocks.length === 0) {
      setFeedbackDialog({
        open: true,
        type: 'warning',
        title: 'Conteúdo necessário',
        description: 'O capítulo deve ter pelo menos um bloco de conteúdo.',
      });
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const storyRepository = new SupabaseStoryRepository();
      const chapterRepository = new SupabaseChapterRepository();
      const blocksDTO: ContentBlockDTO[] = blocks.map(block => block.toDTO());

      if (chapter) {
        const chapterRenderedRepository = new SupabaseChapterRenderedRepository();
        const updateChapter = new UpdateChapterUseCase(
          chapterRepository,
          storyRepository,
          chapterRenderedRepository
        );
        await updateChapter.execute(user, chapter.id, {
          title: chapterTitle,
          blocks: blocksDTO,
          isFree,
        });
      } else {
        const chapterRenderedRepository = new SupabaseChapterRenderedRepository();
        const createChapter = new CreateChapterUseCase(
          chapterRepository,
          storyRepository,
          chapterRenderedRepository
        );
        await createChapter.execute(user, {
          storyId: story.id,
          number: chapterNumber,
          title: chapterTitle,
          blocks: blocksDTO,
          isFree,
        });
      }

      router.push(adminStoryRoute(String(story.id)) as any);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar capítulo');
    } finally {
      setSaving(false);
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
      <AdminShell maxWidth="7xl">
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

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <AdminShell maxWidth="7xl">
      <AdminPageHeader
        backHref={adminStoryRoute(String(story.id))}
        backLabel={`Voltar para ${story.title}`}
        title={chapter ? 'Editar Capítulo' : 'Novo Capítulo'}
        actions={
          <Button
            onClick={handleSaveChapter}
            disabled={saving}
            className={cn(adminPrimaryBtn)}
          >
            {saving ? 'Salvando...' : 'Salvar Capítulo'}
          </Button>
        }
      />

      {error && <div className={cn(adminErrorBanner)}>{error}</div>}

      <div className={cn('grid grid-cols-1 lg:grid-cols-2 gap-6')}>
        <div>
          <Card className={cn(adminCard)}>
            <CardHeader>
              <CardTitle className={cn('font-display text-gold')}>
                Informações do Capítulo
              </CardTitle>
            </CardHeader>
            <CardContent className={cn('space-y-4')}>
              <div className={cn('space-y-2')}>
                <Label htmlFor="chapterNumber" className={cn(adminLabel)}>
                  Número do Capítulo
                </Label>
                <Input
                  id="chapterNumber"
                  type="number"
                  min="1"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
                  disabled={!!chapter || saving}
                  className={cn(adminInput)}
                />
              </div>

              <div className={cn('space-y-2')}>
                <Label htmlFor="chapterTitle" className={cn(adminLabel)}>Título *</Label>
                <Input
                  id="chapterTitle"
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  required
                  disabled={saving}
                  className={cn(adminInput)}
                />
              </div>

              <div className={cn('flex items-center space-x-2')}>
                <input
                  type="checkbox"
                  id="isFree"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  disabled={saving}
                  className={cn('rounded border-gold/25')}
                />
                <Label htmlFor="isFree" className={cn(adminLabel)}>
                  Capítulo Gratuito
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(adminCard, 'mt-6')}>
            <CardHeader>
              <div className={cn('flex items-center justify-between')}>
                <CardTitle className={cn('font-display text-gold')}>
                  Blocos de Conteúdo ({blocks.length})
                </CardTitle>
                <Button onClick={handleAddBlock} size="sm" className={cn(adminPrimaryBtn)}>
                  + Adicionar Bloco
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blocks.length === 0 ? (
                <p className={cn('text-sm text-center py-8', adminMuted)}>
                  Nenhum bloco ainda. Clique em &quot;Adicionar Bloco&quot; para começar.
                </p>
              ) : (
                <div className={cn('space-y-4')}>
                  {sortedBlocks.map((block, index) => (
                    <div key={block.id} className={cn(adminListItem)}>
                      <div className={cn('flex items-center justify-between mb-2')}>
                        <span className={cn('text-xs', adminMuted)}>
                          Bloco {index + 1} - {block.type}
                        </span>
                        <div className={cn('flex gap-1')}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveBlock(block.id, 'up')}
                            disabled={index === 0}
                            className={cn(adminGhostBtn)}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveBlock(block.id, 'down')}
                            disabled={index === blocks.length - 1}
                            className={cn(adminGhostBtn)}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditBlock(block)}
                            className={cn(adminGhostBtn)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBlock(block.id)}
                            className={cn(adminGhostBtn)}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                      <div className={cn('mt-2', adminReaderPreview, 'p-4')}>
                        <ContentBlockRenderer block={block} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className={cn(adminCard, 'sticky top-4')}>
            <CardHeader>
              <CardTitle className={cn('font-display text-gold')}>Preview</CardTitle>
              <CardDescription className={cn(adminMuted)}>
                Visualização do capítulo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <article className={cn(adminReaderPreview, 'p-6 md:p-8')}>
                <h1
                  className={cn(
                    'font-display text-3xl font-bold text-center mb-6',
                    'text-[hsl(215_55%_10%)]'
                  )}
                >
                  {chapterTitle || 'Título do Capítulo'}
                </h1>
                {sortedBlocks.length === 0 ? (
                  <p className={cn('text-center text-[hsl(215_30%_40%)]')}>
                    Adicione blocos para ver o preview
                  </p>
                ) : (
                  sortedBlocks.map((block) => (
                    <ContentBlockRenderer key={block.id} block={block} />
                  ))
                )}
              </article>
            </CardContent>
          </Card>
        </div>
      </div>

      <FeedbackDialog
        open={feedbackDialog.open}
        onOpenChange={(open) => setFeedbackDialog((prev) => ({ ...prev, open }))}
        type={feedbackDialog.type}
        title={feedbackDialog.title}
        description={feedbackDialog.description}
      />

      <ConfirmDialog
        open={confirmRemoveBlock.open}
        onOpenChange={(open) => setConfirmRemoveBlock((prev) => ({ ...prev, open }))}
        title="Remover bloco"
        description="Tem certeza que deseja remover este bloco? Esta ação não pode ser desfeita."
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={executeRemoveBlock}
      />

      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent
          className={cn(
            'max-w-[98vw] w-[98vw] h-[96vh] max-h-[96vh]',
            'flex flex-col gap-3 p-4 sm:rounded-lg',
            'border-gold/30 bg-[hsl(var(--navy-deep))] text-[hsl(var(--parchment))]'
          )}
        >
          <DialogHeader className={cn('flex-shrink-0 space-y-1')}>
            <DialogTitle className={cn('font-display text-gold')}>
              {editingBlock ? 'Editar Bloco' : 'Adicionar Bloco'}
            </DialogTitle>
            <DialogDescription className={cn(adminMuted)}>
              Escolha o tipo de bloco e preencha as informações
            </DialogDescription>
          </DialogHeader>

          <div
            className={cn(
              'flex-1 min-h-0 flex flex-col gap-3',
              blockType === 'text' ? 'overflow-hidden' : 'overflow-y-auto pr-2'
            )}
          >
            {!editingBlock && (
              <div className={cn('space-y-2 flex-shrink-0')}>
                <Label className={cn(adminLabel)}>Tipo de Bloco</Label>
                <select
                  value={blockType}
                  onChange={(e) => setBlockType(e.target.value as any)}
                  className={cn(adminSelect)}
                >
                  <option value="text">Texto</option>
                  <option value="image">Imagem</option>
                  <option value="quote">Citação</option>
                  <option value="separator">Separador</option>
                </select>
              </div>
            )}

            {blockType === 'text' && (
              <div className={cn('flex-1 min-h-0 flex flex-col gap-2')}>
                <Label htmlFor="textContent" className={cn(adminLabel, 'flex-shrink-0')}>
                  Conteúdo do Texto (Markdown) *
                </Label>
                <MarkdownEditor
                  value={textContent}
                  onChange={setTextContent}
                  placeholder="Digite seu texto em Markdown... Use # para títulos, ** para negrito, * para itálico, etc."
                  disabled={saving}
                  fillHeight
                  className={cn('flex-1 min-h-0')}
                />
              </div>
            )}

            {blockType === 'image' && (
              <div className={cn('space-y-4')}>
                <ImageUpload
                  label="Imagem *"
                  value={imageUrl}
                  onChange={setImageUrl}
                  disabled={saving}
                  folder="stories/images"
                />
                <div className={cn('space-y-2')}>
                  <Label htmlFor="imageAlt" className={cn(adminLabel)}>
                    Texto Alternativo *
                  </Label>
                  <Input
                    id="imageAlt"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    placeholder="Descrição da imagem"
                    disabled={saving}
                    className={cn(adminInput)}
                  />
                  <p className={cn('text-xs', adminMuted)}>
                    Texto descritivo da imagem para acessibilidade
                  </p>
                </div>
                <div className={cn('space-y-2')}>
                  <Label htmlFor="imageCaption" className={cn(adminLabel)}>
                    Legenda (opcional)
                  </Label>
                  <Input
                    id="imageCaption"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Legenda da imagem"
                    disabled={saving}
                    className={cn(adminInput)}
                  />
                  <p className={cn('text-xs', adminMuted)}>
                    Texto que aparecerá abaixo da imagem
                  </p>
                </div>
              </div>
            )}

            {blockType === 'quote' && (
              <div className={cn('space-y-4')}>
                <div className={cn('space-y-2')}>
                  <Label htmlFor="quoteText" className={cn(adminLabel)}>Citação *</Label>
                  <Textarea
                    id="quoteText"
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    rows={4}
                    placeholder="Texto da citação..."
                    className={cn(adminTextarea)}
                  />
                </div>
                <div className={cn('space-y-2')}>
                  <Label htmlFor="quoteAuthor" className={cn(adminLabel)}>
                    Autor (opcional)
                  </Label>
                  <Input
                    id="quoteAuthor"
                    value={quoteAuthor}
                    onChange={(e) => setQuoteAuthor(e.target.value)}
                    placeholder="Nome do autor"
                    className={cn(adminInput)}
                  />
                </div>
              </div>
            )}

            {blockType === 'separator' && (
              <p className={cn('text-sm', adminMuted)}>
                Um separador visual será adicionado ao capítulo.
              </p>
            )}
          </div>

          <div
            className={cn(
              'flex justify-end gap-2 pt-3 border-t border-gold/20 flex-shrink-0'
            )}
          >
            <Button
              variant="outline"
              onClick={() => {
                setBlockDialogOpen(false);
                resetBlockForm();
              }}
              className={cn(adminOutlineBtn)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveBlock} className={cn(adminPrimaryBtn)}>
              {editingBlock ? 'Atualizar' : 'Adicionar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
