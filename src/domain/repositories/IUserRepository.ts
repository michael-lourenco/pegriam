/**
 * Interface de Repositório: IUserRepository
 * 
 * Define o contrato para persistência de Users no banco de dados.
 * Os dados de autenticação ficam no Firebase Auth;
 * esta interface gerencia o registro local do usuário no Supabase.
 */

import { User } from '../value-objects/Permission';

export interface IUserRepository {
  /**
   * Salvar ou atualizar um usuário (upsert)
   * Usado após signup e login para garantir sincronização
   */
  upsert(user: User): Promise<void>;

  /**
   * Buscar usuário por ID (Firebase UID)
   */
  findById(id: string): Promise<User | null>;

  /**
   * Buscar usuário por email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Verificar se o usuário existe no banco local
   */
  exists(id: string): Promise<boolean>;
}
