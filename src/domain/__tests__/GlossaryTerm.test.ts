import { GlossaryTerm, CreateGlossaryTermDTO } from '../entities/GlossaryTerm';

const validDto: CreateGlossaryTermDTO = {
  term: 'Nix',
  category: 'character',
  shortDescription: 'Protagonista da Lenda de Nix.',
  fullDescription: 'Nix e um personagem central no universo de Pegriam...',
  aliases: ['O Escolhido'],
};

describe('GlossaryTerm Entity', () => {
  it('deve criar termo com dados validos', () => {
    const term = GlossaryTerm.create(validDto);
    expect(term.term).toBe('Nix');
    expect(term.category).toBe('character');
    expect(term.aliases).toEqual(['O Escolhido']);
    expect(term.id.startsWith('glossary-')).toBe(true);
  });

  it('deve retornar todos os nomes', () => {
    const term = GlossaryTerm.create(validDto);
    expect(term.getAllNames()).toEqual(['Nix', 'O Escolhido']);
  });

  it('deve rejeitar nome vazio', () => {
    expect(() => GlossaryTerm.create({ ...validDto, term: '' })).toThrow('Nome do termo e obrigatorio');
  });

  it('deve rejeitar descricao curta vazia', () => {
    expect(() => GlossaryTerm.create({ ...validDto, shortDescription: '' })).toThrow('Descricao curta e obrigatoria');
  });

  it('deve criar termo sem aliases', () => {
    const term = GlossaryTerm.create({ ...validDto, aliases: undefined });
    expect(term.aliases).toEqual([]);
  });
});
