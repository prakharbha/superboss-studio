import { client, eventsQuery } from '@/lib/sanity';
import EventsClient from './EventsClient';

// Always fetch fresh data (no caching)
export const revalidate = 0;

interface EventItem {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description?: string;
  eventType: string;
  filters: string[];
  image?: any;
  _imagePath?: string;
  _thumbnailPath?: string;
  _mediaType?: string;
}

async function getEvents() {
  try {
    const events = await client.fetch(eventsQuery, {}, { cache: 'no-store' });
    return events.map((event: any) => ({
      _id: event._id,
      id: event.id,
      title: event.title,
      slug: event.slug?.current || event.slug,
      description: event.description,
      eventType: event.eventType,
      filters: event.filters || [],
      image: event.image,
      _imagePath: event._imagePath,
      _thumbnailPath: event._thumbnailPath,
      _mediaType: event._mediaType || 'image',
    })) || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const eventsData = await getEvents();
  
  return <EventsClient eventsData={eventsData} />;
}
