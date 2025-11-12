import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import studiosData from '@/data/studios.json';
import seoData from '@/data/seo.json';
import AnimatedSection from '@/components/AnimatedSection';
import { formatCurrency } from '@/lib/utils';

export const metadata: Metadata = {
  title: seoData.pages['/studios'].title,
  description: seoData.pages['/studios'].description,
  keywords: seoData.pages['/studios'].keywords,
  openGraph: {
    title: seoData.pages['/studios'].title,
    description: seoData.pages['/studios'].description,
    type: 'website',
  },
};

export default function StudiosPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/DSC09213-large.webp"
            alt="Studios background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-sb-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">Our Studios</h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
              Six versatile spaces designed for every creative vision. From intimate shoots to
              large-scale productions, find your perfect studio.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Studios Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {studiosData.map((studio, index) => (
              <AnimatedSection key={studio.id} delay={index * 0.1}>
                <div
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-8 lg:gap-12 items-center`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="aspect-[4/3] bg-sb-grey rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-sm">Studio Image</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                      <h2 className="text-4xl font-bold text-sb-black mb-2">{studio.name}</h2>
                      <p className="text-xl text-sb-grey">
                        {studio.size} {studio.unit}
                      </p>
                    </div>

                    <p className="text-lg text-sb-grey leading-relaxed">{studio.description}</p>

                    <div className="space-y-2">
                      <p className="text-sm text-sb-grey font-medium">PERFECT FOR:</p>
                      <div className="flex flex-wrap gap-2">
                        {studio.suitableFor.slice(0, 3).map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-sb-grey-light text-sb-black text-sm rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sb-black">
                      <div>
                        <p className="text-sm text-sb-grey mb-1">Per Hour</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(studio.pricePerHour, studio.currency)}
                        </p>
                      </div>
                      <div className="h-12 w-px bg-sb-grey-light"></div>
                      <div>
                        <p className="text-sm text-sb-grey mb-1">Per Day</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(studio.pricePerDay, studio.currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/studios/${studio.slug}`}
                        className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-sb-black text-white font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/book?studio=${studio.id}`}
                        className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white text-sb-black font-semibold rounded-lg border-2 border-sb-black hover:bg-sb-black hover:text-white transition-all duration-300"
                      >
                        <span>Book Now</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {index < studiosData.length - 1 && (
                  <div className="mt-16 border-t border-sb-grey-light"></div>
                )}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sb-grey-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold text-sb-black mb-6">
              Not Sure Which Studio to Choose?
            </h2>
            <p className="text-xl text-sb-grey mb-8">
              Our team is here to help you find the perfect space for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-sb-black text-white text-lg font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
              >
                <span>Contact Us</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/book"
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-sb-black text-lg font-semibold rounded-lg border-2 border-sb-black hover:bg-sb-black hover:text-white transition-all duration-300"
              >
                <span>Book Online</span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

