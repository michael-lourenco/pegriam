/**
 * Utilitários para rotas
 * 
 * Helper functions para criar URLs de rotas dinâmicas
 * compatíveis com o sistema de tipos do Next.js
 */

export function storyRoute(storyId: string): string {
  return `/stories/${storyId}`;
}

export function chapterRoute(storyId: string, chapterId: string): string {
  return `/stories/${storyId}/chapter/${chapterId}`;
}

export function adminStoryRoute(storyId: string): string {
  return `/admin/stories/${storyId}`;
}

export function adminStoryEditRoute(storyId: string): string {
  return `/admin/stories/${storyId}`;
}

