/**
 * Value Object: Email
 * 
 * Representa um endereço de email válido.
 */

export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly value: string) {
    this.validate();
  }

  /**
   * Criar instância de Email
   */
  static create(email: string): Email {
    return new Email(email);
  }

  /**
   * Obter valor do email
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Verificar se é igual a outro email
   */
  equals(other: Email): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  /**
   * Validação do formato de email
   */
  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('Email não pode ser vazio');
    }

    if (!Email.EMAIL_REGEX.test(this.value)) {
      throw new Error('Formato de email inválido');
    }

    if (this.value.length > 255) {
      throw new Error('Email não pode ter mais de 255 caracteres');
    }
  }

  /**
   * Converter para string
   */
  toString(): string {
    return this.value;
  }
}


