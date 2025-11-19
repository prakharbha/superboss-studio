// Studio image mappings based on slug
export const getStudioImages = (slug: string): string[] => {
  const imageMap: Record<string, string[]> = {
    'boss-unit': [
      '/images/studios/boss-unit-1.webp',
      '/images/studios/boss-unit-2.webp',
    ],
    'boss-frame': [
      '/images/studios/boss-frame-1.webp',
      '/images/studios/boss-frame-2.webp',
    ],
    'boss-cell': [
      '/images/studios/boss-cell-1.webp',
      '/images/studios/boss-cell-2.webp',
    ],
    'super-feast': [
      '/images/studios/super-feast-1.webp',
    ],
  };

  return imageMap[slug] || ['/images/DSC09213-medium.webp']; // Default fallback
};

export const getStudioMainImage = (slug: string): string => {
  const images = getStudioImages(slug);
  return images[0];
};

