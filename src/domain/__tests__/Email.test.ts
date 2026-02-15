import { Email } from '../value-objects/Email';

describe('Email Value Object', () => {
  it('deve criar email valido', () => {
    const email = Email.create('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('deve rejeitar email vazio', () => {
    expect(() => Email.create('')).toThrow();
  });

  it('deve rejeitar formato invalido', () => {
    expect(() => Email.create('invalid')).toThrow();
    expect(() => Email.create('@nodomain.com')).toThrow();
  });

  it('deve comparar emails case-insensitive', () => {
    const email1 = Email.create('Test@Example.com');
    const email2 = Email.create('test@example.com');
    expect(email1.equals(email2)).toBe(true);
  });

  it('deve converter para string', () => {
    const email = Email.create('user@test.com');
    expect(email.toString()).toBe('user@test.com');
  });
});
