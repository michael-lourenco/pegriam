'use client';

import Link from 'next/link';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { Permission } from '@/domain/value-objects/Permission';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { user, signOut } = useAuth();

  const isAdmin = user ? Permission.isAdmin(user) : false;

  return (
    <nav className={cn("border-b border-border bg-card")}>
      <div className={cn("container mx-auto px-4")}>
        <div className={cn("flex items-center justify-between h-16")}>
          <div className={cn("flex items-center gap-6")}>
            <Link href="/" className={cn("text-xl font-bold text-foreground")}>
              Contos de Pegriam
            </Link>
            <div className={cn("hidden md:flex items-center gap-4")}>
              <Link
                href="/stories"
                className={cn("text-sm text-muted-foreground hover:text-foreground transition-colors")}
              >
                Histórias
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/admin"
                    className={cn("text-sm text-muted-foreground hover:text-foreground transition-colors")}
                  >
                    Admin
                  </Link>
                  <Link
                    href="/admin/stories"
                    className={cn("text-sm text-muted-foreground hover:text-foreground transition-colors")}
                  >
                    Gerenciar
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className={cn("flex items-center gap-4")}>
            {user ? (
              <>
                <span className={cn("text-sm text-muted-foreground")}>
                  {user.name || user.email.getValue()}
                </span>
                {isAdmin && (
                  <span className={cn("text-xs px-2 py-1 rounded bg-primary/10 text-primary")}>
                    Admin
                  </span>
                )}
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

