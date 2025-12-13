import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-16")}>
        <div className={cn("text-center mb-12")}>
          <h1 className={cn("text-5xl font-bold text-foreground mb-4")}>
            Contos de Pegriam
          </h1>
          <p className={cn("text-xl text-muted-foreground mb-2")}>
            Sistema Editorial Avançado
          </p>
          <p className={cn("text-muted-foreground")}>
            O Bardo Multiversal
          </p>
        </div>

        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto")}>
          {/* Área Pública */}
          <Card className={cn("hover:shadow-lg transition-shadow")}>
            <CardHeader>
              <CardTitle>Área Pública</CardTitle>
              <CardDescription>
                Explore as histórias disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className={cn("space-y-4")}>
              <Link href="/stories" className={cn("block")}>
                <Button className={cn("w-full")} variant="default">
                  Ver Histórias
                </Button>
              </Link>
              <p className={cn("text-sm text-muted-foreground")}>
                Acesse todas as histórias publicadas e leia os capítulos gratuitos.
              </p>
            </CardContent>
          </Card>

          {/* Área Admin */}
          <Card className={cn("hover:shadow-lg transition-shadow")}>
            <CardHeader>
              <CardTitle>Área Administrativa</CardTitle>
              <CardDescription>
                Gerencie histórias e capítulos
              </CardDescription>
            </CardHeader>
            <CardContent className={cn("space-y-4")}>
              <Link href="/admin" className={cn("block")}>
                <Button className={cn("w-full")} variant="default">
                  Painel Admin
                </Button>
              </Link>
              <Link href="/admin/stories" className={cn("block")}>
                <Button className={cn("w-full")} variant="outline">
                  Gerenciar Histórias
                </Button>
              </Link>
              <p className={cn("text-sm text-muted-foreground")}>
                Requer login com email: kontempler@gmail.com
              </p>
            </CardContent>
          </Card>

          {/* Autenticação */}
          <Card className={cn("hover:shadow-lg transition-shadow")}>
            <CardHeader>
              <CardTitle>Autenticação</CardTitle>
              <CardDescription>
                Faça login ou crie uma conta
              </CardDescription>
            </CardHeader>
            <CardContent className={cn("space-y-4")}>
              <Link href="/login" className={cn("block")}>
                <Button className={cn("w-full")} variant="default">
                  Login
                </Button>
              </Link>
              <Link href="/signup" className={cn("block")}>
                <Button className={cn("w-full")} variant="outline">
                  Criar Conta
                </Button>
              </Link>
              <p className={cn("text-sm text-muted-foreground")}>
                Acesse sua conta ou cadastre-se para começar.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className={cn("mt-12 text-center")}>
          <Card className={cn("max-w-2xl mx-auto")}>
            <CardHeader>
              <CardTitle>Como Começar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("space-y-4 text-left")}>
                <div>
                  <h3 className={cn("font-semibold mb-2")}>1. Para Testar o Editor (Admin)</h3>
                  <ol className={cn("list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4")}>
                    <li>Faça login em <Link href="/login" className={cn("text-primary hover:underline")}>/login</Link> com: <code className={cn("bg-muted px-1 rounded")}>kontempler@gmail.com</code></li>
                    <li>Acesse o <Link href="/admin" className={cn("text-primary hover:underline")}>Painel Admin</Link></li>
                    <li>Clique em "Nova História" para criar uma história</li>
                    <li>Depois clique em "Editor de Capítulos" para criar capítulos com blocos modulares</li>
                  </ol>
                </div>
                <div>
                  <h3 className={cn("font-semibold mb-2")}>2. Para Ver Histórias (Público)</h3>
                  <p className={cn("text-sm text-muted-foreground ml-4")}>
                    Acesse <Link href="/stories" className={cn("text-primary hover:underline")}>/stories</Link> para ver todas as histórias disponíveis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
