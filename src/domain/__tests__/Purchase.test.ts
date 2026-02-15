import { Purchase, CreatePurchaseDTO } from '../entities/Purchase';
import { StoryId } from '../entities/Story';

const validDto: CreatePurchaseDTO = {
  userId: 'user-123',
  storyId: 'story-456' as StoryId,
  amount: 2990,
  paymentProvider: 'mock',
};

describe('Purchase Entity', () => {
  it('deve criar compra com status pending', () => {
    const purchase = Purchase.create(validDto);
    expect(purchase.status).toBe('pending');
    expect(purchase.userId).toBe(validDto.userId);
    expect(purchase.storyId).toBe(validDto.storyId);
    expect(purchase.amount).toBe(2990);
    expect(purchase.id.startsWith('purchase-')).toBe(true);
  });

  it('deve associar external id', () => {
    const purchase = Purchase.create(validDto);
    const withExternal = purchase.withExternalId('ext-abc');
    expect(withExternal.paymentExternalId).toBe('ext-abc');
    expect(withExternal.status).toBe('pending');
  });

  it('deve confirmar compra pendente', () => {
    const purchase = Purchase.create(validDto);
    const confirmed = purchase.confirm();
    expect(confirmed.status).toBe('confirmed');
    expect(confirmed.confirmedAt).toBeDefined();
    expect(confirmed.isAccessGranted()).toBe(true);
  });

  it('nao deve confirmar compra ja confirmada', () => {
    const purchase = Purchase.create(validDto);
    const confirmed = purchase.confirm();
    expect(() => confirmed.confirm()).toThrow("status 'confirmed'");
  });

  it('deve falhar compra pendente', () => {
    const purchase = Purchase.create(validDto);
    const failed = purchase.fail();
    expect(failed.status).toBe('failed');
    expect(failed.isAccessGranted()).toBe(false);
  });

  it('deve reembolsar compra confirmada', () => {
    const purchase = Purchase.create(validDto);
    const confirmed = purchase.confirm();
    const refunded = confirmed.refund();
    expect(refunded.status).toBe('refunded');
    expect(refunded.isAccessGranted()).toBe(false);
  });

  it('nao deve reembolsar compra nao confirmada', () => {
    const purchase = Purchase.create(validDto);
    expect(() => purchase.refund()).toThrow('Só é possível reembolsar compras confirmadas');
  });

  it('deve rejeitar userId vazio', () => {
    expect(() => Purchase.create({ ...validDto, userId: '' })).toThrow('ID do usuário é obrigatório');
  });

  it('deve rejeitar valor negativo', () => {
    expect(() => Purchase.create({ ...validDto, amount: -1 })).toThrow('Valor da compra não pode ser negativo');
  });
});
