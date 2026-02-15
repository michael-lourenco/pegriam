/**
 * Container de Injeção de Dependências
 * 
 * Centraliza a criação de repositórios e serviços.
 * Implementa o padrão Singleton para reutilizar instâncias
 * e facilitar a troca de implementações (ex: mock → produção).
 * 
 * Uso:
 *   const { storyRepository } = Container.getRepositories();
 *   const { paymentService } = Container.getServices();
 */

import { IStoryRepository } from '@/domain/repositories/IStoryRepository';
import { IChapterRepository } from '@/domain/repositories/IChapterRepository';
import { IChapterRenderedRepository } from '@/domain/repositories/IChapterRenderedRepository';
import { IPurchaseRepository } from '@/domain/repositories/IPurchaseRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { IGlossaryRepository } from '@/domain/repositories/IGlossaryRepository';
import { IPaymentService } from '@/domain/services/IPaymentService';

import {
  SupabaseStoryRepository,
  SupabaseChapterRepository,
  SupabaseChapterRenderedRepository,
  SupabasePurchaseRepository,
  SupabaseUserRepository,
  SupabaseGlossaryRepository,
} from '@/infrastructure/database/supabase';
import { MockPaymentService } from '@/infrastructure/payment/MockPaymentService';

export interface Repositories {
  storyRepository: IStoryRepository;
  chapterRepository: IChapterRepository;
  chapterRenderedRepository: IChapterRenderedRepository;
  purchaseRepository: IPurchaseRepository;
  userRepository: IUserRepository;
  glossaryRepository: IGlossaryRepository;
}

export interface Services {
  paymentService: IPaymentService;
}

class DIContainer {
  private repositories: Repositories | null = null;
  private services: Services | null = null;

  getRepositories(): Repositories {
    if (!this.repositories) {
      this.repositories = {
        storyRepository: new SupabaseStoryRepository(),
        chapterRepository: new SupabaseChapterRepository(),
        chapterRenderedRepository: new SupabaseChapterRenderedRepository(),
        purchaseRepository: new SupabasePurchaseRepository(),
        userRepository: new SupabaseUserRepository(),
        glossaryRepository: new SupabaseGlossaryRepository(),
      };
    }
    return this.repositories;
  }

  getServices(): Services {
    if (!this.services) {
      this.services = {
        paymentService: new MockPaymentService(),
      };
    }
    return this.services;
  }

  /**
   * Resetar instâncias (útil para testes)
   */
  reset(): void {
    this.repositories = null;
    this.services = null;
  }
}

export const Container = new DIContainer();
