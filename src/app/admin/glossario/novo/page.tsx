'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Verificando autenticacao...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const categories = Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, string][];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <Link href="/admin/glossario" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Voltar para Glossario
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-2">
            Novo Termo
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informacoes do Termo</CardTitle>
            <CardDescription>
              Preencha os dados do novo termo do glossario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="term">Nome do Termo *</Label>
                <Input
                  id="term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Ex: Nix, Pegriam, Espada Dimensional"
                  required
                  disabled={saving}
                />
              </div>

              {/* Aliases */}
              <div className="space-y-2">
                <Label htmlFor="aliases">Nomes alternativos (separados por virgula)</Label>
                <Input
                  id="aliases"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  placeholder="Ex: O Escolhido, O Bardo"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Variacoes do nome que tambem serao reconhecidas.
                </p>
              </div>

              {/* Category */}
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

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descricao Curta * (para tooltips e cards)</Label>
                <textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Uma frase que resume o termo..."
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

              {/* Full Description */}
              <div className="space-y-2">
                <Label htmlFor="fullDescription">Descricao Completa * (pagina do termo)</Label>
                <textarea
                  id="fullDescription"
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Descricao detalhada, historia, caracteristicas..."
                  required
                  rows={8}
                  className={cn(
                    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                  disabled={saving}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  disabled={saving}
                />
              </div>

              {/* Related Terms IDs */}
              <div className="space-y-2">
                <Label htmlFor="relatedTerms">IDs de Termos Relacionados (separados por virgula)</Label>
                <Input
                  id="relatedTerms"
                  value={relatedTermsInput}
                  onChange={(e) => setRelatedTermsInput(e.target.value)}
                  placeholder="glossary-xxx, glossary-yyy"
                  disabled={saving}
                />
                <p className="text-xs text-muted-foreground">
                  Cole os IDs dos termos que tem relacao com este. Voce pode adicionar depois.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Salvando...' : 'Criar Termo'}
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
