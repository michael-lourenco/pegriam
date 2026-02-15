'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Rota legada: redireciona para /minha-conta/biblioteca
 */
export default function PurchasesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/minha-conta/biblioteca');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  );
}
