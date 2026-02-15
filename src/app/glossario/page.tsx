'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from '@/shared/container';
import { GlossaryTerm } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from '@/shared/constants';
import { Breadcrumbs } from '@/presentation/components/shared/Breadcrumbs';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GlossarioPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [filtered, setFiltered] = useState<GlossaryTerm[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { glossaryRepository } = Container.getRepositories();
        const all = await glossaryRepository.findAll();
        setTerms(all);
        setFiltered(all);
      } catch (error) {
        console.error('Erro ao carregar glossario:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let result = terms;
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.term.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.aliases.some(a => a.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [terms, activeCategory, search]);

  const categories = Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, string][];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-48 bg-muted animate-pulse rounded mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: 'Glossario' }]} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Glossario de Pegriam</h1>
          <p className="text-muted-foreground">
            Explore os termos, personagens, lugares e conceitos do universo de Pegriam.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
              Todos ({terms.length})
            </Button>
            {categories.map(([key, label]) => {
              const count = terms.filter(t => t.category === key).length;
              if (count === 0) return null;
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

        {/* Results */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-lg mb-2">
                {terms.length === 0
                  ? 'O glossario ainda esta vazio.'
                  : 'Nenhum termo encontrado para esta busca.'}
              </p>
              {terms.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Os termos serao adicionados conforme as historias forem publicadas.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((term) => (
              <Link key={term.id} href={`/glossario/${term.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{term.term}</CardTitle>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        "bg-secondary text-secondary-foreground"
                      )}>
                        {GLOSSARY_CATEGORIES[term.category]}
                      </span>
                    </div>
                    {term.aliases.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Tambem conhecido como: {term.aliases.join(', ')}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {term.shortDescription}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
