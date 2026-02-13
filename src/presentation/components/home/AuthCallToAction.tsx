/**
 * Componente: AuthCallToAction
 * 
 * Seção de chamada para ação de autenticação.
 * Exibido exclusivamente para visitantes não autenticados,
 * incentivando o cadastro ou login na plataforma.
 * 
 * Segue o princípio de responsabilidade única (SRP):
 * apenas apresenta os CTAs de autenticação.
 */

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AuthCallToAction() {
  return (
    <Card className={cn("bg-muted/50 border-dashed")}>
      <CardHeader className={cn("text-center")}>
        <CardTitle className={cn("text-xl")}>Crie sua Conta</CardTitle>
        <CardDescription className={cn("max-w-md mx-auto")}>
          Cadastre-se gratuitamente para acompanhar suas leituras
          e receber novidades sobre novas histórias.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn("flex items-center justify-center gap-4")}>
          <Link href="/signup">
            <Button>Criar Conta Gratuita</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">Já tenho conta</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
