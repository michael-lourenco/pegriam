/**
 * Constantes centralizadas do projeto
 * 
 * Evita strings hardcoded espalhadas pelo código.
 * Altere aqui para refletir em toda a aplicação.
 */

export const APP_NAME = 'Contos de Pegriam';
export const APP_DESCRIPTION = 'Histórias épicas do Bardo Multiversal — uma experiência de leitura imersiva com glossário interativo e sistema freemium.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pegriam.com';
export const APP_AUTHOR = 'Pegriam';

export const SEO = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  ogImage: `${APP_URL}/og-image.png`,
  twitterHandle: '@contospegriam',
};

export const ROUTES = {
  home: '/',
  stories: '/stories',
  story: (id: string) => `/stories/${id}`,
  chapter: (storyId: string, chapterId: string) => `/stories/${storyId}/chapter/${chapterId}`,
  checkout: (storyId: string) => `/stories/${storyId}/checkout`,
  purchaseSuccess: (storyId: string) => `/stories/${storyId}/purchase-success`,
  glossario: '/glossario',
  glossarioTerm: (termId: string) => `/glossario/${termId}`,
  sobre: '/sobre',
  beta: '/beta',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  minhaConta: '/minha-conta',
  biblioteca: '/minha-conta/biblioteca',
  configuracoes: '/minha-conta/configuracoes',
  admin: '/admin',
  adminStories: '/admin/stories',
  adminStory: (id: string) => `/admin/stories/${id}`,
  adminNewStory: '/admin/stories/new',
} as const;

export const READING = {
  wordsPerMinute: 200,
  defaultFontSize: 18,
  minFontSize: 14,
  maxFontSize: 24,
  fontSizeStep: 2,
  defaultLineHeight: 1.8,
  minLineHeight: 1.4,
  maxLineHeight: 2.4,
  lineHeightStep: 0.2,
  maxContentWidth: 720,
} as const;

export const PAYMENT = {
  provider: 'mock',
  currency: 'BRL',
  currencySymbol: 'R$',
} as const;

export const GLOSSARY_CATEGORIES = {
  character: 'Personagens',
  location: 'Lugares',
  magic: 'Magia',
  object: 'Objetos',
  creature: 'Criaturas',
  organization: 'Organizações',
  concept: 'Conceitos',
} as const;

export type GlossaryCategory = keyof typeof GLOSSARY_CATEGORIES;
