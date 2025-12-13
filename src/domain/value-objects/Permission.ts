/**
 * Value Object: Permission
 * 
 * Gerencia permissões e autorização no sistema.
 * Define quem pode fazer o quê.
 */

import { Email } from './Email';

export interface User {
  id: string;
  email: Email;
  name?: string;
}

export class Permission {
  private static readonly ADMIN_EMAIL = 'kontempler@gmail.com';

  /**
   * Verificar se o usuário é admin
   */
  static isAdmin(user: User): boolean {
    return user.email.getValue().toLowerCase() === this.ADMIN_EMAIL.toLowerCase();
  }

  /**
   * Verificar se o usuário pode criar histórias
   */
  static canCreateStory(user: User): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode editar uma história
   */
  static canEditStory(user: User, storyId: string): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode deletar uma história
   */
  static canDeleteStory(user: User, storyId: string): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode criar capítulos
   */
  static canCreateChapter(user: User, storyId: string): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode editar um capítulo
   */
  static canEditChapter(user: User, chapterId: string): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode deletar um capítulo
   */
  static canDeleteChapter(user: User, chapterId: string): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode editar informações do mundo
   */
  static canEditWorld(user: User): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode criar personagens
   */
  static canCreateCharacter(user: User): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode criar equipamentos
   */
  static canCreateEquipment(user: User): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode criar itens únicos
   */
  static canCreateItem(user: User): boolean {
    return this.isAdmin(user);
  }

  /**
   * Verificar se o usuário pode acessar área administrativa
   */
  static canAccessAdmin(user: User): boolean {
    return this.isAdmin(user);
  }
}


