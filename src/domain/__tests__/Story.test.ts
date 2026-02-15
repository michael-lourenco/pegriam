import { Story, CreateStoryDTO } from '../entities/Story';

const validDto: CreateStoryDTO = {
  title: 'A Lenda de Nix',
  description: 'Uma historia epica sobre o multiverso.',
  author: 'Pegriam',
  status: 'draft',
  freeChapters: 2,
  pdfPrice: 2990,
  tags: ['fantasia', 'epico'],
};

describe('Story Entity', () => {
  it('deve criar historia com dados validos', () => {
    const story = Story.create(validDto);
    expect(story.title).toBe(validDto.title);
    expect(story.author).toBe(validDto.author);
    expect(story.status).toBe('draft');
    expect(story.id).toBeDefined();
    expect(story.id.startsWith('story-')).toBe(true);
  });

  it('deve rejeitar titulo vazio', () => {
    expect(() => Story.create({ ...validDto, title: '' })).toThrow('Título da história é obrigatório');
  });

  it('deve rejeitar titulo muito longo', () => {
    expect(() => Story.create({ ...validDto, title: 'a'.repeat(201) })).toThrow('Título não pode ter mais de 200 caracteres');
  });

  it('deve rejeitar descricao vazia', () => {
    expect(() => Story.create({ ...validDto, description: '' })).toThrow('Descrição da história é obrigatória');
  });

  it('deve rejeitar preco negativo', () => {
    expect(() => Story.create({ ...validDto, pdfPrice: -1 })).toThrow('Preço do PDF não pode ser negativo');
  });

  it('deve publicar rascunho', () => {
    const story = Story.create(validDto);
    const published = story.publish();
    expect(published.status).toBe('publishing');
  });

  it('deve completar historia', () => {
    const story = Story.create(validDto);
    const completed = story.complete();
    expect(completed.status).toBe('completed');
  });

  it('nao deve publicar historia ja completa', () => {
    const story = Story.create(validDto);
    const completed = story.complete();
    expect(() => completed.publish()).toThrow('já está completa');
  });

  it('deve rejeitar mais de 10 tags', () => {
    const tags = Array.from({ length: 11 }, (_, i) => `tag${i}`);
    expect(() => Story.create({ ...validDto, tags })).toThrow('Máximo de 10 tags');
  });
});
