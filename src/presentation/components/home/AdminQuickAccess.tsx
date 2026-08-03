/**
 * Componente: AdminQuickAccess
 *
 * Painel de acesso rápido às funcionalidades administrativas na home.
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  adminCard,
  adminMuted,
  adminOutlineBtn,
  adminPrimaryBtn,
} from '@/presentation/components/admin/adminUi';

export function AdminQuickAccess() {
  return (
    <Card className={cn(adminCard, 'border-gold/35')}>
      <CardHeader>
        <CardTitle className={cn('font-display text-lg text-gold')}>
          Acesso Rápido — Administração
        </CardTitle>
        <CardDescription className={cn(adminMuted)}>
          Gerencie histórias, capítulos e conteúdo do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn('flex flex-wrap gap-3')}>
          <Link href="/admin">
            <Button size="sm" className={cn(adminPrimaryBtn)}>
              Painel Admin
            </Button>
          </Link>
          <Link href="/admin/stories">
            <Button variant="outline" size="sm" className={cn(adminOutlineBtn)}>
              Gerenciar Histórias
            </Button>
          </Link>
          <Link href="/admin/stories/new">
            <Button variant="outline" size="sm" className={cn(adminOutlineBtn)}>
              Nova História
            </Button>
          </Link>
          <Link href="/admin/glossario">
            <Button variant="outline" size="sm" className={cn(adminOutlineBtn)}>
              Glossário
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
