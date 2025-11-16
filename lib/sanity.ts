import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or using the Token
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper function to get image URL with optimization
export function getImageUrl(source: SanityImageSource, width?: number, height?: number) {
  let url = builder.image(source);
  if (width) url = url.width(width);
  if (height) url = url.height(height);
  return url.url();
}

// GROQ Queries
export const studiosQuery = `*[_type == "studio"] | order(name asc) {
  _id,
  id,
  name,
  slug,
  size,
  unit,
  description,
  pricePerHour,
  pricePerDay,
  currency,
  features,
  suitableFor,
  images[] {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  video,
  location
}`;

export const studioBySlugQuery = `*[_type == "studio" && slug.current == $slug][0] {
  _id,
  id,
  name,
  slug,
  size,
  unit,
  description,
  pricePerHour,
  pricePerDay,
  currency,
  features,
  suitableFor,
  images[] {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  video,
  location
}`;

export const equipmentQuery = `*[_type == "equipment"] | order(name asc) {
  _id,
  id,
  name,
  category,
  description,
  pricePerHour,
  pricePerDay,
  currency,
  specifications,
  image {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  available
}`;

export const propsQuery = `*[_type == "prop"] | order(name asc) {
  _id,
  id,
  name,
  category,
  description,
  pricePerDay,
  currency,
  color,
  style,
  image {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  available
}`;

export const seoQuery = `*[_type == "seo"] {
  page,
  title,
  description,
  keywords,
  ogType,
  ogImage {
    asset->{
      _id,
      url
    }
  }
}`;

export const seoByPageQuery = `*[_type == "seo" && page == $page][0] {
  page,
  title,
  description,
  keywords,
  ogType,
  ogImage {
    asset->{
      _id,
      url
    }
  }
}`;

export const eventsQuery = `*[_type == "event"] | order(startDate desc) {
  _id,
  id,
  title,
  slug,
  description,
  eventType,
  startDate,
  endDate,
  location,
  capacity,
  status,
  featured,
  image {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  images[] {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  organizer,
  ticketInfo,
  tags,
  filters,
  _imagePath,
  _thumbnailPath,
  _mediaType
}`;

export const eventBySlugQuery = `*[_type == "event" && slug.current == $slug][0] {
  _id,
  id,
  title,
  slug,
  description,
  eventType,
  startDate,
  endDate,
  location,
  capacity,
  status,
  featured,
  image {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  images[] {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  organizer,
  ticketInfo,
  tags
}`;

export const upcomingEventsQuery = `*[_type == "event" && status == "upcoming" && startDate >= now()] | order(startDate asc) {
  _id,
  id,
  title,
  slug,
  description,
  eventType,
  startDate,
  endDate,
  location,
  capacity,
  status,
  featured,
  image {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  organizer,
  ticketInfo,
  tags
}`;

export const featuredEventsQuery = `*[_type == "event" && featured == true && status == "upcoming" && startDate >= now()] | order(startDate asc) {
  _id,
  id,
  title,
  slug,
  description,
  eventType,
  startDate,
  endDate,
  location,
  capacity,
  status,
  featured,
  image {
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  organizer,
  ticketInfo,
  tags
}`;

