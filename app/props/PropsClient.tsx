'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search, ChevronDown } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import { formatCurrency } from '@/lib/utils';

interface Prop {
  id: string;
  name: string;
  category: string;
  description: string;
  priceHalfDay?: number;
  pricePerDay: number;
  currency: string;
  color?: string;
  style?: string;
  available: boolean;
  image?: any;
}

interface PropsClientProps {
  propsData: Prop[];
}

export default function PropsClient({ propsData }: PropsClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique categories and styles
  const categories = ['All', ...Array.from(new Set(propsData.map((item) => item.category)))];
  const styles = ['All', ...Array.from(new Set(propsData.map((item) => item.style).filter((s): s is string => Boolean(s))))];

  // Filter props
  const filteredProps = propsData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStyle = selectedStyle === 'All' || !item.style || item.style === selectedStyle;
    return matchesSearch && matchesCategory && matchesStyle;
  });

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/DSC09205-large.webp"
            alt="Props background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-sb-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">Props Rental</h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
              Extensive collection of props including furniture, decor, textiles, and accessories
              to elevate your creative projects. All prices in AED per day.
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
              isFilterOpen ? 'max-h-[600px] pb-6' : 'max-h-0'
            }`}
          >
            <div className="space-y-4">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sb-grey w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search props..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                />
              </div>

              {/* Category Filter */}
              <div>
                <p className="text-sm font-semibold text-sb-grey mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
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

              {/* Style Filter */}
              <div>
                <p className="text-sm font-semibold text-sb-grey mb-2">Style</p>
                <div className="flex flex-wrap gap-2">
                  {styles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        selectedStyle === style
                          ? 'bg-sb-black text-white'
                          : 'bg-sb-grey-light text-sb-black hover:bg-sb-grey'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Props Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-sb-grey">
              Showing <span className="font-semibold text-sb-black">{filteredProps.length}</span>{' '}
              {filteredProps.length === 1 ? 'prop' : 'props'}
            </p>
          </div>

          {filteredProps.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-sb-grey">No props found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProps.map((item, index) => (
                <div key={item.id} className="bg-white border border-sb-grey-light rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="aspect-[4/3] bg-sb-grey-light relative overflow-hidden">
                      {item.image?.asset?.url ? (
                        <Image
                          src={item.image.asset.url}
                          alt={item.image.alt || item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center text-sb-grey">
                            <div className="text-4xl mb-2">🎨</div>
                            <p className="text-xs">{item.category}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-sb-grey uppercase tracking-wide">
                            {item.category}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              item.available ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {item.available ? '✓' : '✗'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-sb-black">{item.name}</h3>
                      </div>

                      <p className="text-sm text-sb-grey line-clamp-2">{item.description}</p>

                      {/* Details */}
                      <div className="flex items-center justify-between text-xs">
                        {item.color && <span className="text-sb-grey">Color: {item.color}</span>}
                        {item.style && (
                          <span className="px-2 py-1 bg-sb-grey-light text-sb-black rounded">
                            {item.style}
                          </span>
                        )}
                      </div>

                      {/* Pricing */}
                      <div className="pt-3 border-t border-sb-grey-light space-y-1">
                        {item.priceHalfDay && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-sb-grey">Half Day (≤4 hrs)</span>
                            <span className="text-sm font-semibold text-sb-black">
                              {formatCurrency(item.priceHalfDay, item.currency)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-sb-grey">Full Day</span>
                          <span className="text-xl font-bold text-sb-black">
                            {formatCurrency(item.pricePerDay, item.currency)}
                          </span>
                        </div>
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
            <h2 className="text-4xl font-bold text-sb-black mb-6">Ready to Book Props?</h2>
            <p className="text-xl text-sb-grey mb-8">
              Add props to your studio booking to create the perfect scene.
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

