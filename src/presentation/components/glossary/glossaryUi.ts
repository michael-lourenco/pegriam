/**
 * Utilitários visuais do glossário.
 */

import type { GlossaryCategory } from '@/shared/constants';
import { cn } from '@/lib/utils';

export function categoryPillClass(category: GlossaryCategory): string {
  const map: Record<GlossaryCategory, string> = {
    character: 'border-sky-400/40 bg-sky-500/15 text-sky-200',
    location: 'border-gold/40 bg-gold/15 text-gold',
    magic: 'border-violet-400/40 bg-violet-500/15 text-violet-200',
    object: 'border-amber-400/40 bg-amber-500/15 text-amber-200',
    creature: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
    organization: 'border-rose-400/40 bg-rose-500/15 text-rose-200',
    concept: 'border-white/30 bg-white/10 text-white/80',
  };
  return cn('text-[11px] px-2 py-0.5 rounded-full border', map[category]);
}

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function letterOf(term: string): string {
  const normalized = term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(normalized) ? normalized : '#';
}
