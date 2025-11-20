import { client, equipmentQuery } from '@/lib/sanity';
import EquipmentClient from './EquipmentClient';

async function getEquipment() {
  try {
    const equipment = await client.fetch(equipmentQuery);
    return equipment.map((item: any) => ({
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
