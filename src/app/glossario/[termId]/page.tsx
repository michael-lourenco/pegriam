'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/shared/container';
import { GlossaryTerm, GlossaryTermId } from '@/domain/entities/GlossaryTerm';
import { GLOSSARY_CATEGORIES } from '@/shared/constants';
import { Breadcrumbs } from '@/presentation/components/shared/Breadcrumbs';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/presentation/components/shared/SafeImage';

export default function GlossaryTermPage() {
  const params = useParams();
  const router = useRouter();
  const termId = params.termId as string;

  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [relatedTerms, setRelatedTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { glossaryRepository } = Container.getRepositories();
        const data = await glossaryRepository.findById(termId as GlossaryTermId);
        if (!data) {
          setError('Termo nao encontrado');
          return;
        }
        setTerm(data);

        if (data.relatedTerms.length > 0) {
          const allTerms = await glossaryRepository.findAll();
          const related = allTerms.filter(t => data.relatedTerms.includes(t.id));
          setRelatedTerms(related);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar termo');
      } finally {
        setLoading(false);
      }
    }
    if (termId) load();
  }, [termId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !term) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error || 'Termo nao encontrado'}</p>
          <Button onClick={() => router.push('/glossario')}>Voltar ao Glossario</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Breadcrumbs
          items={[
            { label: 'Glossario', href: '/glossario' },
            { label: term.term },
          ]}
          className="mb-6"
        />

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground">{term.term}</h1>
            <span className="text-sm px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
              {GLOSSARY_CATEGORIES[term.category]}
            </span>
          </div>

          {term.aliases.length > 0 && (
            <p className="text-muted-foreground">
              Tambem conhecido como: <strong>{term.aliases.join(', ')}</strong>
            </p>
          )}
        </div>

        {/* Image + Description */}
        <Card className="mb-8">
          <CardContent className="py-6">
            {term.imageUrl && (
              <div className="mb-6">
                <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-lg border border-border">
                  <SafeImage
                    src={term.imageUrl}
                    alt={term.term}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground mb-4">{term.shortDescription}</p>
              <div className="whitespace-pre-wrap text-foreground">{term.fullDescription}</div>
            </div>
          </CardContent>
        </Card>

        {/* Related Terms */}
        {relatedTerms.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Termos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTerms.map((rt) => (
                <Link key={rt.id} href={`/glossario/${rt.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{rt.term}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{rt.shortDescription}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-3">
          <Link href="/glossario">
            <Button variant="outline">&larr; Voltar ao Glossario</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
