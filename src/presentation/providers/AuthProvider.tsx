/**
 * Provider de Autenticação React
 * 
 * Gerencia o estado de autenticação globalmente na aplicação.
 * Sincroniza o usuário no Supabase (tabela users) sempre que
 * houver autenticação — garante que todo usuário do Firebase Auth
 * tenha um registro correspondente no banco local.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseAuthService, AuthState } from '@/infrastructure/auth/FirebaseAuthService';
import { SupabaseUserRepository } from '@/infrastructure/database/supabase';
import { User } from '@/domain/value-objects/Permission';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Sincroniza o usuário do Firebase Auth com a tabela users do Supabase.
 * Executa silenciosamente — não bloqueia o fluxo de autenticação.
 */
async function syncUserToDatabase(user: User): Promise<void> {
  try {
    const userRepository = new SupabaseUserRepository();
    await userRepository.upsert(user);
  } catch (error) {
    console.error('Erro ao sincronizar usuário no banco:', error);
    // Não bloqueia o fluxo — o usuário já está autenticado no Firebase
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Observar mudanças no estado de autenticação
    const unsubscribe = firebaseAuthService.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);

      // Sincronizar com Supabase sempre que o estado mudar para logado
      if (authUser) {
        syncUserToDatabase(authUser);
      }
    });

    // Verificar usuário atual imediatamente (pode retornar null se ainda não carregou)
    const currentUser = firebaseAuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
      syncUserToDatabase(currentUser);
    }

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const authenticatedUser = await firebaseAuthService.signIn(email, password);
      setUser(authenticatedUser);
      await syncUserToDatabase(authenticatedUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const newUser = await firebaseAuthService.signUp(email, password, name);
      setUser(newUser);
      await syncUserToDatabase(newUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseAuthService.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await firebaseAuthService.resetPassword(email);
  };

  const updateName = async (name: string) => {
    try {
      const updatedUser = await firebaseAuthService.updateUserName(name);
      setUser(updatedUser);
      await syncUserToDatabase(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
