import Link from 'next/link';
import { APP_NAME } from '@/shared/constants';
import { cn } from '@/lib/utils';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border bg-card mt-auto")}>
      <div className={cn("container mx-auto px-4 py-10")}>
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8")}>
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="font-bold text-foreground">{APP_NAME}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Historias epicas do Bardo Multiversal. Uma experiencia de leitura imersiva.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Navegar</h4>
            <ul className="space-y-2">
              <FooterLink href="/stories">Historias</FooterLink>
              <FooterLink href="/glossario">Glossario</FooterLink>
              <FooterLink href="/sobre">Sobre o Projeto</FooterLink>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Conta</h4>
            <ul className="space-y-2">
              <FooterLink href="/login">Entrar</FooterLink>
              <FooterLink href="/signup">Criar Conta</FooterLink>
              <FooterLink href="/minha-conta">Minha Area</FooterLink>
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm">Informacoes</h4>
            <ul className="space-y-2">
              <FooterLink href="/beta">Status Beta</FooterLink>
              <FooterLink href="/sobre">Sobre</FooterLink>
            </ul>
          </div>
        </div>

        <div className={cn("border-t border-border mt-8 pt-6 text-center")}>
          <p className="text-sm text-muted-foreground">
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
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
