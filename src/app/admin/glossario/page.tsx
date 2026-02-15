'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { Container } from '@/shared/container';
import { GlossaryTerm, GlossaryTermId } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';

export default function AdminGlossarioPage() {
  const { isAdmin, loading: authLoading } = useRequireAdmin();

  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [filtered, setFiltered] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<GlossaryTerm | null>(null);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description: string;
  }>({ open: false, type: 'success', title: '', description: '' });

  useEffect(() => {
    if (authLoading || !isAdmin) return;
    loadTerms();
  }, [isAdmin, authLoading]);

  useEffect(() => {
    let result = terms;
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [terms, activeCategory, search]);

  async function loadTerms() {
    try {
      setLoading(true);
      const { glossaryRepository } = Container.getRepositories();
      const all = await glossaryRepository.findAll();
      setTerms(all);
    } catch (error) {
      console.error('Erro ao carregar glossario:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const { glossaryRepository } = Container.getRepositories();
      await glossaryRepository.delete(deleteTarget.id);
      setTerms(prev => prev.filter(t => t.id !== deleteTarget.id));
      setFeedback({
        open: true,
        type: 'success',
        title: 'Termo removido',
        description: `"${deleteTarget.term}" foi removido do glossario.`,
      });
    } catch (error: any) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Erro ao remover',
        description: error.message || 'Nao foi possivel remover o termo.',
      });
    } finally {
      setDeleteTarget(null);
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">
              &larr; Painel Admin
            </Link>
            <h1 className="text-4xl font-bold text-foreground mt-2 mb-1">
              Gerenciar Glossario
            </h1>
            <p className="text-muted-foreground">
              {terms.length} termo{terms.length !== 1 ? 's' : ''} cadastrado{terms.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/admin/glossario/novo">
            <Button>Novo Termo</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Buscar termos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              Todos
            </Button>
            {categories.map(([key, label]) => {
              const count = terms.filter(t => t.category === key).length;
              return (
                <Button
                  key={key}
                  variant={activeCategory === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(key)}
                >
                  {label} ({count})
                </Button>
              );
            })}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-2">
                {terms.length === 0
                  ? 'Nenhum termo cadastrado ainda.'
                  : 'Nenhum termo encontrado para esta busca.'}
              </p>
              {terms.length === 0 && (
                <Link href="/admin/glossario/novo">
                  <Button className="mt-4">Criar Primeiro Termo</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((term) => (
              <Card key={term.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground text-lg">
                          {term.term}
                        </h3>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          "bg-secondary text-secondary-foreground"
                        )}>
                          {GLOSSARY_CATEGORIES[term.category]}
                        </span>
                      </div>
                      {term.aliases.length > 0 && (
                        <p className="text-xs text-muted-foreground mb-1">
                          Aliases: {term.aliases.join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {term.shortDescription}
                      </p>
                      {term.relatedTerms.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {term.relatedTerms.length} termo{term.relatedTerms.length !== 1 ? 's' : ''} relacionado{term.relatedTerms.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Link href={`/admin/glossario/${term.id}`}>
                        <Button variant="outline" size="sm" className="w-full">Editar</Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(term)}
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirm */}
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
          title="Remover termo"
          description={`Tem certeza que deseja remover "${deleteTarget?.term}" do glossario? Esta acao nao pode ser desfeita.`}
          confirmLabel="Remover"
          variant="destructive"
          onConfirm={handleDelete}
        />

        {/* Feedback */}
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
