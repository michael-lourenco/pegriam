'use client';

import Link from 'next/link';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { Permission } from '@/domain/value-objects/Permission';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { APP_NAME } from '@/shared/constants';

export function Navigation() {
  const { user, signOut } = useAuth();
  const isAdmin = user ? Permission.isAdmin(user) : false;

  return (
    <nav
      className={cn(
        'sticky top-0 z-30 border-b border-white/10',
        'bg-[hsl(var(--navy-deep))]/95 backdrop-blur-md'
      )}
      role="navigation"
      aria-label="Principal"
    >
      <div className={cn('container mx-auto px-4')}>
        <div className={cn('flex items-center justify-between h-16')}>
          <div className={cn('flex items-center gap-6')}>
            <div className={cn('flex items-center gap-2')}>
              <Link
                href="/"
                className={cn(
                  'font-display text-xl font-bold tracking-tight',
                  'text-[hsl(var(--parchment))] hover:text-gold transition-colors'
                )}
              >
                {APP_NAME}
              </Link>
              <Link
                href="/beta"
                className={cn(
                  'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded',
                  'bg-gold/15 text-gold border border-gold/30',
                  'hover:bg-gold/25 transition-colors'
                )}
              >
                Beta
              </Link>
            </div>
            <div className={cn('hidden md:flex items-center gap-5')}>
              <NavLink href="/stories">Histórias</NavLink>
              <NavLink href="/glossario">Glossário</NavLink>
              <NavLink href="/sobre">Sobre</NavLink>
              {user && <NavLink href="/minha-conta">Minha Conta</NavLink>}
              {isAdmin && (
                <>
                  <NavLink href="/admin">Admin</NavLink>
                  <NavLink href="/admin/stories">Gerenciar</NavLink>
                </>
              )}
            </div>
          </div>

          <div className={cn('flex items-center gap-2')}>
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            {user ? (
              <div className={cn('hidden md:flex items-center gap-3')}>
                <Link
                  href="/minha-conta"
                  className={cn(
                    'text-sm text-white/70 hover:text-gold transition-colors'
                  )}
                >
                  {user.name || user.email.getValue()}
                </Link>
                {isAdmin && (
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded bg-gold/15 text-gold border border-gold/25'
                    )}
                  >
                    Admin
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className={cn('text-white/80 hover:text-gold hover:bg-white/5')}
                >
                  Sair
                </Button>
              </div>
            ) : (
              <div className={cn('hidden md:flex items-center gap-2')}>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('text-white/80 hover:text-gold hover:bg-white/5')}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="sm"
                    className={cn('bg-gold text-[hsl(var(--navy-deep))] hover:bg-gold/90')}
                  >
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm text-white/70 hover:text-gold transition-colors'
      )}
    >
      {children}
    </Link>
  );
}
