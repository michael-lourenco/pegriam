/**
 * Hero da página inicial da história: título, meta, capa e CTAs.
 */

'use client';

import Link from 'next/link';
import { Story } from '@/domain/entities/Story';
import { FeaturedCover } from '@/presentation/components/home/FeaturedCover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface StoryHeroProps {
  story: Story;
  startHref: string | null;
  className?: string;
}

function MetaItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm text-white/65')}>
      <span className={cn('text-gold')}>{icon}</span>
      {label}
    </span>
  );
}

export function StoryHero({ story, startHref, className }: StoryHeroProps) {
  const quote =
    story.description.trim().length > 180
      ? `${story.description.trim().slice(0, 177).trim()}…`
      : story.description;

  return (
    <header className={cn('space-y-8', className)}>
      <div className={cn('text-center space-y-5')}>
        <div className={cn('flex items-center justify-center gap-3')}>
          <span className={cn('hidden sm:block h-px w-12 bg-gold/50')} aria-hidden />
          <h1
            className={cn(
              'font-display text-4xl md:text-5xl font-bold',
              'text-[hsl(var(--parchment))]'
            )}
          >
            {story.title}
          </h1>
          <span className={cn('hidden sm:block h-px w-12 bg-gold/50')} aria-hidden />
        </div>

        {story.tags.length > 0 && (
          <div className={cn('flex flex-wrap justify-center gap-2')}>
            {story.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-full',
                  'border border-white/15 bg-white/5 text-white/70'
                )}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className={cn('flex flex-wrap items-center justify-center gap-x-5 gap-y-2')}>
          <MetaItem
            icon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 19V5" />
                <path d="M7 10c2-1 3-3 5-3s3 2 5 3" />
                <path d="M7 14c2 1 3 3 5 3s3-2 5-3" />
              </svg>
            }
            label={story.author}
          />
          <MetaItem
            icon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            }
            label={`${story.metadata.totalChapters} capítulos`}
          />
          <MetaItem
            icon={
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            }
            label={`${story.metadata.estimatedReadTime} min de leitura`}
          />
          {story.freeChapters > 0 && (
            <MetaItem
              icon={
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 12v8H4v-8" />
                  <path d="M2 7h20v5H2z" />
                  <path d="M12 22V7" />
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                </svg>
              }
              label={`${story.freeChapters} gratuitos`}
            />
          )}
        </div>

        {quote && (
          <p
            className={cn(
              'font-display italic text-base md:text-lg max-w-2xl mx-auto',
              'text-white/70 leading-relaxed'
            )}
          >
            &ldquo;{quote}&rdquo;
          </p>
        )}
      </div>

      <div
        className={cn(
          'relative overflow-hidden rounded-xl',
          'border-2 border-gold/45 shadow-xl shadow-black/30'
        )}
      >
        <FeaturedCover
          src={story.coverImage}
          alt={story.title}
          className={cn('rounded-none aspect-[16/9] md:aspect-[2/1]')}
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0',
            'bg-gradient-to-t from-[hsl(var(--navy-deep))] via-[hsl(215_55%_8%_/_0.75)] to-transparent',
            'px-4 pb-5 pt-16 md:px-8 md:pb-7'
          )}
        >
          <div className={cn('flex flex-wrap items-center justify-center gap-3')}>
            {startHref ? (
              <Link href={startHref}>
                <Button
                  size="lg"
                  className={cn(
                    'bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90',
                    'font-semibold min-w-[180px]'
                  )}
                >
                  Começar história
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                disabled
                className={cn('min-w-[180px] opacity-60')}
              >
                Em breve
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              disabled
              title="Áudio narrado em breve"
              className={cn(
                'border-gold/50 text-gold bg-[hsl(var(--navy))]/70',
                'min-w-[180px] cursor-not-allowed opacity-80'
              )}
            >
              Ouvir com Pegriam
            </Button>
          </div>
          <p className={cn('mt-3 text-center text-xs text-white/55')}>
            ✦ Mergulhe na narrativa escrita por Pegriam, o bardo de Kontempler.
          </p>
        </div>
      </div>
    </header>
  );
}
