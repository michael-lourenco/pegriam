'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { Container } from '@/shared/container';
import { GlossaryTerm, GlossaryTermId } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog';
import { ImageUpload } from '@/presentation/components/shared/ImageUpload';

export default function EditarTermoPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params.termId as string;
  const { isAdmin, loading: authLoading } = useRequireAdmin();

  const [original, setOriginal] = useState<GlossaryTerm | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form
  const [term, setTerm] = useState('');
  const [aliases, setAliases] = useState('');
  const [category, setCategory] = useState<GlossaryCategory>('character');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [relatedTermsInput, setRelatedTermsInput] = useState('');

  // Modals
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description: string;
  }>({ open: false, type: 'success', title: '', description: '' });

  useEffect(() => {
    if (authLoading || !isAdmin) return;

    async function load() {
      try {
        const { glossaryRepository } = Container.getRepositories();
        const data = await glossaryRepository.findById(termId as GlossaryTermId);
        if (!data) {
          setFeedback({
            open: true, type: 'error',
            title: 'Nao encontrado',
            description: 'O termo nao foi encontrado.',
          });
          return;
        }
        setOriginal(data);
        setTerm(data.term);
        setAliases(data.aliases.join(', '));
        setCategory(data.category);
        setShortDescription(data.shortDescription);
        setFullDescription(data.fullDescription);
        setImageUrl(data.imageUrl || '');
        setRelatedTermsInput(data.relatedTerms.join(', '));
      } catch (error: any) {
        setFeedback({
          open: true, type: 'error',
          title: 'Erro ao carregar',
          description: error.message,
        });
      } finally {
        setLoadingData(false);
      }
    }

    load();
  }, [termId, isAdmin, authLoading]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!original) return;

    setSaving(true);
    try {
      const updated = new GlossaryTerm(
        original.id,
        term.trim(),
        aliases.split(',').map(a => a.trim()).filter(a => a.length > 0),
        category,
        shortDescription.trim(),
        fullDescription.trim(),
        imageUrl.trim() || undefined,
        relatedTermsInput.split(',').map(t => t.trim()).filter(t => t.length > 0),
        original.firstAppearanceStoryId,
        original.firstAppearanceChapterId,
        original.createdAt,
        new Date()
      );

      const { glossaryRepository } = Container.getRepositories();
      await glossaryRepository.save(updated);

      setOriginal(updated);
      setFeedback({
        open: true, type: 'success',
        title: 'Termo atualizado',
        description: `"${term}" foi salvo com sucesso.`,
      });
    } catch (error: any) {
      setFeedback({
        open: true, type: 'error',
        title: 'Erro ao salvar',
        description: error.message || 'Nao foi possivel salvar.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!original) return;
    try {
      const { glossaryRepository } = Container.getRepositories();
      await glossaryRepository.delete(original.id);
      router.push('/admin/glossario');
    } catch (error: any) {
      setFeedback({
        open: true, type: 'error',
        title: 'Erro ao remover',
        description: error.message,
      });
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Verificando autenticacao...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Carregando termo...</p>
        </div>
      </div>
    );
  }

  if (!original) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Termo nao encontrado</p>
          <Button onClick={() => router.push('/admin/glossario')}>Voltar</Button>
        </div>
      </div>
    );
  }

  const categories = Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, string][];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link href="/admin/glossario" className="text-sm text-muted-foreground hover:text-foreground">
              &larr; Voltar para Glossario
            </Link>
            <h1 className="text-4xl font-bold text-foreground mt-2">
              Editar Termo
            </h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/glossario/${original.id}`}>
              <Button variant="outline" size="sm">Ver Publico</Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Remover
            </Button>
          </div>
        </div>

        {/* ID do termo para referencia */}
        <div className="mb-6 p-3 rounded-md bg-muted">
          <p className="text-xs text-muted-foreground">
            ID do termo (use para referenciar em &ldquo;Termos Relacionados&rdquo;):
          </p>
          <p className="text-sm font-mono text-foreground mt-1 select-all">
            {original.id}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informacoes do Termo</CardTitle>
            <CardDescription>
              Edite os dados do termo do glossario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="term">Nome do Termo *</Label>
                <Input
                  id="term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aliases">Nomes alternativos (separados por virgula)</Label>
                <Input
                  id="aliases"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  placeholder="Ex: O Escolhido, O Bardo"
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GlossaryCategory)}
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                  disabled={saving}
                >
                  {categories.map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descricao Curta *</Label>
                <textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  required
                  rows={2}
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Descricao Completa *</Label>
                <textarea
                  id="fullDescription"
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  required
                  rows={10}
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  disabled={saving}
                />
              </div>

              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
                label="Imagem do Termo (opcional)"
                folder="glossary/images"
                disabled={saving}
              />

              <div className="space-y-2">
                <Label htmlFor="relatedTerms">IDs de Termos Relacionados (separados por virgula)</Label>
                <Input
                  id="relatedTerms"
                  value={relatedTermsInput}
                  onChange={(e) => setRelatedTermsInput(e.target.value)}
                  placeholder="glossary-xxx, glossary-yyy"
                  disabled={saving}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Alteracoes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/glossario')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Remover termo"
          description={`Tem certeza que deseja remover "${original.term}" do glossario? Esta acao nao pode ser desfeita.`}
          confirmLabel="Remover"
          variant="destructive"
          onConfirm={handleDelete}
        />

        <FeedbackDialog
          open={feedback.open}
          onOpenChange={(open) => setFeedback(prev => ({ ...prev, open }))}
          type={feedback.type}
          title={feedback.title}
          description={feedback.description}
        />
      </div>
    </div>
  );
}
