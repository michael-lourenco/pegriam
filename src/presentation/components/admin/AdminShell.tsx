/**
 * Shell e cabeçalho padrão do painel admin.
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  adminBackLink,
  adminMuted,
  adminPage,
  adminSubtitle,
  adminTitle,
} from '@/presentation/components/admin/adminUi';

interface AdminShellProps {
  children: React.ReactNode;
  maxWidth?: '3xl' | '4xl' | '6xl' | '7xl' | 'full';
  className?: string;
}

const maxWidthMap = {
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-none',
} as const;

export function AdminShell({
  children,
  maxWidth = '6xl',
  className,
}: AdminShellProps) {
  return (
    <div className={cn(adminPage)}>
      <div
        className={cn(
          'container mx-auto px-4 py-8',
          maxWidthMap[maxWidth],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  backHref,
  backLabel = 'Voltar',
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8',
        className
      )}
    >
      <div className={cn('min-w-0')}>
        {backHref && (
          <Link href={backHref} className={cn(adminBackLink, 'inline-block mb-2')}>
            &larr; {backLabel}
          </Link>
        )}
        <h1 className={cn(adminTitle)}>{title}</h1>
        {description && (
          <p className={cn(adminSubtitle, 'mt-2')}>{description}</p>
        )}
      </div>
      {actions && (
        <div className={cn('flex flex-wrap items-center gap-2 flex-shrink-0')}>
          {actions}
        </div>
      )}
    </div>
  );
}

export function AdminLoadingState({ message = 'Carregando...' }: { message?: string }) {
  return (
    <div className={cn(adminPage, 'flex items-center justify-center')}>
      <p className={cn(adminMuted)}>{message}</p>
    </div>
  );
}
