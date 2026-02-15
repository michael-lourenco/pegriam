import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-bold text-muted-foreground/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Portal Nao Encontrado
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          O caminho que voce buscava se perdeu entre as dimensoes do multiverso.
          Nem mesmo o Bardo consegue localizar esta pagina.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg">Voltar ao Inicio</Button>
          </Link>
          <Link href="/stories">
            <Button variant="outline" size="lg">Explorar Historias</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
