/**
 * Middleware do Next.js para proteção de rotas
 * 
 * NOTA: A proteção real de rotas admin é feita nos componentes usando useRequireAdmin.
 * O Firebase Auth funciona no cliente, então não podemos verificar autenticação no middleware.
 * Este middleware apenas redireciona rotas de autenticação se já estiver logado.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas de autenticação - se já estiver logado, redirecionar
  // (Isso será verificado no componente, mas podemos adicionar lógica aqui se necessário)

  // Permitir todas as rotas - a proteção real é feita nos componentes
  // usando useRequireAdmin e useRequireAuth
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

