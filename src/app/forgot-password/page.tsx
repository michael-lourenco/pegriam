'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center bg-background p-4")}>
        <Card className={cn("w-full max-w-md")}>
          <CardHeader>
            <CardTitle className={cn("text-2xl text-center")}>Email Enviado</CardTitle>
            <CardDescription className={cn("text-center")}>
              Verifique sua caixa de entrada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={cn("space-y-4")}>
              <p className={cn("text-sm text-muted-foreground text-center")}>
                Enviamos um link de recuperação de senha para <strong>{email}</strong>.
                Verifique sua caixa de entrada e siga as instruções.
              </p>
              <Button
                onClick={() => window.location.href = '/login'}
                className={cn("w-full")}
              >
                Voltar para Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background p-4")}>
      <Card className={cn("w-full max-w-md")}>
        <CardHeader>
          <CardTitle className={cn("text-2xl text-center")}>Recuperar Senha</CardTitle>
          <CardDescription className={cn("text-center")}>
            Digite seu email para receber o link de recuperação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className={cn("space-y-4")}>
            {error && (
              <div className={cn("p-3 rounded-md bg-destructive/10 text-destructive text-sm")}>
                {error}
              </div>
            )}

            <div className={cn("space-y-2")}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className={cn("w-full")}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </Button>

            <div className={cn("text-center text-sm")}>
              <a
                href="/login"
                className={cn("text-primary hover:underline")}
              >
                Voltar para Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

