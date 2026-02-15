'use client';

/**
 * Hook de Analytics
 * 
 * Estrutura preparada para integracao com Google Analytics 4 ou similar.
 * Atualmente loga eventos no console em desenvolvimento.
 * 
 * Para ativar GA4:
 * 1. Adicione o script do GA4 no layout.tsx
 * 2. Substitua as chamadas aqui por window.gtag(...)
 */

type AnalyticsEvent =
  | { name: 'page_view'; params: { page_path: string } }
  | { name: 'chapter_started'; params: { story_id: string; chapter_id: string; chapter_number: number } }
  | { name: 'chapter_completed'; params: { story_id: string; chapter_id: string } }
  | { name: 'glossary_term_viewed'; params: { term_id: string; term_name: string } }
  | { name: 'purchase_initiated'; params: { story_id: string; amount: number } }
  | { name: 'purchase_completed'; params: { story_id: string; amount: number } }
  | { name: 'pdf_download'; params: { story_id: string } }
  | { name: 'search_performed'; params: { query: string; results_count: number } }
  | { name: 'theme_changed'; params: { theme: string } }
  | { name: 'reading_settings_changed'; params: { setting: string; value: string } };

function sendEvent(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug('[Analytics]', event.name, event.params);
  }

  // GA4 integration point
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as any).gtag('event', event.name, event.params);
  }
}

export function useAnalytics() {
  return {
    trackPageView: (path: string) => sendEvent({ name: 'page_view', params: { page_path: path } }),
    trackChapterStarted: (storyId: string, chapterId: string, chapterNumber: number) =>
      sendEvent({ name: 'chapter_started', params: { story_id: storyId, chapter_id: chapterId, chapter_number: chapterNumber } }),
    trackChapterCompleted: (storyId: string, chapterId: string) =>
      sendEvent({ name: 'chapter_completed', params: { story_id: storyId, chapter_id: chapterId } }),
    trackGlossaryTermViewed: (termId: string, termName: string) =>
      sendEvent({ name: 'glossary_term_viewed', params: { term_id: termId, term_name: termName } }),
    trackPurchaseInitiated: (storyId: string, amount: number) =>
      sendEvent({ name: 'purchase_initiated', params: { story_id: storyId, amount } }),
    trackPurchaseCompleted: (storyId: string, amount: number) =>
      sendEvent({ name: 'purchase_completed', params: { story_id: storyId, amount } }),
    trackPdfDownload: (storyId: string) =>
      sendEvent({ name: 'pdf_download', params: { story_id: storyId } }),
    trackSearch: (query: string, resultsCount: number) =>
      sendEvent({ name: 'search_performed', params: { query, results_count: resultsCount } }),
    trackThemeChanged: (theme: string) =>
      sendEvent({ name: 'theme_changed', params: { theme } }),
    trackReadingSettingsChanged: (setting: string, value: string) =>
      sendEvent({ name: 'reading_settings_changed', params: { setting, value } }),
  };
}
