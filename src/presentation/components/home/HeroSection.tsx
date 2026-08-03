/**
 * Componente: HeroSection
 *
 * Hero full-bleed da home com arte de Pegriam.
 * Primeiro viewport: marca implícita na arte, headline, apoio e CTAs.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  isAuthenticated: boolean;
  userName?: string;
  isAdmin: boolean;
}

const HERO_IMAGE = '/images/PEGRIAM_CONTANDO_HISTORIAS.png';

export function HeroSection({ isAuthenticated, userName }: HeroSectionProps) {
  const support = isAuthenticated
    ? `Bem-vindo de volta${userName ? `, ${userName}` : ''}. Continue explorando Kontempler.`
    : 'Mergulhe em lendas, lugares e vozes do Bardo Multiversal.';

  return (
    <section
      className={cn(
        'relative w-full min-h-[min(88vh,820px)] overflow-hidden',
        'bg-[hsl(var(--navy-deep))]'
      )}
      aria-label="Apresentação"
    >
      <div className={cn('absolute inset-0')}>
        <Image
          src={HERO_IMAGE}
          alt="Pegriam contando histórias para a multidão em Kontempler"
          fill
          priority
          sizes="100vw"
          className={cn(
            'object-cover object-[center_30%]',
            'animate-hero-kenburns origin-center'
          )}
        />
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-r from-[hsl(var(--navy-deep))] via-[hsl(215_55%_8%_/_0.75)] to-transparent'
          )}
        />
        <div
          className={cn(
            'absolute inset-0',
            'bg-gradient-to-t from-[hsl(var(--navy-deep))] via-transparent to-[hsl(215_55%_8%_/_0.4)]'
          )}
        />
      </div>

      <div
        className={cn(
          'relative z-10 container mx-auto px-4',
          'flex min-h-[min(88vh,820px)] items-center py-16 md:py-20'
        )}
      >
        <div className={cn('max-w-xl space-y-6 animate-fade-up')}>
          <p
            className={cn(
              'font-display text-gold text-sm md:text-base tracking-[0.2em] uppercase'
            )}
          >
            Contos de Pegriam
          </p>
          <h1
            className={cn(
              'font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold',
              'leading-[1.15] text-[hsl(var(--parchment))]'
            )}
          >
            As melhores histórias de Kontempler, contadas por Pegriam.
          </h1>
          <p className={cn('text-base md:text-lg text-white/75 leading-relaxed max-w-md')}>
            {support}
          </p>
          <div className={cn('flex flex-wrap items-center gap-3 pt-2')}>
            <Link href="/stories">
              <Button
                size="lg"
                className={cn(
                  'bg-[hsl(215_55%_32%)] hover:bg-[hsl(215_55%_38%)]',
                  'text-[hsl(var(--parchment))] border border-white/10'
                )}
              >
                Explorar Histórias
              </Button>
            </Link>
            <Link href="/sobre">
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  'border-gold/60 text-gold bg-transparent',
                  'hover:bg-gold/10 hover:text-gold'
                )}
              >
                Conhecer Pegriam
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
