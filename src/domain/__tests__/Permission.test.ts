import { Permission, User } from '../value-objects/Permission';
import { Email } from '../value-objects/Email';

function createUser(email: string, name?: string): User {
  return { id: 'test-id', email: Email.create(email), name };
}

describe('Permission Value Object', () => {
  it('deve identificar admin pelo email', () => {
    const admin = createUser('kontempler@gmail.com');
    expect(Permission.isAdmin(admin)).toBe(true);
  });

  it('nao deve identificar outro email como admin', () => {
    const user = createUser('normal@user.com');
    expect(Permission.isAdmin(user)).toBe(false);
  });

  it('admin pode acessar area administrativa', () => {
    const admin = createUser('kontempler@gmail.com');
    expect(Permission.canAccessAdmin(admin)).toBe(true);
  });

  it('usuario normal nao pode acessar admin', () => {
    const user = createUser('user@test.com');
    expect(Permission.canAccessAdmin(user)).toBe(false);
  });

  it('admin pode criar historias', () => {
    const admin = createUser('kontempler@gmail.com');
    expect(Permission.canCreateStory(admin)).toBe(true);
  });
});
