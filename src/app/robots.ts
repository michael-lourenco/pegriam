import { MetadataRoute } from 'next';
import { APP_URL } from '@/shared/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/minha-conta/', '/purchases/'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
