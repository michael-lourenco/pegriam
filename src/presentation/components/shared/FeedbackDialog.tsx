/**
 * Componente: FeedbackDialog
 * 
 * Modal reutilizável para exibição de feedback ao usuário:
 * sucesso, erro, aviso ou informação.
 * Substitui o uso nativo de window.alert() por uma interface moderna
 * e consistente com a identidade visual do sistema.
 * 
 * Uso:
 *   <FeedbackDialog
 *     open={showFeedback}
 *     onOpenChange={setShowFeedback}
 *     type="success"
 *     title="Salvo com sucesso"
 *     description="A história foi atualizada."
 *   />
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FeedbackType = 'success' | 'error' | 'warning' | 'info';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  type?: FeedbackType;
  buttonLabel?: string;
  onClose?: () => void;
}

const typeConfig: Record<FeedbackType, { icon: string; titleClass: string }> = {
  success: {
    icon: '\u2713',
    titleClass: 'text-green-600',
  },
  error: {
    icon: '\u2717',
    titleClass: 'text-destructive',
  },
  warning: {
    icon: '\u26A0',
    titleClass: 'text-yellow-600',
  },
  info: {
    icon: '\u2139',
    titleClass: 'text-primary',
  },
};

export function FeedbackDialog({
  open,
  onOpenChange,
  title,
  description,
  type = 'info',
  buttonLabel = 'OK',
  onClose,
}: FeedbackDialogProps) {
  const config = typeConfig[type];

  function handleClose() {
    onClose?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-md")}>
        <DialogHeader>
          <DialogTitle className={cn("flex items-center gap-2", config.titleClass)}>
            <span className={cn("text-xl")}>{config.icon}</span>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose}>
            {buttonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
