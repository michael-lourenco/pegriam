'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { Permission } from '@/domain/value-objects/Permission';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isAdmin = user ? Permission.isAdmin(user) : false;

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="w-9 h-9 p-0"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={close} />
          <div className="fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-border shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-foreground">Menu</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0" onClick={close}>
                  <CloseIcon />
                </Button>
              </div>
            </div>
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-65px)]">
              <MobileLink href="/" onClick={close}>Inicio</MobileLink>
              <MobileLink href="/stories" onClick={close}>Historias</MobileLink>
              <MobileLink href="/glossario" onClick={close}>Glossario</MobileLink>
              <MobileLink href="/sobre" onClick={close}>Sobre</MobileLink>

              {user && (
                <>
                  <Divider />
                  <SectionLabel>Minha Conta</SectionLabel>
                  <MobileLink href="/minha-conta" onClick={close}>Visao Geral</MobileLink>
                  <MobileLink href="/minha-conta/biblioteca" onClick={close}>Minha Biblioteca</MobileLink>
                  <MobileLink href="/minha-conta/configuracoes" onClick={close}>Configuracoes</MobileLink>
                </>
              )}

              {isAdmin && (
                <>
                  <Divider />
                  <SectionLabel>Administracao</SectionLabel>
                  <MobileLink href="/admin" onClick={close}>Dashboard</MobileLink>
                  <MobileLink href="/admin/stories" onClick={close}>Gerenciar Historias</MobileLink>
                </>
              )}

              <Divider />
              {user ? (
                <div className="space-y-2 px-3">
                  <p className="text-sm text-muted-foreground truncate">{user.name || user.email.getValue()}</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { signOut(); close(); }}>Sair</Button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Link href="/login" onClick={close}><Button variant="outline" size="sm" className="w-full">Login</Button></Link>
                  <Link href="/signup" onClick={close}><Button size="sm" className="w-full">Cadastrar</Button></Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

function MobileLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClick} className={cn("block px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors")}>
      {children}
    </Link>
  );
}

function Divider() { return <div className="h-px bg-border my-3" />; }
function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="px-3 text-xs text-muted-foreground uppercase tracking-wider mb-2">{children}</p>; }

function MenuIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
}

function CloseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
}
