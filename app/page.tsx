import { client, studiosQuery } from '@/lib/sanity';
import HomeClient from './HomeClient';

async function getStudios() {
  try {
    const studios = await client.fetch(studiosQuery);
    // Transform Sanity data to match expected format
    return studios.map((studio: any) => ({
      id: studio.id,
      name: studio.name,
      slug: studio.slug?.current || studio.slug,
      size: studio.size,
      unit: studio.unit,
      description: studio.description,
    })) || [];
  } catch (error) {
    console.error('Error fetching studios:', error);
    return [];
  }
}

export default async function Home() {
  const studiosData = await getStudios();
  
  return <HomeClient studiosData={studiosData} />;
}
