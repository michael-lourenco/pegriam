import { MetadataRoute } from 'next';
import { SupabaseStoryRepository, SupabaseChapterRepository } from '@/infrastructure/database/supabase';
import { APP_URL } from '@/shared/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = APP_URL;

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/stories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/glossario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/beta`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const storyRepo = new SupabaseStoryRepository();
    const chapterRepo = new SupabaseChapterRepository();
    const stories = await storyRepo.findByStatus('publishing');

    for (const story of stories) {
      dynamicPages.push({
        url: `${baseUrl}/stories/${story.id}`,
        lastModified: story.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      const chapters = await chapterRepo.findByStoryId(story.id);
      for (const chapter of chapters) {
        if (chapter.isFree) {
          dynamicPages.push({
            url: `${baseUrl}/stories/${story.id}/chapter/${chapter.id}`,
            lastModified: chapter.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (error) {
    console.error('Erro ao gerar sitemap dinamico:', error);
  }

  return [...staticPages, ...dynamicPages];
}
