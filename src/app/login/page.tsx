'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.push(redirect as any);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background p-4")}>
      <Card className={cn("w-full max-w-md")}>
        <CardHeader>
          <CardTitle className={cn("text-2xl text-center")}>Login</CardTitle>
          <CardDescription className={cn("text-center")}>
            Entre para acessar o sistema
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

            <div className={cn("space-y-2")}>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className={cn("w-full")}
              disabled={isLoading || loading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className={cn("text-center text-sm space-y-2")}>
              <a
                href="/forgot-password"
                className={cn("text-primary hover:underline")}
              >
                Esqueceu sua senha?
              </a>
              <div>
                <span className={cn("text-muted-foreground")}>Não tem conta? </span>
                <a
                  href="/signup"
                  className={cn("text-primary hover:underline")}
                >
                  Cadastre-se
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className={cn("min-h-screen flex items-center justify-center bg-background p-4")}>
        <Card className={cn("w-full max-w-md")}>
          <CardContent className={cn("p-6")}>
            <p className={cn("text-center text-muted-foreground")}>Carregando...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
