/**
 * Página: Informações da Versão Beta
 *
 * Informa ao usuário que a plataforma está em desenvolvimento,
 * quais funcionalidades são simuladas e o que esperar da versão final.
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function InfoItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={cn("space-y-1")}>
      <h3 className={cn("font-semibold text-foreground")}>{title}</h3>
      <p className={cn("text-sm text-muted-foreground leading-relaxed")}>{children}</p>
    </div>
  );
}

export default function BetaPage() {
  return (
    <div className={cn("min-h-screen bg-background")}>
      <div className={cn("container mx-auto px-4 py-12 max-w-3xl")}>
        {/* Header */}
        <div className={cn("text-center mb-10")}>
          <div className={cn("inline-flex items-center gap-2 mb-4")}>
            <span className={cn(
              "text-sm font-bold uppercase tracking-wider px-3 py-1 rounded",
              "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
            )}>
              Beta
            </span>
          </div>
          <h1 className={cn("text-4xl font-bold text-foreground mb-3")}>
            Versão de Testes
          </h1>
          <p className={cn("text-lg text-muted-foreground max-w-xl mx-auto")}>
            Contos de Pegriam está em fase de desenvolvimento ativo.
            Agradecemos seu interesse em explorar a plataforma nesta etapa inicial.
          </p>
        </div>

        {/* Avisos Principais */}
        <Card className={cn("mb-8 border-yellow-500/30 bg-yellow-500/5")}>
          <CardHeader>
            <CardTitle className={cn("text-lg")}>O que isso significa?</CardTitle>
            <CardDescription>
              A plataforma está funcional, mas algumas funcionalidades são simuladas
              e o conteúdo pode mudar sem aviso prévio.
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("space-y-5")}>
            <InfoItem title="Pagamentos simulados">
              O sistema de compra de histórias está atualmente em modo de simulação (mock).
              Nenhum pagamento real é processado. Quando a versão final for lançada com
              integração a um gateway de pagamento real, todas as compras realizadas
              durante a fase beta serão descartadas e o acesso será reiniciado.
            </InfoItem>

            <InfoItem title="Dados podem ser resetados">
              Contas de usuário, compras e dados de leitura criados durante a fase beta
              podem ser apagados a qualquer momento durante a transição para a versão de produção.
              Recomendamos não utilizar dados sensíveis ou importantes.
            </InfoItem>

            <InfoItem title="Conteúdo em construção">
              As histórias, capítulos e demais conteúdos publicados podem estar incompletos,
              sofrer alterações ou ser removidos sem aviso prévio.
              O catálogo final pode diferir significativamente do atual.
            </InfoItem>

            <InfoItem title="Funcionalidades incompletas">
              Alguns recursos podem apresentar comportamento inesperado, estar
              parcialmente implementados ou indisponíveis. Estamos trabalhando para
              entregar a melhor experiência possível na versão final.
            </InfoItem>
          </CardContent>
        </Card>

        {/* O que já funciona */}
        <Card className={cn("mb-8")}>
          <CardHeader>
            <CardTitle className={cn("text-lg")}>O que já funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={cn("space-y-2 text-sm text-muted-foreground")}>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-green-600 mt-0.5")}>&#10003;</span>
                <span>Cadastro e autenticação de usuários</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-green-600 mt-0.5")}>&#10003;</span>
                <span>Navegação e leitura de histórias e capítulos gratuitos</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-green-600 mt-0.5")}>&#10003;</span>
                <span>Sistema editorial para criação e gerenciamento de conteúdo</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-green-600 mt-0.5")}>&#10003;</span>
                <span>Fluxo de compra simulado (sem cobrança real)</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-green-600 mt-0.5")}>&#10003;</span>
                <span>Controle de acesso a capítulos pagos</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* O que está por vir */}
        <Card className={cn("mb-8")}>
          <CardHeader>
            <CardTitle className={cn("text-lg")}>O que está por vir</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={cn("space-y-2 text-sm text-muted-foreground")}>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-yellow-600 mt-0.5")}>&#9679;</span>
                <span>Integração com gateway de pagamento real (Stripe)</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-yellow-600 mt-0.5")}>&#9679;</span>
                <span>Download de PDF das histórias adquiridas</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-yellow-600 mt-0.5")}>&#9679;</span>
                <span>Sistema de favoritos e progresso de leitura</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-yellow-600 mt-0.5")}>&#9679;</span>
                <span>Notificações de novos capítulos</span>
              </li>
              <li className={cn("flex items-start gap-2")}>
                <span className={cn("text-yellow-600 mt-0.5")}>&#9679;</span>
                <span>Melhorias na interface e experiência do leitor</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className={cn("text-center space-y-4")}>
          <p className={cn("text-sm text-muted-foreground")}>
            Ao utilizar a plataforma nesta fase, você está ciente de que se trata
            de uma versão de testes e aceita as condições descritas acima.
          </p>
          <div className={cn("flex items-center justify-center gap-4")}>
            <Link href="/">
              <Button>Voltar ao Início</Button>
            </Link>
            <Link href="/stories">
              <Button variant="outline">Explorar Histórias</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
