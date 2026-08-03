/**
 * Loading State — Painel Admin
 */

import { cn } from '@/lib/utils';

export default function AdminLoading() {
  return (
    <div className={cn('min-h-screen bg-[hsl(var(--navy-deep))]')}>
      <div className={cn('container mx-auto px-4 py-8')}>
        <div className={cn('mb-8')}>
          <div className={cn('h-10 w-56 bg-white/10 animate-pulse rounded mb-2')} />
          <div className={cn('h-5 w-72 bg-white/10 animate-pulse rounded')} />
        </div>
        <div className={cn('grid grid-cols-1 md:grid-cols-4 gap-4 mb-8')}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn('h-24 bg-navy animate-pulse rounded-lg border border-gold/20')}
            />
          ))}
        </div>
        <div className={cn('space-y-4')}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn('h-20 w-full bg-navy animate-pulse rounded-lg border border-gold/20')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
