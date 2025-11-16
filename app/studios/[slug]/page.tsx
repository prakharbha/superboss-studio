import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ArrowRight, Check, MapPin, Clock, DollarSign } from 'lucide-react';
import { client, studiosQuery, studioBySlugQuery, seoByPageQuery } from '@/lib/sanity';
import AnimatedSection from '@/components/AnimatedSection';
import { formatCurrency } from '@/lib/utils';

interface StudioPageProps {
  params: Promise<{ slug: string }>;
}

async function getStudioBySlug(slug: string) {
  try {
    const studio = await client.fetch(studioBySlugQuery, { slug });
    if (!studio) return null;
    
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
      features: studio.features || [],
      suitableFor: studio.suitableFor || [],
      location: studio.location || { address: '', coordinates: { lat: 0, lng: 0 } },
    };
  } catch (error) {
    console.error('Error fetching studio:', error);
    return null;
  }
}

async function getAllStudios() {
  try {
    const studios = await client.fetch(studiosQuery);
    return studios.map((studio: any) => ({
      id: studio.id,
      name: studio.name,
      slug: studio.slug?.current || studio.slug,
      size: studio.size,
      unit: studio.unit,
    })) || [];
  } catch (error) {
    console.error('Error fetching studios:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const studios = await getAllStudios();
  return studios.map((studio) => ({
    slug: studio.slug,
  }));
}

export async function generateMetadata({ params }: StudioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const studio = await getStudioBySlug(slug);
  
  if (!studio) {
    return {
      title: 'Studio Not Found',
    };
  }

  const seoPage = await client.fetch(seoByPageQuery, { page: `/studios/${slug}` });

  return {
    title: seoPage?.title || `${studio.name} | SuperBoss Studio`,
    description: seoPage?.description || studio.description,
    keywords: seoPage?.keywords,
    openGraph: {
      title: seoPage?.title || studio.name,
      description: seoPage?.description || studio.description,
      type: 'article',
    },
  };
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { slug } = await params;
  const studio = await getStudioBySlug(slug);
  const allStudios = await getAllStudios();

  if (!studio) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-sb-grey">
        <div className="absolute inset-0 bg-gradient-to-t from-sb-black/60 to-transparent z-10"></div>
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-sm">Image placeholder</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{studio.name}</h1>
            <p className="text-xl text-white/90">
              {studio.size} {studio.unit} Creative Space
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <AnimatedSection>
                <div>
                  <h2 className="text-3xl font-bold text-sb-black mb-4">About This Studio</h2>
                  <p className="text-lg text-sb-grey leading-relaxed">{studio.description}</p>
                </div>
              </AnimatedSection>

              {/* Features */}
              <AnimatedSection delay={0.1}>
                <div>
                  <h2 className="text-3xl font-bold text-sb-black mb-6">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studio.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-sb-black flex-shrink-0 mt-0.5" />
                        <span className="text-sb-grey">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Suitable For */}
              <AnimatedSection delay={0.2}>
                <div>
                  <h2 className="text-3xl font-bold text-sb-black mb-6">Perfect For</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {studio.suitableFor.map((item, index) => (
                      <div
                        key={index}
                        className="bg-sb-grey-light px-4 py-3 rounded-lg text-sb-black font-medium"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Location Map */}
              <AnimatedSection delay={0.3}>
                <div>
                  <h2 className="text-3xl font-bold text-sb-black mb-6">Location</h2>
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-sb-grey-light">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.3604772686844!2d${studio.location.coordinates.lng}!3d${studio.location.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sae!4v1234567890123!5m2!1sen!2sae`}
                      width="100%"
                      height="350"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${studio.name} Location`}
                      className="w-full"
                    />
                    <div className="p-6 text-center bg-white">
                      <div className="flex items-center justify-center mb-4">
                        <MapPin className="w-5 h-5 text-sb-black mr-2" />
                        <p className="text-base font-semibold text-sb-black">{studio.location.address}</p>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${studio.location.coordinates.lat},${studio.location.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-sb-black text-white rounded-lg hover:bg-sb-grey-dark transition-all hover:scale-105 font-semibold"
                      >
                        <span>Get Directions</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <AnimatedSection delay={0.4}>
                  <div className="bg-sb-grey-light rounded-lg p-8 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-sb-black mb-4">Pricing</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-sb-grey" />
                            <span className="text-sb-grey">Per Hour</span>
                          </div>
                          <span className="text-xl font-bold text-sb-black">
                            {formatCurrency(studio.pricePerHour, studio.currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-sb-grey" />
                            <span className="text-sb-grey">Per Day</span>
                          </div>
                          <span className="text-xl font-bold text-sb-black">
                            {formatCurrency(studio.pricePerDay, studio.currency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-sb-grey/20 pt-6">
                      <Link
                        href={`/book?studio=${studio.id}`}
                        className="block w-full px-6 py-4 bg-sb-black text-white text-center font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
                      >
                        Book This Studio
                      </Link>
                    </div>

                    <div className="text-center text-sm text-sb-grey">
                      <p>Need help choosing?</p>
                      <Link href="/contact" className="text-sb-black hover:underline font-medium">
                        Contact us
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Quick Info */}
                <AnimatedSection delay={0.5}>
                  <div className="mt-6 bg-white rounded-lg p-6 border border-sb-grey-light">
                    <h4 className="font-semibold text-sb-black mb-4">Quick Info</h4>
                    <ul className="space-y-2 text-sm text-sb-grey">
                      <li>✓ Professional lighting included</li>
                      <li>✓ Climate controlled environment</li>
                      <li>✓ WiFi available</li>
                      <li>✓ Flexible booking hours</li>
                      <li>✓ Equipment rental available</li>
                    </ul>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Studios */}
      <section className="py-16 bg-sb-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-sb-black mb-8 text-center">
              Explore Other Studios
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allStudios
              .filter((s) => s.id !== studio.id)
              .slice(0, 3)
              .map((otherStudio, index) => (
                <AnimatedSection key={otherStudio.id} delay={index * 0.1}>
                  <Link href={`/studios/${otherStudio.slug}`}>
                    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-[4/3] bg-sb-grey flex items-center justify-center">
                        <span className="text-4xl text-white">📸</span>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-sb-black mb-2">
                          {otherStudio.name}
                        </h3>
                        <p className="text-sb-grey text-sm mb-4">
                          {otherStudio.size} {otherStudio.unit}
                        </p>
                        <div className="flex items-center text-sb-black font-medium">
                          <span>View Details</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
