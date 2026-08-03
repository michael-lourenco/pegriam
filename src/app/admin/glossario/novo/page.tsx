'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { Container } from '@/shared/container';
import { GlossaryTerm, CreateGlossaryTermDTO } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';
import { ImageUpload } from '@/presentation/components/shared/ImageUpload';
import {
  AdminLoadingState,
  AdminPageHeader,
  AdminShell,
} from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminInput,
  adminLabel,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
  adminSelect,
  adminTextarea,
} from '@/presentation/components/admin/adminUi';

export default function NovoTermoPage() {
  const router = useRouter();
  const { isAdmin, loading: authLoading } = useRequireAdmin();

  const [term, setTerm] = useState('');
  const [aliases, setAliases] = useState('');
  const [category, setCategory] = useState<GlossaryCategory>('character');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [relatedTermsInput, setRelatedTermsInput] = useState('');
  const [saving, setSaving] = useState(false);

  const [feedback, setFeedback] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description: string;
  }>({ open: false, type: 'success', title: '', description: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const dto: CreateGlossaryTermDTO = {
        term: term.trim(),
        aliases: aliases
          .split(',')
          .map(a => a.trim())
          .filter(a => a.length > 0),
        category,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        imageUrl: imageUrl.trim() || undefined,
        relatedTerms: relatedTermsInput
          .split(',')
          .map(t => t.trim())
          .filter(t => t.length > 0),
      };

      const glossaryTerm = GlossaryTerm.create(dto);
      const { glossaryRepository } = Container.getRepositories();
      await glossaryRepository.save(glossaryTerm);

      setFeedback({
        open: true,
        type: 'success',
        title: 'Termo criado',
        description: `"${term}" foi adicionado ao glossario.`,
      });

      setTimeout(() => router.push('/admin/glossario'), 1500);
    } catch (error: any) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Erro ao criar',
        description: error.message || 'Nao foi possivel criar o termo.',
      });
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return <AdminLoadingState message="Verificando autenticacao..." />;
  }

  if (!isAdmin) return null;

  const categories = Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, string][];

  return (
    <AdminShell maxWidth="3xl">
      <AdminPageHeader
        backHref="/admin/glossario"
        backLabel="Voltar para Glossario"
        title="Novo Termo"
      />

      <Card className={cn(adminCard)}>
        <CardHeader>
          <CardTitle className={cn('font-display text-gold')}>
            Informacoes do Termo
          </CardTitle>
          <CardDescription className={cn(adminMuted)}>
            Preencha os dados do novo termo do glossario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={cn('space-y-6')}>
            <div className={cn('space-y-2')}>
              <Label htmlFor="term" className={cn(adminLabel)}>Nome do Termo *</Label>
              <Input
                id="term"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Ex: Nix, Pegriam, Espada Dimensional"
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
              <p className={cn('text-xs', adminMuted)}>
                Variacoes do nome que tambem serao reconhecidas.
              </p>
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
                Descricao Curta * (para tooltips e cards)
              </Label>
              <textarea
                id="shortDescription"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Uma frase que resume o termo..."
                required
                rows={2}
                className={cn(adminTextarea)}
                disabled={saving}
              />
            </div>

            <div className={cn('space-y-2')}>
              <Label htmlFor="fullDescription" className={cn(adminLabel)}>
                Descricao Completa * (pagina do termo)
              </Label>
              <textarea
                id="fullDescription"
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Descricao detalhada, historia, caracteristicas..."
                required
                rows={8}
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
              <p className={cn('text-xs', adminMuted)}>
                Cole os IDs dos termos que tem relacao com este. Voce pode adicionar depois.
              </p>
            </div>

            <div className={cn('flex gap-4 pt-4')}>
              <Button type="submit" disabled={saving} className={cn(adminPrimaryBtn)}>
                {saving ? 'Salvando...' : 'Criar Termo'}
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
