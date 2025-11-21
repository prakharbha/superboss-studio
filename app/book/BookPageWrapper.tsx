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
      studios: studios
        .map((studio: any) => ({
          id: studio.id,
          name: studio.name,
          slug: studio.slug?.current || studio.slug,
          size: studio.size,
          unit: studio.unit,
          description: studio.description,
          pricePerHour: studio.pricePerHour,
          price2Hours: studio.price2Hours,
          price4Hours: studio.price4Hours,
          price6Hours: studio.price6Hours,
          price8Hours: studio.price8Hours || studio.pricePerDay,
          pricePerDay: studio.pricePerDay,
          currency: studio.currency,
        }))
        .sort((a, b) => (a.pricePerHour || 0) - (b.pricePerHour || 0)), // Sort by price per hour in ascending order
      equipment: equipment.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        pricePerHour: item.pricePerHour,
        pricePerDay: item.pricePerDay,
        currency: item.currency,
        available: item.available !== false,
        image: item.image,
      })),
      props: props.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        priceHalfDay: item.priceHalfDay,
        pricePerDay: item.pricePerDay,
        currency: item.currency,
        available: item.available !== false,
        image: item.image,
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

