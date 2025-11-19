import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { client, studiosQuery, seoByPageQuery } from '@/lib/sanity';
import AnimatedSection from '@/components/AnimatedSection';
import { formatCurrency } from '@/lib/utils';
import { getStudioMainImage } from '@/lib/studio-images';
import { getImageUrl } from '@/lib/sanity';

async function getStudios() {
  try {
    const studios = await client.fetch(studiosQuery);
    return studios.map((studio: any) => {
      // Get the first image from Sanity, or fallback to local image mapping
      let mainImage = getStudioMainImage(studio.slug?.current || studio.slug);
      if (studio.images && studio.images.length > 0 && studio.images[0]?.asset?.url) {
        mainImage = getImageUrl(studio.images[0].asset, 800, 600);
      }
      
      return {
        id: studio.id,
        name: studio.name,
        slug: studio.slug?.current || studio.slug,
        size: studio.size,
        unit: studio.unit,
        description: studio.description,
        pricePerHour: studio.pricePerHour,
        pricePerDay: studio.pricePerDay,
        currency: studio.currency,
        suitableFor: studio.suitableFor || [],
        mainImage,
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching studios:', error);
    return [];
  }
}

async function getSEO() {
  try {
    const seo = await client.fetch(seoByPageQuery, { page: '/studios' });
    return seo || null;
  } catch (error) {
    console.error('Error fetching SEO:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO();
  
  return {
    title: seo?.title || 'Our Studios | SuperBoss Film Production & Studio',
    description: seo?.description || 'Explore our professional studios',
    keywords: seo?.keywords || [],
    openGraph: {
      title: seo?.title || 'Our Studios',
      description: seo?.description || 'Explore our professional studios',
      type: seo?.ogType || 'website',
    },
  };
}

export default async function StudiosPage() {
  const studiosData = await getStudios();
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-sb-grey -mt-24 md:-mt-28">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/DSC09213-large.webp"
            alt="Studios background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sb-black/70 via-sb-black/40 to-transparent z-10"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-12">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">Our Studios</h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-lg">
              Six versatile spaces designed for every creative vision. From intimate shoots to
              large-scale productions, find your perfect studio.
            </p>
          </div>
        </div>
      </section>

      {/* Studios Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {studiosData.map((studio: any, index: number) => (
              <div
                key={studio.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8 lg:gap-12 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <Link href={`/studios/${studio.slug}`}>
                    <div className="aspect-[4/3] bg-sb-grey rounded-lg overflow-hidden relative">
                      <Image
                        src={studio.mainImage}
                        alt={studio.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                  </Link>
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
                        {studio.suitableFor.slice(0, 3).map((item: string, i: number) => (
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
                  
                  {/* Divider */}
                  {index < studiosData.length - 1 && (
                    <div className="mt-16 border-t border-sb-grey-light"></div>
                  )}
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Makeup & Styling Facilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-sb-black mb-6">
                Makeup & Styling Facilities
              </h2>
              <div className="w-24 h-1 bg-sb-black mx-auto mb-8"></div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="bg-sb-grey-light rounded-lg p-8">
                <h3 className="text-2xl font-bold text-sb-black mb-4">Makeup Stations</h3>
                <p className="text-sb-grey leading-relaxed">
                  Our studio features two spacious, fully equipped makeup stations available for use with any studio booking.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-sb-grey-light rounded-lg p-8">
                <h3 className="text-2xl font-bold text-sb-black mb-4">Luxury Makeup Room</h3>
                <p className="text-sb-grey leading-relaxed">
                  For premium shoots, we offer an exclusive luxury makeup room that includes a private green room and a dedicated stylist station - designed to provide maximum comfort and privacy for talent and clients.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="bg-sb-grey-light rounded-lg p-8">
                <h3 className="text-2xl font-bold text-sb-black mb-4">Green Room</h3>
                <p className="text-sb-grey leading-relaxed">
                  A large, well-appointed green room with multiple changing areas ensures a smooth workflow during productions of any scale.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Workstation & Office Space */}
      <section className="py-16 bg-sb-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-sb-black mb-6">
                Workstation & Office Space
              </h2>
              <div className="w-24 h-1 bg-sb-black mx-auto mb-8"></div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-sb-black mb-4">Dedicated Workstation Area</h3>
                <p className="text-sb-grey leading-relaxed">
                  Our in-house workstation includes multiple private cabins designed for production teams, editors, and coordinators to work efficiently.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-lg p-8">
                <h3 className="text-2xl font-bold text-sb-black mb-4">Conference Room</h3>
                <p className="text-sb-grey leading-relaxed">
                  A spacious conference room equipped with a projector, screen, and complete meeting setup is available for client presentations, planning sessions, and creative discussions.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
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

