import { client, propsQuery } from '@/lib/sanity';
import PropsClient from './PropsClient';

async function getProps() {
  try {
    const props = await client.fetch(propsQuery);
    return props.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      pricePerDay: item.pricePerDay,
      currency: item.currency,
      color: item.color,
      style: item.style,
      available: item.available !== false,
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
