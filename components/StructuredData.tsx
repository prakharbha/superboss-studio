import { client, seoQuery } from '@/lib/sanity';

async function getStructuredData() {
  try {
    const seoData = await client.fetch(seoQuery);
    const defaultSeo = seoData.find((item: any) => item.page === '/');
    
    // Default structured data if not found in Sanity
    const defaultData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'SuperBoss Film Production & Studio',
      description: 'Built across 16,000 sq ft, SuperBoss Studio blends artistry and architectural excellence. Professional photography studios, equipment rental, and creative spaces in Dubai.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Umm Ramool, St. 17, Warehouse No. 4',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.2318,
        longitude: 55.3537,
      },
      url: 'https://superbossstudio.com',
      telephone: '+971561561570',
      email: 'info@superbossstudio.com',
      priceRange: 'AED 250 - AED 7500',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '22:00',
      },
      sameAs: [
        'https://www.instagram.com/superbossproduction',
      ],
    };
    
    return defaultData;
  } catch (error) {
    console.error('Error fetching structured data:', error);
    // Return default structured data on error
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'SuperBoss Film Production & Studio',
      description: 'Professional photography studios, equipment rental, and creative spaces in Dubai.',
      url: 'https://superbossstudio.com',
    };
  }
}

export default async function StructuredData() {
  const structuredData = await getStructuredData();
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
