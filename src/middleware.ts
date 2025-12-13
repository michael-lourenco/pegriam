/**
 * Middleware do Next.js para proteção de rotas
 * 
 * Verifica autenticação e permissões antes de permitir acesso às rotas.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getFirebaseAuth } from '@/infrastructure/config/firebase.config';
import { Permission } from '@/domain/value-objects/Permission';
import { Email } from '@/domain/value-objects/Email';

// Rotas que requerem autenticação admin
const ADMIN_ROUTES = ['/admin'];

// Rotas públicas (não requerem autenticação)
const PUBLIC_ROUTES = ['/', '/stories', '/stories/[id]', '/stories/[id]/chapter/[chapterId]'];

/**
 * Verificar se a rota requer autenticação admin
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Verificar se a rota é pública
 */
function isPublicRoute(pathname: string): boolean {
  // Rotas exatas
  if (pathname === '/') return true;
  if (pathname === '/stories') return true;
  
  // Rotas dinâmicas
  if (pathname.startsWith('/stories/')) return true;
  
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas - permitir acesso
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Rotas admin - verificar autenticação
  if (isAdminRoute(pathname)) {
    try {
      // Obter token do cookie ou header
      const token = request.cookies.get('auth-token')?.value;
      
      if (!token) {
        // Redirecionar para login se não autenticado
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verificar token no Firebase (simplificado - em produção usar verificação completa)
      // Por enquanto, apenas verificar se existe
      // TODO: Implementar verificação completa do token Firebase
      
      // Verificar se é admin
      // Por enquanto, vamos verificar no lado do servidor também
      // TODO: Implementar verificação completa de permissões
      
      return NextResponse.next();
    } catch (error) {
      // Erro na verificação - redirecionar para login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Outras rotas - permitir acesso por padrão
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

