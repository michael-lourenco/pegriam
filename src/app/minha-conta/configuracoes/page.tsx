/**
 * Página: Configurações da Conta
 * 
 * Permite ao usuário editar seu nome de exibição
 * e visualizar informações da conta.
 */

'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAuth } from '@/presentation/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FeedbackDialog } from '@/presentation/components/shared/FeedbackDialog';

export default function ConfiguracoesPage() {
  const { user, updateName } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description: string;
  }>({ open: false, type: 'success', title: '', description: '' });

  if (!user) return null;

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Campo obrigatório',
        description: 'O nome não pode ficar vazio.',
      });
      return;
    }

    setSaving(true);
    try {
      await updateName(name.trim());
      setFeedback({
        open: true,
        type: 'success',
        title: 'Perfil atualizado',
        description: 'Seu nome foi alterado com sucesso.',
      });
    } catch (error: any) {
      setFeedback({
        open: true,
        type: 'error',
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível atualizar o nome.',
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={cn("space-y-8")}>
      <div>
        <h1 className={cn("text-3xl font-bold text-foreground")}>Configurações</h1>
        <p className={cn("text-muted-foreground mt-1")}>
          Gerencie seu perfil e informações da conta.
        </p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-lg")}>Perfil</CardTitle>
          <CardDescription>
            Informações de exibição da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveName} className={cn("space-y-4 max-w-md")}>
            <div className={cn("space-y-2")}>
              <Label htmlFor="name">Nome de exibição</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                disabled={saving}
              />
              <p className={cn("text-xs text-muted-foreground")}>
                Nome visível na navegação e na sua área pessoal.
              </p>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Nome'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Informações da Conta (somente leitura) */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-lg")}>Informações da Conta</CardTitle>
          <CardDescription>
            Dados vinculados à sua autenticação.
          </CardDescription>
        </CardHeader>
        <CardContent className={cn("space-y-4 max-w-md")}>
          <div className={cn("space-y-2")}>
            <Label>Email</Label>
            <Input
              value={user.email.getValue()}
              disabled
              className={cn("bg-muted")}
            />
            <p className={cn("text-xs text-muted-foreground")}>
              O email não pode ser alterado por aqui.
            </p>
          </div>

          <div className={cn("space-y-2")}>
            <Label>ID da Conta</Label>
            <Input
              value={user.id}
              disabled
              className={cn("bg-muted font-mono text-xs")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className={cn("text-lg")}>Segurança</CardTitle>
          <CardDescription>
            Opções de segurança da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className={cn("space-y-4 max-w-md")}>
          <div>
            <p className={cn("text-sm text-muted-foreground mb-3")}>
              Para alterar sua senha, utilize a opção de recuperação de senha na tela de login.
            </p>
            <a href="/forgot-password">
              <Button variant="outline" size="sm">
                Alterar Senha
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedback.open}
        onOpenChange={(open) => setFeedback((prev) => ({ ...prev, open }))}
        type={feedback.type}
        title={feedback.title}
        description={feedback.description}
      />
    </div>
  );
}
