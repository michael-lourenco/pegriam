/**
 * Implementação do Repositório de Purchases usando Supabase
 * 
 * Segue o padrão Repository para inversão de dependência.
 * Implementa IPurchaseRepository usando Supabase como persistência.
 */

import { IPurchaseRepository } from '@/domain/repositories/IPurchaseRepository';
import { Purchase, PurchaseId, PurchaseStatus } from '@/domain/entities/Purchase';
import { StoryId } from '@/domain/entities/Story';
import { getSupabaseClient } from '@/infrastructure/config/supabase.config';

interface PurchaseDocument {
  id: string;
  user_id: string;
  story_id: string;
  amount: number;
  status: PurchaseStatus;
  payment_provider: string;
  payment_external_id: string | null;
  created_at: string;
  confirmed_at: string | null;
  updated_at: string;
}

export class SupabasePurchaseRepository implements IPurchaseRepository {
  private readonly tableName = 'purchases';

  /**
   * Converter Purchase para formato do banco
   */
  private toDocument(purchase: Purchase): PurchaseDocument {
    return {
      id: purchase.id,
      user_id: purchase.userId,
      story_id: purchase.storyId,
      amount: purchase.amount,
      status: purchase.status,
      payment_provider: purchase.paymentProvider,
      payment_external_id: purchase.paymentExternalId,
      created_at: purchase.createdAt.toISOString(),
      confirmed_at: purchase.confirmedAt?.toISOString() ?? null,
      updated_at: purchase.updatedAt.toISOString(),
    };
  }

  /**
   * Converter documento do banco para Purchase
   */
  private toEntity(doc: PurchaseDocument): Purchase {
    return new Purchase(
      doc.id as PurchaseId,
      doc.user_id,
      doc.story_id as StoryId,
      Number(doc.amount),
      doc.status,
      doc.payment_provider,
      doc.payment_external_id,
      new Date(doc.created_at),
      doc.confirmed_at ? new Date(doc.confirmed_at) : null,
      new Date(doc.updated_at)
    );
  }

  async save(purchase: Purchase): Promise<void> {
    const supabase = getSupabaseClient();
    const document = this.toDocument(purchase);

    const { error } = await supabase
      .from(this.tableName)
      .insert(document);

    if (error) {
      throw new Error(`Erro ao salvar compra: ${error.message}`);
    }
  }

  async update(purchase: Purchase): Promise<void> {
    const supabase = getSupabaseClient();
    const document = this.toDocument(purchase);

    const { error } = await supabase
      .from(this.tableName)
      .update(document)
      .eq('id', purchase.id);

    if (error) {
      throw new Error(`Erro ao atualizar compra: ${error.message}`);
    }
  }

  async findById(id: PurchaseId): Promise<Purchase | null> {
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
      throw new Error(`Erro ao buscar compra: ${error.message}`);
    }

    return data ? this.toEntity(data as PurchaseDocument) : null;
  }

  async findByUserAndStory(userId: string, storyId: StoryId): Promise<Purchase | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('story_id', storyId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar compra do usuário: ${error.message}`);
    }

    return data ? this.toEntity(data as PurchaseDocument) : null;
  }

  async findByUserId(userId: string): Promise<Purchase[]> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erro ao buscar compras do usuário: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((doc) => this.toEntity(doc as PurchaseDocument));
  }

  async findByExternalId(externalId: string): Promise<Purchase | null> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('payment_external_id', externalId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Erro ao buscar compra por ID externo: ${error.message}`);
    }

    return data ? this.toEntity(data as PurchaseDocument) : null;
  }
}
