'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { Filter, Play, X } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { motion, AnimatePresence } from 'framer-motion';

// Event gallery items with categories
const eventItems = [
  // Fashion Shows
  { id: 1, title: 'Fashion Show 2024', category: 'Fashion Shows', type: 'image', src: '/images/DSC09213-large.webp', thumbnail: '/images/DSC09213-medium.webp' },
  { id: 2, title: 'Designer Launch', category: 'Fashion Shows', type: 'image', src: '/images/DSC09205-large.webp', thumbnail: '/images/DSC09205-medium.webp' },
  { id: 3, title: 'Runway Event', category: 'Fashion Shows', type: 'image', src: '/images/DSC09220-large.webp', thumbnail: '/images/DSC09220-medium.webp' },
  
  // Photo Shoots
  { id: 4, title: 'E-commerce Shoot', category: 'Photo Shoots', type: 'image', src: '/images/DSC09215-large.webp', thumbnail: '/images/DSC09215-medium.webp' },
  { id: 5, title: 'Product Photography', category: 'Photo Shoots', type: 'image', src: '/images/DSC09217-large.webp', thumbnail: '/images/DSC09217-medium.webp' },
  { id: 6, title: 'Lifestyle Session', category: 'Photo Shoots', type: 'image', src: '/images/DSC09221-large.webp', thumbnail: '/images/DSC09221-medium.webp' },
  { id: 7, title: 'Fashion Editorial', category: 'Photo Shoots', type: 'image', src: '/images/DSC09224-large.webp', thumbnail: '/images/DSC09224-medium.webp' },
  
  // Events
  { id: 8, title: 'Art Exhibition', category: 'Events', type: 'image', src: '/images/DSC09226-large.webp', thumbnail: '/images/DSC09226-medium.webp' },
  { id: 9, title: 'Launch Party', category: 'Events', type: 'image', src: '/images/DSC09229-large.webp', thumbnail: '/images/DSC09229-medium.webp' },
  { id: 10, title: 'Private Event', category: 'Events', type: 'image', src: '/images/DSC09230-large.webp', thumbnail: '/images/DSC09230-medium.webp' },
  { id: 11, title: 'Corporate Event', category: 'Events', type: 'image', src: '/images/DSC09240-large.webp', thumbnail: '/images/DSC09240-medium.webp' },
  
  // Music Videos
  { id: 12, title: 'Music Video Production', category: 'Music Videos', type: 'video', src: '/images/DSC09248-large.webp', thumbnail: '/images/DSC09248-medium.webp' },
  { id: 13, title: 'Artist Performance', category: 'Music Videos', type: 'video', src: '/images/DSC09250-large.webp', thumbnail: '/images/DSC09250-medium.webp' },
  { id: 14, title: 'Recording Session', category: 'Music Videos', type: 'video', src: '/images/DSC09260-large.webp', thumbnail: '/images/DSC09260-medium.webp' },
  
  // Workshops
  { id: 15, title: 'Photography Workshop', category: 'Workshops', type: 'image', src: '/images/DSC09263-large.webp', thumbnail: '/images/DSC09263-medium.webp' },
  { id: 16, title: 'Creative Workshop', category: 'Workshops', type: 'image', src: '/images/DSC09275-large.webp', thumbnail: '/images/DSC09275-medium.webp' },
  { id: 17, title: 'Production Workshop', category: 'Workshops', type: 'image', src: '/images/DSC09277-large.webp', thumbnail: '/images/DSC09277-medium.webp' },
  
  // Exhibitions
  { id: 18, title: 'Gallery Opening', category: 'Exhibitions', type: 'image', src: '/images/DSC09278-large.webp', thumbnail: '/images/DSC09278-medium.webp' },
  { id: 19, title: 'Art Installation', category: 'Exhibitions', type: 'image', src: '/images/DSC09282-large.webp', thumbnail: '/images/DSC09282-medium.webp' },
  { id: 20, title: 'Design Exhibition', category: 'Exhibitions', type: 'image', src: '/images/DSC09187-large.webp', thumbnail: '/images/DSC09187-medium.webp' },
];

const categories = ['All', ...Array.from(new Set(eventItems.map(item => item.category)))];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<typeof eventItems[0] | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredItems = eventItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
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

              {/* Results Count */}
              <p className="text-center text-sb-grey mb-8">
                Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300"
                  onClick={() => setSelectedItem(item)}
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-white/80">{item.category}</p>
                    </div>
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4 group-hover:bg-black/70 transition-colors">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredItems.length === 0 && (
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
                {selectedItem.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedItem.src}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                      sizes="90vw"
                    />
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
                  <Image
                    src={selectedItem.src}
                    alt={selectedItem.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                )}
              </div>
              
              <div className="mt-4 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
                <p className="text-white/80">{selectedItem.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

