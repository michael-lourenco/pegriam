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
import {
  AdminLoadingState,
  AdminPageHeader,
  AdminShell,
} from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminDangerBtn,
  adminInput,
  adminLabel,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
  adminSelect,
  adminTextarea,
} from '@/presentation/components/admin/adminUi';

export default function EditarTermoPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params.termId as string;
  const { isAdmin, loading: authLoading } = useRequireAdmin();

  const [original, setOriginal] = useState<GlossaryTerm | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [term, setTerm] = useState('');
  const [aliases, setAliases] = useState('');
  const [category, setCategory] = useState<GlossaryCategory>('character');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [relatedTermsInput, setRelatedTermsInput] = useState('');

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
            open: true,
            type: 'error',
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
          open: true,
          type: 'error',
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
        open: true,
        type: 'success',
        title: 'Termo atualizado',
        description: `"${term}" foi salvo com sucesso.`,
      });
    } catch (error: any) {
      setFeedback({
        open: true,
        type: 'error',
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
        open: true,
        type: 'error',
        title: 'Erro ao remover',
        description: error.message,
      });
    }
  }

  if (authLoading) {
    return <AdminLoadingState message="Verificando autenticacao..." />;
  }

  if (!isAdmin) return null;

  if (loadingData) {
    return <AdminLoadingState message="Carregando termo..." />;
  }

  if (!original) {
    return (
      <AdminShell maxWidth="3xl">
        <div className={cn('text-center space-y-4 py-16')}>
          <p className={cn('text-destructive')}>Termo nao encontrado</p>
          <Button
            onClick={() => router.push('/admin/glossario')}
            className={cn(adminPrimaryBtn)}
          >
            Voltar
          </Button>
        </div>
      </AdminShell>
    );
  }

  const categories = Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, string][];

  return (
    <AdminShell maxWidth="3xl">
      <AdminPageHeader
        backHref="/admin/glossario"
        backLabel="Voltar para Glossario"
        title="Editar Termo"
        actions={
          <>
            <Link href={`/glossario/${original.id}`}>
              <Button variant="outline" size="sm" className={cn(adminOutlineBtn)}>
                Ver Publico
              </Button>
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className={cn(adminDangerBtn)}
            >
              Remover
            </Button>
          </>
        }
      />

      <div
        className={cn(
          'mb-6 p-3 rounded-md border border-gold/20 bg-navy'
        )}
      >
        <p className={cn('text-xs', adminMuted)}>
          ID do termo (use para referenciar em &ldquo;Termos Relacionados&rdquo;):
        </p>
        <p className={cn('text-sm font-mono text-[hsl(var(--parchment))] mt-1 select-all')}>
          {original.id}
        </p>
      </div>

      <Card className={cn(adminCard)}>
        <CardHeader>
          <CardTitle className={cn('font-display text-gold')}>
            Informacoes do Termo
          </CardTitle>
          <CardDescription className={cn(adminMuted)}>
            Edite os dados do termo do glossario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className={cn('space-y-6')}>
            <div className={cn('space-y-2')}>
              <Label htmlFor="term" className={cn(adminLabel)}>Nome do Termo *</Label>
              <Input
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                required
                disabled={saving}
                className={cn(adminInput)}
              />
            </div>

            <div className={cn('space-y-2')}>
              <Label htmlFor="aliases" className={cn(adminLabel)}>
                Nomes alternativos (separados por virgula)
              </Label>
              <Input
                id="aliases"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="Ex: O Escolhido, O Bardo"
                disabled={saving}
                className={cn(adminInput)}
              />
            </div>

            <div className={cn('space-y-2')}>
              <Label htmlFor="category" className={cn(adminLabel)}>Categoria *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as GlossaryCategory)}
                className={cn(adminSelect)}
                disabled={saving}
              >
                {categories.map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className={cn('space-y-2')}>
              <Label htmlFor="shortDescription" className={cn(adminLabel)}>
                Descricao Curta *
              </Label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                required
                rows={2}
                className={cn(adminTextarea)}
                disabled={saving}
              />
            </div>

            <div className={cn('space-y-2')}>
              <Label htmlFor="fullDescription" className={cn(adminLabel)}>
                Descricao Completa *
              </Label>
              <textarea
                id="fullDescription"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                required
                rows={10}
                className={cn(adminTextarea)}
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

            <div className={cn('space-y-2')}>
              <Label htmlFor="relatedTerms" className={cn(adminLabel)}>
                IDs de Termos Relacionados (separados por virgula)
              </Label>
              <Input
                id="relatedTerms"
                value={relatedTermsInput}
                onChange={(e) => setRelatedTermsInput(e.target.value)}
                placeholder="glossary-xxx, glossary-yyy"
                disabled={saving}
                className={cn(adminInput)}
              />
            </div>

            <div className={cn('flex gap-4 pt-4')}>
              <Button type="submit" disabled={saving} className={cn(adminPrimaryBtn)}>
                {saving ? 'Salvando...' : 'Salvar Alteracoes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/glossario')}
                disabled={saving}
                className={cn(adminOutlineBtn)}
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
    </AdminShell>
  );
}
