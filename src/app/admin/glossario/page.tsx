'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '@/shared/hooks/useRequireAdmin';
import { Container } from '@/shared/container';
import { GlossaryTerm } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/presentation/components/shared/ConfirmDialog';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';
import { AdminLoadingState, AdminPageHeader, AdminShell } from '@/presentation/components/admin/AdminShell';
import {
  adminCard,
  adminGhostBtn,
  adminInput,
  adminListItem,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
} from '@/presentation/components/admin/adminUi';
import { categoryPillClass } from '@/presentation/components/glossary/glossaryUi';

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
      result = result.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
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
      setTerms((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setFeedback({
        open: true,
        type: 'success',
        title: 'Termo removido',
        description: `"${deleteTarget.term}" foi removido do glossário.`,
      });
    } catch (error: any) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Erro ao remover',
        description: error.message || 'Não foi possível remover o termo.',
      });
    } finally {
      setDeleteTarget(null);
    }
  }

  if (authLoading) {
    return <AdminLoadingState message="Verificando autenticação..." />;
  }

  if (!isAdmin) return null;

  const categories = Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, string][];

  return (
    <AdminShell>
      <AdminPageHeader
        backHref="/admin"
        backLabel="Painel Admin"
        title="Gerenciar Glossário"
        description={`${terms.length} termo${terms.length !== 1 ? 's' : ''} cadastrado${terms.length !== 1 ? 's' : ''}`}
        actions={
          <Link href="/admin/glossario/novo">
            <Button className={cn(adminPrimaryBtn)}>Novo Termo</Button>
          </Link>
        }
      />

      <div className={cn('flex flex-col sm:flex-row gap-4 mb-6')}>
        <Input
          placeholder="Buscar termos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(adminInput, 'max-w-sm')}
        />
        <div className={cn('flex flex-wrap gap-2')}>
          <FilterChip
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            label="Todos"
          />
          {categories.map(([key, label]) => {
            const count = terms.filter((t) => t.category === key).length;
            return (
              <FilterChip
                key={key}
                active={activeCategory === key}
                onClick={() => setActiveCategory(key)}
                label={`${label} (${count})`}
              />
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className={cn('space-y-3')}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('h-20 bg-white/10 animate-pulse rounded-lg')} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className={cn(adminCard)}>
          <CardContent className={cn('py-12 text-center')}>
            <p className={cn(adminMuted, 'text-lg mb-2')}>
              {terms.length === 0
                ? 'Nenhum termo cadastrado ainda.'
                : 'Nenhum termo encontrado para esta busca.'}
            </p>
            {terms.length === 0 && (
              <Link href="/admin/glossario/novo">
                <Button className={cn(adminPrimaryBtn, 'mt-4')}>Criar Primeiro Termo</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={cn('space-y-3')}>
          {filtered.map((term) => (
            <div key={term.id} className={cn(adminListItem, 'p-5')}>
              <div className={cn('flex items-start justify-between gap-4')}>
                <div className={cn('flex-1 min-w-0')}>
                  <div className={cn('flex flex-wrap items-center gap-3 mb-1')}>
                    <h3 className={cn('font-display font-semibold text-lg text-[hsl(var(--parchment))]')}>
                      {term.term}
                    </h3>
                    <span className={cn(categoryPillClass(term.category))}>
                      {GLOSSARY_CATEGORIES[term.category]}
                    </span>
                  </div>
                  {term.aliases.length > 0 && (
                    <p className={cn('text-xs text-white/45 mb-1')}>
                      Aliases: {term.aliases.join(', ')}
                    </p>
                  )}
                  <p className={cn('text-sm text-white/55 line-clamp-2')}>
                    {term.shortDescription}
                  </p>
                </div>
                <div className={cn('flex flex-col gap-2 flex-shrink-0')}>
                  <Link href={`/admin/glossario/${term.id}`}>
                    <Button variant="outline" size="sm" className={cn(adminOutlineBtn, 'w-full')}>
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(adminGhostBtn, 'text-destructive hover:text-destructive')}
                    onClick={() => setDeleteTarget(term)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Remover termo"
        description={`Tem certeza que deseja remover "${deleteTarget?.term}" do glossário? Esta ação não pode ser desfeita.`}
        confirmLabel="Remover"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <FeedbackDialog
        open={feedback.open}
        onOpenChange={(open) => setFeedback((prev) => ({ ...prev, open }))}
        type={feedback.type}
        title={feedback.title}
        description={feedback.description}
      />
    </AdminShell>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-xs px-3 py-1.5 rounded-full border transition-colors',
        active
          ? 'bg-gold text-[hsl(var(--navy-deep))] border-gold font-semibold'
          : 'border-gold/30 text-white/70 hover:border-gold/55 hover:text-gold'
      )}
    >
      {label}
    </button>
  );
}
