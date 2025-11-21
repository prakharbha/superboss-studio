import { client, propsQuery } from '@/lib/sanity';
import PropsClient from './PropsClient';

// Always fetch fresh data (no caching)
export const revalidate = 0;

async function getProps() {
  try {
    const props = await client.fetch(propsQuery, {}, { cache: 'no-store' });
    return props.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      priceHalfDay: item.priceHalfDay,
      pricePerDay: item.pricePerDay,
      currency: item.currency,
      color: item.color,
      style: item.style,
      available: item.available !== false,
      image: item.image,
    })) || [];
  } catch (error) {
    console.error('Error fetching props:', error);
    return [];
  }
}

export default async function PropsPage() {
  const propsData = await getProps();
  
  return <PropsClient propsData={propsData} />;
}
