import { MetadataRoute } from 'next';
import { client, studiosQuery } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch studios from Sanity
  let studioPages: MetadataRoute.Sitemap = [];
  try {
    const studios = await client.fetch(studiosQuery);
    studioPages = studios.map((studio: any) => ({
      url: `${baseUrl}/studios/${studio.slug?.current || studio.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching studios for sitemap:', error);
  }

  return [...staticPages, ...studioPages];
}
