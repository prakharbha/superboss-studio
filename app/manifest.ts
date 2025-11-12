import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SuperBoss Film Production & Studio',
    short_name: 'SuperBoss',
    description: 'Premium 16,000 sq ft studio space in Dubai for fashion, film, and creative productions',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo-black.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}

