import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_NAME } from '@/shared/constants';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheca o projeto Contos de Pegriam, uma plataforma de leitura de historias epicas do Bardo Multiversal.',
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Sobre o {APP_NAME}
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong className="text-foreground">{APP_NAME}</strong> e uma plataforma de leitura
              dedicada a historias epicas de fantasia, criadas pelo Bardo Multiversal. Aqui voce encontra
              narrativas imersivas com worldbuilding rico, personagens complexos e um glossario interativo
              que torna a experiencia de leitura unica.
            </p>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>O Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                A plataforma foi construida com tecnologias modernas para oferecer a melhor experiencia
                de leitura possivel. Utilizamos Next.js, TypeScript e uma arquitetura limpa que permite
                escalar o projeto conforme novas historias e funcionalidades sao adicionadas.
              </p>
              <p>
                Nosso modelo e freemium: os primeiros capitulos de cada historia sao gratuitos para que
                voce possa conhecer o universo de Pegriam. Se gostar, pode adquirir o acesso completo
                a historia.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">Leitor Imersivo</span>
                  <span>— Modo de leitura com controles de tipografia e tema escuro</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">Glossario Interativo</span>
                  <span>— Termos do universo explicados durante a leitura</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">Progresso de Leitura</span>
                  <span>— Seu progresso e salvo automaticamente</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">Biblioteca Pessoal</span>
                  <span>— Historias adquiridas disponiveis a qualquer momento</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tecnologias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'TypeScript', 'React', 'Tailwind CSS', 'Firebase Auth', 'Supabase', 'Clean Architecture'].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/stories">
              <Button size="lg">Explorar Historias</Button>
            </Link>
            <Link href="/beta">
              <Button variant="outline" size="lg">Status Beta</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
