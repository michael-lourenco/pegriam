/**
 * Error Boundary Global
 * 
 * Captura erros não tratados em qualquer rota.
 * Oferece opção de tentar novamente sem recarregar a página inteira.
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erro capturado pelo Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-4xl mb-2">⚠️</div>
          <CardTitle>Algo deu errado</CardTitle>
          <CardDescription>
            Ocorreu um erro inesperado. Tente novamente ou volte à página inicial.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {process.env.NODE_ENV === 'development' && (
            <details className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
              <summary className="cursor-pointer font-medium">Detalhes do erro</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">
                {error.message}
              </pre>
            </details>
          )}
          <Button onClick={reset} className="w-full">
            Tentar Novamente
          </Button>
          <a href="/">
            <Button variant="outline" className="w-full">
              Voltar ao Início
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
