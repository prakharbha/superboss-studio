# Image Usage Guide

This document describes how images are distributed throughout the SuperBoss Studio website.

## Image Optimization

All images from the `/images` folder have been optimized and converted to WebP format with multiple sizes:
- **Banner images**: Desktop (1920x1080) and Mobile (768x1024) versions
- **Other images**: Large (1920px), Medium (1280px), and Small (768px) versions

Optimized images are stored in `/public/images/`.

## Homepage (`/`)

### Hero Section - Background Slider
- **home-banner-1.webp** - First slide
- **home-banner-2.webp** - Second slide
- Rotates every 6 seconds with smooth fade transitions
- Rotating text: "Ideas", "Visions", "Dreams", "Stories", "Concepts", "Creations"

### CTA Section
- **DSC09230-large.webp** - Background image with dark overlay

## Studios Page (`/studios`)

### Hero Section
- **DSC09224-large.webp** - Background image with dark overlay

## Equipment Page (`/equipment`)

### Hero Section
- **DSC09277-large.webp** - Background image with dark overlay

## Props Page (`/props`)

### Hero Section
- **DSC09263-large.webp** - Background image with dark overlay

## Contact Page (`/contact`)

### Hero Section
- **DSC09221-large.webp** - Background image with dark overlay

## Available Images for Future Use

The following optimized images are available for additional sections or pages:

- DSC09187-large.webp / medium / small
- DSC09190-Pano-large.webp / medium / small
- DSC09198-large.webp / medium / small
- DSC09200-large.webp / medium / small
- DSC09202-large.webp / medium / small
- DSC09205-large.webp / medium / small
- DSC09213-large.webp / medium / small
- DSC09215-large.webp / medium / small
- DSC09217-large.webp / medium / small
- DSC09220-large.webp / medium / small
- DSC09226-large.webp / medium / small
- DSC09229-large.webp / medium / small
- DSC09240-large.webp / medium / small
- DSC09248-large.webp / medium / small
- DSC09250-large.webp / medium / small
- DSC09260-large.webp / medium / small
- DSC09275-large.webp / medium / small
- DSC09278-large.webp / medium / small
- DSC09282-large.webp / medium / small

## Components Created

### BackgroundSlider Component
Location: `/components/BackgroundSlider.tsx`

Features:
- Automatic image rotation with configurable interval
- Smooth fade transitions between images
- Dark overlay for better text readability
- Optimized with Next.js Image component

Usage:
```tsx
<BackgroundSlider 
  images={['/images/image1.webp', '/images/image2.webp']}
  interval={6000}
/>
```

### RotatingText Component
Location: `/components/RotatingText.tsx`

Features:
- Smooth text rotation with fade animations
- Configurable word list and interval
- Framer Motion animations

Usage:
```tsx
<RotatingText 
  words={['Ideas', 'Visions', 'Dreams']}
  interval={2500}
/>
```

## Performance Optimizations

1. **WebP Format**: All images converted to WebP for ~30% smaller file sizes
2. **Responsive Images**: Multiple sizes generated for different screen sizes
3. **Lazy Loading**: Images use Next.js Image component for automatic lazy loading
4. **Priority Loading**: Hero images marked as priority for faster LCP
5. **Quality**: Set to 85% for optimal balance between quality and file size

## Re-optimization

To re-optimize images in the future, run:
```bash
node scripts/optimize-images.js
```

This will process all JPG/JPEG/PNG files in the `/images` folder and output optimized WebP versions to `/public/images/`.

