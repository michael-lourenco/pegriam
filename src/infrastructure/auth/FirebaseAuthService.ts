/**
 * Serviço de Autenticação usando Firebase Auth
 * 
 * Gerencia autenticação de usuários e sessões.
 */

import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/infrastructure/config/firebase.config';
import { Email } from '@/domain/value-objects/Email';
import { User } from '@/domain/value-objects/Permission';

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export class FirebaseAuthService {
  /**
   * Fazer login com email e senha
   */
  async signIn(email: string, password: string): Promise<User> {
    const auth = getFirebaseAuth();
    
    try {
      const emailVO = Email.create(email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.firebaseUserToDomainUser(userCredential.user);
    } catch (error: any) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }

  /**
   * Criar nova conta
   */
  async signUp(email: string, password: string, name?: string): Promise<User> {
    const auth = getFirebaseAuth();
    
    try {
      const emailVO = Email.create(email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      return this.firebaseUserToDomainUser(userCredential.user);
    } catch (error: any) {
      throw new Error(`Erro ao criar conta: ${error.message}`);
    }
  }

  /**
   * Fazer logout
   */
  async signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(`Erro ao fazer logout: ${error.message}`);
    }
  }

  /**
   * Enviar email de recuperação de senha
   */
  async resetPassword(email: string): Promise<void> {
    const auth = getFirebaseAuth();
    
    try {
      Email.create(email); // Validar email
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(`Erro ao enviar email de recuperação: ${error.message}`);
    }
  }

  /**
   * Atualizar nome do usuário
   */
  async updateUserName(name: string): Promise<User> {
    const auth = getFirebaseAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      throw new Error('Nenhum usuário autenticado');
    }

    try {
      await updateProfile(firebaseUser, { displayName: name });
      return this.firebaseUserToDomainUser(firebaseUser);
    } catch (error: any) {
      throw new Error(`Erro ao atualizar nome: ${error.message}`);
    }
  }

  /**
   * Obter usuário atual
   */
  getCurrentUser(): User | null {
    const auth = getFirebaseAuth();
    const firebaseUser = auth.currentUser;
    
    if (!firebaseUser) {
      return null;
    }
    
    return this.firebaseUserToDomainUser(firebaseUser);
  }

  /**
   * Observar mudanças no estado de autenticação
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const auth = getFirebaseAuth();
    
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(this.firebaseUserToDomainUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  }

  /**
   * Converter Firebase User para User do domínio
   */
  private firebaseUserToDomainUser(firebaseUser: FirebaseUser): User {
    const email = Email.create(firebaseUser.email || '');
    
    return {
      id: firebaseUser.uid,
      email,
      name: firebaseUser.displayName || undefined,
    };
  }
}

// Instância singleton
export const firebaseAuthService = new FirebaseAuthService();

