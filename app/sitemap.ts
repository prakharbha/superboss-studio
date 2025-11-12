import { MetadataRoute } from 'next';
import studiosData from '@/data/studios.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://superbossstudio.com';

  // Static pages
  const staticPages = [
    '',
    '/studios',
    '/equipment',
    '/props',
    '/book',
    '/rules',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic studio pages
  const studioPages = studiosData.map((studio) => ({
    url: `${baseUrl}/studios/${studio.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...studioPages];
}
