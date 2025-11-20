'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, ChevronDown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { formatCurrency } from '@/lib/utils';

interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  currency: string;
  specifications: string[];
  available: boolean;
  image?: string | null;
  imageAlt?: string;
}

interface EquipmentClientProps {
  equipmentData: Equipment[];
}

export default function EquipmentClient({ equipmentData }: EquipmentClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(equipmentData.map((item) => item.category)))];

  // Filter equipment
  const filteredEquipment = equipmentData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/DSC09277-large.webp"
            alt="Equipment background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-sb-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">Equipment Rental</h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
              Professional photography and videography equipment for your production needs. All
              prices in AED.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-sb-grey-light sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Header - Always Visible */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full py-4 flex items-center justify-between text-sb-black hover:text-sb-grey transition-colors"
          >
            <span className="font-semibold text-lg">Filters & Search</span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isFilterOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Collapsible Filter Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isFilterOpen ? 'max-h-96 pb-6' : 'max-h-0'
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sb-grey w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-sb-black text-white'
                        : 'bg-sb-grey-light text-sb-black hover:bg-sb-grey'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-sb-grey">No equipment found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEquipment.map((item, index) => (
                <div key={item.id} className="bg-white border border-sb-grey-light rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="aspect-[4/3] bg-sb-grey-light relative overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.imageAlt || item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-sb-grey">
                            <div className="text-5xl mb-2">📷</div>
                            <p className="text-xs">{item.category}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-sb-grey uppercase tracking-wide">
                          {item.category}
                        </span>
                        <h3 className="text-xl font-bold text-sb-black mt-1">{item.name}</h3>
                      </div>

                      <p className="text-sm text-sb-grey line-clamp-2">{item.description}</p>

                      {/* Specifications */}
                      <div className="space-y-1">
                        {item.specifications?.slice(0, 2).map((spec, i) => (
                          <p key={i} className="text-xs text-sb-grey">
                            • {spec}
                          </p>
                        ))}
                      </div>

                      {/* Pricing */}
                      <div className="pt-4 border-t border-sb-grey-light">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-sb-grey">Per Day</span>
                          <span className="text-lg font-bold text-sb-black">
                            {formatCurrency(item.pricePerDay, item.currency)}
                          </span>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center justify-between pt-4">
                        <span
                          className={`text-xs font-semibold ${
                            item.available ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {item.available ? '✓ Available' : '✗ Not Available'}
                        </span>
                      </div>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sb-grey-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-sb-black mb-6">
              Ready to Book Equipment?
            </h2>
            <p className="text-xl text-sb-grey mb-8">
              Add equipment to your studio booking or rent separately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-sb-black text-white text-lg font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
              >
                <span>Book Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-sb-black text-lg font-semibold rounded-lg border-2 border-sb-black hover:bg-sb-black hover:text-white transition-all duration-300"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

