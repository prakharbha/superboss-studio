'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export default function ImageGallery({
  images,
  title = 'Latest Events',
  subtitle = 'Showcasing Our Creative Journey',
  viewAllLink = '/events',
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setSelectedIndex((prevIndex) => {
      if (prevIndex === null) return null;
      
      if (direction === 'prev') {
        return (prevIndex - 1 + images.length) % images.length;
      } else {
        return (prevIndex + 1) % images.length;
      }
    });
  }, [images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, navigateImage, closeLightbox]);

  return (
    <>
      <section className="py-5 bg-gradient-to-b from-white to-sb-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-sb-black mb-4">
                {title}
              </h2>
              <p className="text-lg text-sb-grey mb-8">{subtitle}</p>
              <div className="w-24 h-1 bg-sb-black mx-auto"></div>
            </div>
          </AnimatedSection>

          {/* Gallery Grid */}
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="w-8 h-0.5 bg-white mb-2 transform group-hover:translate-x-2 transition-transform"></div>
                      <p className="text-white text-sm font-medium">View Full Image</p>
                    </div>
                  </div>
                  {/* Subtle border on hover */}
                  <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 transition-all duration-300 rounded-lg"></div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* View All Button */}
          <AnimatedSection delay={0.4}>
            <div className="text-center">
              <Link
                href={viewAllLink}
                className="inline-flex items-center space-x-2 px-8 py-4 bg-sb-black text-white text-lg font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>View All Events</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-6 z-[110] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedIndex !== null && images[selectedIndex] && (
                <>
                  <div className="relative w-full flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '85vh' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[selectedIndex].src}
                      alt={images[selectedIndex].alt || 'Gallery image'}
                      className="object-contain max-w-full max-h-[85vh]"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  </div>
                  
                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm z-[120]">
                      <span className="text-sm">
                        {selectedIndex + 1} / {images.length}
                      </span>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

