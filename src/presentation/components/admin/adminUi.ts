/**
 * Classes e helpers visuais do painel admin (tema Pegriam).
 */

import { cn } from '@/lib/utils';

export const adminPage = 'min-h-screen bg-[hsl(var(--navy-deep))]';

export const adminCard = cn(
  'border-gold/25 bg-navy text-[hsl(var(--parchment))]',
  'shadow-none'
);

export const adminCardHeader = 'text-[hsl(var(--parchment))]';

export const adminMuted = 'text-white/55';

export const adminTitle = 'font-display text-4xl font-bold text-[hsl(var(--parchment))]';

export const adminSubtitle = 'text-white/55';

export const adminBackLink = 'text-sm text-gold/80 hover:text-gold transition-colors';

export const adminInput = cn(
  'bg-[hsl(var(--navy-deep))] border-gold/25',
  'text-[hsl(var(--parchment))] placeholder:text-white/35',
  'focus-visible:ring-gold/40'
);

export const adminSelect = cn(
  'w-full rounded-md border border-gold/25 bg-[hsl(var(--navy-deep))]',
  'px-3 py-2 text-sm text-[hsl(var(--parchment))]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40'
);

export const adminTextarea = cn(
  adminSelect,
  'min-h-[100px] resize-y'
);

export const adminLabel = 'text-[hsl(var(--parchment))]/90';

export const adminPrimaryBtn = 'bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90';

export const adminOutlineBtn = 'border-gold/40 text-gold hover:bg-gold/10 hover:text-gold';

export const adminGhostBtn = 'text-white/70 hover:text-gold hover:bg-white/5';

export const adminDangerBtn =
  'bg-destructive/90 text-destructive-foreground hover:bg-destructive';

export const adminListItem = cn(
  'rounded-lg border border-gold/20 bg-navy p-4',
  'hover:border-gold/45 transition-colors'
);

export const adminStatCard = cn(
  'border-gold/25 bg-navy'
);

export const adminErrorBanner =
  'mb-4 p-3 rounded-md bg-destructive/15 border border-destructive/30 text-destructive text-sm';

/** Superfície de preview igual ao leitor (pergaminho + texto escuro) */
export const adminReaderPreview = cn(
  'reader-parchment prose-parchment rounded-lg border border-gold/35',
  'text-[hsl(215_50%_14%)]'
);

export const adminLoadingCenter = cn(
  adminPage,
  'flex items-center justify-center'
);

export function adminStatusPill(status: string): string {
  if (status === 'publishing') {
    return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
  }
  if (status === 'completed') {
    return 'bg-sky-500/15 text-sky-300 border border-sky-500/30';
  }
  return 'bg-amber-500/15 text-amber-200 border border-amber-500/30';
}
