'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Filter, Play, X } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor } from '@/lib/sanity';

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

interface EventsClientProps {
  eventsData: EventItem[];
}

export default function EventsClient({ eventsData }: EventsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<EventItem | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique categories from filters
  const allCategories = Array.from(
    new Set(eventsData.flatMap(item => item.filters || []))
  ).sort();
  const categories = ['All', ...allCategories];

  const filteredItems = eventsData.filter(item => 
    selectedCategory === 'All' || (item.filters && item.filters.includes(selectedCategory))
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] bg-sb-grey">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/DSC09213-large.webp"
            alt="Events"
            fill
            className="object-cover"
            priority
            quality={75}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sb-black/70 to-sb-black/30"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">Events</h1>
            <p className="text-xl md:text-2xl text-white/90">
              Showcasing Our Creative Journey
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-sb-black mb-6 text-center">Event Gallery</h2>
              
              {/* Filter Toggle Button (Mobile) */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-sb-black text-white rounded-lg hover:bg-sb-grey-dark transition-colors"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filter by Category</span>
                </button>
              </div>

              {/* Category Filters */}
              {categories.length > 0 && (
                <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block mb-8`}>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsFilterOpen(false);
                        }}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                          selectedCategory === category
                            ? 'bg-sb-black text-white shadow-lg scale-105'
                            : 'bg-sb-grey-light text-sb-black hover:bg-sb-grey hover:scale-105'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results Count */}
              <p className="text-center text-sb-grey mb-8">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Gallery Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => {
                  // Determine image source - prioritize Sanity image, then _thumbnailPath, then _imagePath
                  let imageSrc = '/images/DSC09213-medium.webp'; // Default fallback
                  
                  if (item.image && item.image.asset && item.image.asset.url) {
                    // Use Sanity image if available
                    imageSrc = urlFor(item.image).width(400).height(400).url();
                  } else if (item._thumbnailPath) {
                    // Use thumbnail path from migration
                    imageSrc = item._thumbnailPath;
                  } else if (item._imagePath) {
                    // Use full image path as fallback
                    imageSrc = item._imagePath;
                  }

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                          <p className="text-sm text-white/80">{item.filters?.[0] || item.eventType}</p>
                        </div>
                      </div>
                      {item._mediaType === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-4 group-hover:bg-black/70 transition-colors">
                            <Play className="w-8 h-8 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-sb-grey">No items found in this category.</p>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 z-[70] bg-white hover:bg-sb-grey-light text-sb-black p-3 rounded-full transition-colors shadow-lg"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="relative aspect-video rounded-lg overflow-hidden bg-sb-grey">
                {selectedItem._mediaType === 'video' ? (
                  <div className="relative w-full h-full">
                    {(() => {
                      let imageSrc = selectedItem._imagePath || '/images/DSC09213-large.webp';
                      if (selectedItem.image && selectedItem.image.asset) {
                        imageSrc = urlFor(selectedItem.image).width(1200).height(800).url();
                      }
                      return (
                        <Image
                          src={imageSrc}
                          alt={selectedItem.title}
                          fill
                          className="object-cover"
                          sizes="90vw"
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="bg-white/20 hover:bg-white/30 rounded-full p-6 mb-4 inline-block transition-colors cursor-pointer">
                          <Play className="w-16 h-16 fill-white" />
                        </div>
                        <p className="text-xl font-semibold mb-2">Video Content</p>
                        <p className="text-sm text-white/80">Video will be available here</p>
                        <p className="text-xs text-white/60 mt-2">Click outside to close</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  (() => {
                    let imageSrc = selectedItem._imagePath || '/images/DSC09213-large.webp';
                    if (selectedItem.image && selectedItem.image.asset) {
                      imageSrc = urlFor(selectedItem.image).width(1200).height(800).url();
                    }
                    return (
                      <Image
                        src={imageSrc}
                        alt={selectedItem.title}
                        fill
                        className="object-contain"
                        sizes="90vw"
                      />
                    );
                  })()
                )}
              </div>
              
              <div className="mt-4 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
                <p className="text-white/80">{selectedItem.filters?.[0] || selectedItem.eventType}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

