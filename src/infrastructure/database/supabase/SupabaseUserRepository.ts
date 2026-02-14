/**
 * Implementação do Repositório de Users usando Supabase
 * 
 * Persiste dados de usuários do Firebase Auth localmente no Supabase.
 * Garante que todo usuário autenticado tenha um registro na tabela users.
 */

import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/value-objects/Permission';
import { Email } from '@/domain/value-objects/Email';
import { getSupabaseClient } from '@/infrastructure/config/supabase.config';

interface UserDocument {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
}

export class SupabaseUserRepository implements IUserRepository {
  private readonly tableName = 'users';

  /**
   * Converter User do domínio para formato do banco
   */
  private toDocument(user: User): Omit<UserDocument, 'created_at'> {
    return {
      id: user.id,
      email: user.email.getValue(),
      name: user.name ?? null,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Converter documento do banco para User do domínio
   */
  private toEntity(doc: UserDocument): User {
    return {
      id: doc.id,
      email: Email.create(doc.email),
      name: doc.name ?? undefined,
    };
  }

  async upsert(user: User): Promise<void> {
    const supabase = getSupabaseClient();
    const document = this.toDocument(user);

    const { error } = await supabase
      .from(this.tableName)
      .upsert(
        {
          ...document,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Erro ao salvar usuário no Supabase:', error.message);
      // Não lança erro para não bloquear o fluxo de autenticação
      // O usuário já está autenticado no Firebase Auth
    }
  }

  async findById(id: string): Promise<User | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }

    return data ? this.toEntity(data as UserDocument) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }

    return data ? this.toEntity(data as UserDocument) : null;
  }

  async exists(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('id')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw new Error(`Erro ao verificar existência do usuário: ${error.message}`);
    }

    return !!data;
  }
}
