import { Metadata } from 'next';
import { client, studiosQuery } from '@/lib/sanity';
import TestHomeClient from './TestHomeClient';

export const metadata: Metadata = {
  title: 'Test Homepage - SuperBoss Studio',
  description: 'Test page with video background banner',
};

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

export default async function TestPage() {
  const studiosData = await getStudios();
  
  return <TestHomeClient studiosData={studiosData} />;
}

