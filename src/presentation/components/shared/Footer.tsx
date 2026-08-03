import Link from 'next/link';
import { APP_NAME } from '@/shared/constants';
import { cn } from '@/lib/utils';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'mt-auto border-t border-white/10',
        'bg-[hsl(var(--navy-deep))] text-[hsl(var(--parchment))]'
      )}
    >
      <div className={cn('container mx-auto px-4 py-10')}>
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8')}>
          <div className="space-y-3">
            <h3 className="font-display font-bold text-gold">{APP_NAME}</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Histórias épicas do Bardo Multiversal. Uma experiência de leitura imersiva.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-white/90">Navegar</h4>
            <ul className="space-y-2">
              <FooterLink href="/stories">Histórias</FooterLink>
              <FooterLink href="/glossario">Glossário</FooterLink>
              <FooterLink href="/sobre">Sobre o Projeto</FooterLink>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-white/90">Conta</h4>
            <ul className="space-y-2">
              <FooterLink href="/login">Entrar</FooterLink>
              <FooterLink href="/signup">Criar Conta</FooterLink>
              <FooterLink href="/minha-conta">Minha Área</FooterLink>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-white/90">Informações</h4>
            <ul className="space-y-2">
              <FooterLink href="/beta">Status Beta</FooterLink>
              <FooterLink href="/sobre">Sobre</FooterLink>
            </ul>
          </div>
        </div>

        <div className={cn('border-t border-white/10 mt-8 pt-6 text-center')}>
          <p className="text-sm text-white/50">
            &copy; {year} {APP_NAME}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-white/55 hover:text-gold transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
