import { client, studiosQuery, equipmentQuery, propsQuery } from '@/lib/sanity';
import BookingForm from '@/components/booking/BookingForm';

async function getBookingData() {
  try {
    const [studios, equipment, props] = await Promise.all([
      client.fetch(studiosQuery),
      client.fetch(equipmentQuery),
      client.fetch(propsQuery),
    ]);

    return {
      studios: studios.map((studio: any) => ({
        id: studio.id,
        name: studio.name,
        slug: studio.slug?.current || studio.slug,
        size: studio.size,
        unit: studio.unit,
        description: studio.description,
        pricePerHour: studio.pricePerHour,
        pricePerDay: studio.pricePerDay,
        currency: studio.currency,
      })),
      equipment: equipment.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        pricePerHour: item.pricePerHour,
        pricePerDay: item.pricePerDay,
        currency: item.currency,
        available: item.available !== false,
      })),
      props: props.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        pricePerDay: item.pricePerDay,
        currency: item.currency,
        available: item.available !== false,
      })),
    };
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return {
      studios: [],
      equipment: [],
      props: [],
    };
  }
}

export default async function BookPageWrapper() {
  const bookingData = await getBookingData();
  
  return <BookingForm {...bookingData} />;
}

