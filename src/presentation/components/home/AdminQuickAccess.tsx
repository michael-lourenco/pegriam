/**
 * Componente: AdminQuickAccess
 * 
 * Painel de acesso rápido às funcionalidades administrativas.
 * Exibido exclusivamente para usuários com permissão de admin.
 * 
 * Segue o princípio de responsabilidade única (SRP):
 * apenas fornece atalhos para as áreas administrativas.
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminQuickAccess() {
  return (
    <Card className={cn("border-primary/20 bg-primary/5")}>
      <CardHeader>
        <CardTitle className={cn("text-lg")}>
          Acesso Rápido — Administração
        </CardTitle>
        <CardDescription>
          Gerencie histórias, capítulos e conteúdo do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("flex flex-wrap gap-3")}>
          <Link href="/admin">
            <Button size="sm">Painel Admin</Button>
          </Link>
          <Link href="/admin/stories">
            <Button variant="outline" size="sm">Gerenciar Histórias</Button>
          </Link>
          <Link href="/admin/stories/new">
            <Button variant="outline" size="sm">Nova História</Button>
          </Link>
          <Link href="/admin/glossario">
            <Button variant="outline" size="sm">Glossário</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
