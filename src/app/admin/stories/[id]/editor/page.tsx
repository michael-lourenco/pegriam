'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { GetStoryUseCase, CreateChapterUseCase, UpdateChapterUseCase, GetChapterUseCase } from '@/application/use-cases';
import { SupabaseStoryRepository, SupabaseChapterRepository, SupabaseChapterRenderedRepository } from '@/infrastructure/database/supabase';
import { Story, StoryId } from '@/domain/entities/Story';
import { Chapter, ChapterId } from '@/domain/entities/Chapter';
import { ContentBlock, ContentBlockDTO, TextBlock, ImageBlock, QuoteBlock, SeparatorBlock, ContentBlockFactory } from '@/domain/entities/ContentBlock';
import { adminStoryRoute } from '@/shared/utils/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContentBlockRenderer } from '@/presentation/components/reader/ContentBlockRenderer';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/presentation/components/shared/ImageUpload';
import { MarkdownEditor } from '@/presentation/components/editor/MarkdownEditor';

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

  // Form state
  const [chapterNumber, setChapterNumber] = useState(1);
  const [chapterTitle, setChapterTitle] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  // Dialog state
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [blockType, setBlockType] = useState<'text' | 'image' | 'quote' | 'separator'>('text');

  // Block form state
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');

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

        // Se há chapterId, carregar capítulo existente
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
          // Novo capítulo - definir número baseado nos capítulos existentes
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
      const textBlock = block as TextBlock;
      setTextContent(textBlock.content);
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
        alert('O conteúdo do texto é obrigatório');
        return;
      }
      newBlock = new TextBlock(
        editingBlock?.id || `block-${Date.now()}`,
        editingBlock?.order ?? blocks.length,
        textContent,
        'markdown' // Sempre markdown
      );
    } else if (blockType === 'image') {
      if (!imageUrl.trim() || !imageAlt.trim()) {
        alert('URL e texto alternativo são obrigatórios');
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
        alert('O texto da citação é obrigatório');
        return;
      }
      newBlock = new QuoteBlock(
        editingBlock?.id || `block-${Date.now()}`,
        editingBlock?.order ?? blocks.length,
        quoteText,
        quoteAuthor || undefined
      );
    } else {
      // separator
      newBlock = new SeparatorBlock(
        editingBlock?.id || `block-${Date.now()}`,
        editingBlock?.order ?? blocks.length
      );
    }

    if (editingBlock) {
      // Atualizar bloco existente
      const updatedBlocks = blocks.map(b => b.id === editingBlock.id ? newBlock : b);
      setBlocks(updatedBlocks);
    } else {
      // Adicionar novo bloco
      const blockWithOrder = newBlock.updateOrder(blocks.length);
      setBlocks([...blocks, blockWithOrder]);
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
    if (confirm('Tem certeza que deseja remover este bloco?')) {
      const updatedBlocks = blocks
        .filter(b => b.id !== blockId)
        .map((b, index) => b.updateOrder(index));
      setBlocks(updatedBlocks);
    }
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    const reorderedBlocks = newBlocks.map((b, i) => b.updateOrder(i));
    setBlocks(reorderedBlocks);
  };

  const handleSaveChapter = async () => {
    if (!user || !story) return;
    if (!chapterTitle.trim()) {
      alert('O título do capítulo é obrigatório');
      return;
    }
    if (blocks.length === 0) {
      alert('O capítulo deve ter pelo menos um bloco');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const storyRepository = new SupabaseStoryRepository();
      const chapterRepository = new SupabaseChapterRepository();

      const blocksDTO: ContentBlockDTO[] = blocks.map(block => block.toDTO());

      if (chapter) {
        // Atualizar capítulo existente
        const chapterRenderedRepository = new SupabaseChapterRenderedRepository();
        const updateChapter = new UpdateChapterUseCase(chapterRepository, storyRepository, chapterRenderedRepository);
        await updateChapter.execute(user, chapter.id, {
          title: chapterTitle,
          blocks: blocksDTO,
          isFree,
        });
      } else {
        // Criar novo capítulo
        const chapterRenderedRepository = new SupabaseChapterRenderedRepository();
        const createChapter = new CreateChapterUseCase(chapterRepository, storyRepository, chapterRenderedRepository);
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

  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-8 max-w-7xl")}>
        <div className={cn("flex items-center justify-between mb-8")}>
          <div>
            <Link href={adminStoryRoute(String(story.id)) as any} className={cn("text-sm text-muted-foreground hover:text-foreground")}>
              ← Voltar para {story.title}
            </Link>
            <h1 className={cn("text-4xl font-bold text-foreground mt-2")}>
              {chapter ? 'Editar Capítulo' : 'Novo Capítulo'}
            </h1>
          </div>
          <div className={cn("flex gap-2")}>
            <Button onClick={handleSaveChapter} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Capítulo'}
            </Button>
          </div>
        </div>

        {error && (
          <div className={cn("mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm")}>
            {error}
          </div>
        )}

        <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6")}>
          {/* Editor */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informações do Capítulo</CardTitle>
              </CardHeader>
              <CardContent className={cn("space-y-4")}>
                <div className={cn("space-y-2")}>
                  <Label htmlFor="chapterNumber">Número do Capítulo</Label>
                  <Input
                    id="chapterNumber"
                    type="number"
                    min="1"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
                    disabled={!!chapter || saving}
                  />
                </div>

                <div className={cn("space-y-2")}>
                  <Label htmlFor="chapterTitle">Título *</Label>
                  <Input
                    id="chapterTitle"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    required
                    disabled={saving}
                  />
                </div>

                <div className={cn("flex items-center space-x-2")}>
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    disabled={saving}
                    className={cn("rounded border-input")}
                  />
                  <Label htmlFor="isFree">Capítulo Gratuito</Label>
                </div>
              </CardContent>
            </Card>

            <Card className={cn("mt-6")}>
              <CardHeader>
                <div className={cn("flex items-center justify-between")}>
                  <CardTitle>Blocos de Conteúdo ({blocks.length})</CardTitle>
                  <Button onClick={handleAddBlock} size="sm">
                    + Adicionar Bloco
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blocks.length === 0 ? (
                  <p className={cn("text-sm text-muted-foreground text-center py-8")}>
                    Nenhum bloco ainda. Clique em "Adicionar Bloco" para começar.
                  </p>
                ) : (
                  <div className={cn("space-y-4")}>
                    {sortedBlocks.map((block, index) => (
                      <div
                        key={block.id}
                        className={cn("p-4 border border-border rounded-md bg-card")}
                      >
                        <div className={cn("flex items-center justify-between mb-2")}>
                          <div className={cn("flex items-center gap-2")}>
                            <span className={cn("text-xs text-muted-foreground")}>
                              Bloco {index + 1} - {block.type}
                            </span>
                          </div>
                          <div className={cn("flex gap-1")}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveBlock(block.id, 'up')}
                              disabled={index === 0}
                            >
                              ↑
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveBlock(block.id, 'down')}
                              disabled={index === blocks.length - 1}
                            >
                              ↓
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditBlock(block)}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveBlock(block.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                        <div className={cn("mt-2")}>
                          <ContentBlockRenderer block={block} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card className={cn("sticky top-4")}>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Visualização do capítulo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <article className={cn("prose prose-lg max-w-none dark:prose-invert")}>
                  <h1>{chapterTitle || 'Título do Capítulo'}</h1>
                  {sortedBlocks.length === 0 ? (
                    <p className={cn("text-muted-foreground")}>
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

        {/* Dialog para Adicionar/Editar Bloco */}
        <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
          <DialogContent className={cn("max-w-2xl max-h-[90vh] flex flex-col")}>
            <DialogHeader className={cn("flex-shrink-0")}>
              <DialogTitle>
                {editingBlock ? 'Editar Bloco' : 'Adicionar Bloco'}
              </DialogTitle>
              <DialogDescription>
                Escolha o tipo de bloco e preencha as informações
              </DialogDescription>
            </DialogHeader>

            {/* Conteúdo scrollável */}
            <div className={cn("flex-1 overflow-y-auto space-y-4 pr-2")}>
              {!editingBlock && (
                <div className={cn("space-y-2")}>
                  <Label>Tipo de Bloco</Label>
                  <select
                    value={blockType}
                    onChange={(e) => setBlockType(e.target.value as any)}
                    className={cn("w-full rounded-md border border-input bg-background px-3 py-2 text-sm")}
                  >
                    <option value="text">Texto</option>
                    <option value="image">Imagem</option>
                    <option value="quote">Citação</option>
                    <option value="separator">Separador</option>
                  </select>
                </div>
              )}

              {blockType === 'text' && (
                <div className={cn("space-y-2")}>
                  <Label htmlFor="textContent">Conteúdo do Texto (Markdown) *</Label>
                  <MarkdownEditor
                    value={textContent}
                    onChange={setTextContent}
                    placeholder="Digite seu texto em Markdown... Use # para títulos, ** para negrito, * para itálico, etc."
                    disabled={saving}
                    className={cn("max-h-[60vh]")}
                  />
                </div>
              )}

              {blockType === 'image' && (
                <div className={cn("space-y-4")}>
                  <ImageUpload
                    label="Imagem *"
                    value={imageUrl}
                    onChange={setImageUrl}
                    disabled={saving}
                    folder="stories/images"
                  />
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="imageAlt">Texto Alternativo *</Label>
                    <Input
                      id="imageAlt"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="Descrição da imagem"
                      disabled={saving}
                    />
                    <p className={cn("text-xs text-muted-foreground")}>
                      Texto descritivo da imagem para acessibilidade
                    </p>
                  </div>
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="imageCaption">Legenda (opcional)</Label>
                    <Input
                      id="imageCaption"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Legenda da imagem"
                      disabled={saving}
                    />
                    <p className={cn("text-xs text-muted-foreground")}>
                      Texto que aparecerá abaixo da imagem
                    </p>
                  </div>
                </div>
              )}

              {blockType === 'quote' && (
                <div className={cn("space-y-4")}>
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="quoteText">Citação *</Label>
                    <Textarea
                      id="quoteText"
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      rows={4}
                      placeholder="Texto da citação..."
                    />
                  </div>
                  <div className={cn("space-y-2")}>
                    <Label htmlFor="quoteAuthor">Autor (opcional)</Label>
                    <Input
                      id="quoteAuthor"
                      value={quoteAuthor}
                      onChange={(e) => setQuoteAuthor(e.target.value)}
                      placeholder="Nome do autor"
                    />
                  </div>
                </div>
              )}

              {blockType === 'separator' && (
                <p className={cn("text-sm text-muted-foreground")}>
                  Um separador visual será adicionado ao capítulo.
                </p>
              )}
            </div>

            {/* Botões fixos na parte inferior */}
            <div className={cn("flex justify-end gap-2 pt-4 border-t flex-shrink-0")}>
              <Button
                variant="outline"
                onClick={() => {
                  setBlockDialogOpen(false);
                  resetBlockForm();
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveBlock}>
                {editingBlock ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

