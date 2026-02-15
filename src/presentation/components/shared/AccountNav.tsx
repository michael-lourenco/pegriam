/**
 * Componente: AccountNav
 * 
 * Navegação lateral da área do usuário.
 * Exibe links para as sub-páginas: Visão Geral, Biblioteca, Configurações.
 * Destaca a página ativa baseado no pathname atual.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/minha-conta', label: 'Visão Geral', exact: true },
  { href: '/minha-conta/biblioteca', label: 'Minha Biblioteca', exact: false },
  { href: '/minha-conta/configuracoes', label: 'Configurações', exact: false },
];

export function AccountNav() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean): boolean {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <nav className={cn("space-y-1")}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "block px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
            isActive(item.href, item.exact)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
