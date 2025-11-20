import { client, equipmentQuery } from '@/lib/sanity';
import EquipmentClient from './EquipmentClient';

export const revalidate = 0; // Always fetch fresh data

async function getEquipment() {
  try {
    const equipment = await client.fetch(equipmentQuery, {}, {
      cache: 'no-store', // Don't cache, always fetch fresh
    });
    
    // Filter out equipment without images
    const equipmentWithImages = equipment.filter((item: any) => {
      return item.image && item.image.asset && item.image.asset.url;
    });
    
    return equipmentWithImages.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      description: item.description,
      pricePerHour: item.pricePerHour,
      pricePerDay: item.pricePerDay,
      currency: item.currency,
      specifications: item.specifications || [],
      available: item.available !== false,
      image: item.image?.asset?.url || null,
      imageAlt: item.image?.alt || item.name,
    })) || [];
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return [];
  }
}

export default async function EquipmentPage() {
  const equipmentData = await getEquipment();
  
  return <EquipmentClient equipmentData={equipmentData} />;
}
