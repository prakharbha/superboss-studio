'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedSection from '@/components/AnimatedSection';
import BackgroundSlider from '@/components/BackgroundSlider';
import RotatingText from '@/components/RotatingText';
import { Camera, Film, Palette, Users, Sparkles, ArrowRight } from 'lucide-react';
import studiosData from '@/data/studios.json';

export default function Home() {
  const features = [
    {
      icon: Camera,
      title: 'Professional Studios',
      description: '6 versatile studios ranging from 800 to 5000 sq ft',
    },
    {
      icon: Film,
      title: 'Premium Equipment',
      description: 'State-of-the-art cameras, lighting, and production gear',
    },
    {
      icon: Palette,
      title: 'Extensive Props',
      description: 'Curated collection of furniture, decor, and styling props',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Professional team to assist with your production needs',
    },
  ];

  const useCases = [
    'E-commerce Shoots',
    'Lifestyle Photography',
    'Designer Shoots',
    'Creative Projects',
    'Music Videos',
    'Advertisements',
    'Art Galleries',
    'Exhibitions',
    'Live Performances',
    'Designer Launches',
    'Immersive Pop-ups',
    'Private Events',
  ];

  const rotatingWords = [
    'Ideas',
    'Visions',
    'Dreams',
    'Stories',
    'Concepts',
    'Creations',
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slider */}
        <BackgroundSlider 
          images={[
            '/images/home-banner-2.webp',
            '/images/home-banner-1.webp',
          ]}
          interval={6000}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
              Where{' '}
              <RotatingText 
                words={rotatingWords} 
                interval={2500}
                className="text-sb-grey-light"
              />
              <br />
              <span className="text-white/90">Come to Life</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto drop-shadow-lg"
          >
            16,000 sq ft of creative excellence in the heart of Dubai
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/book"
              className="px-10 py-5 bg-white text-sb-black text-xl font-bold rounded-lg hover:bg-sb-grey-light transition-all duration-300 hover:scale-110 flex items-center space-x-2 shadow-2xl"
            >
              <span>Book Now</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/studios"
              className="px-8 py-4 bg-transparent text-white text-lg font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-sb-black transition-all duration-300"
            >
              Explore Studios
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-sb-black mb-6">
                About SuperBoss Studio
              </h2>
              <div className="w-24 h-1 bg-sb-black mx-auto mb-8"></div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <p className="text-lg text-sb-grey leading-relaxed mb-6">
                Built across 16,000 sq ft canvas, our studio blends artistry and architectural
                excellence. Whether you're a filmmaker, performer, artist or designer - this is
                your arena to convert bold ideas to life.
              </p>
              <p className="text-lg text-sb-grey leading-relaxed">
                A versatile studio crafted to make a vision to reality.
              </p>
            </div>
          </AnimatedSection>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="text-center p-8 rounded-lg hover:bg-sb-grey-light transition-all duration-300 group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-sb-black text-white rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-sb-black mb-2">{feature.title}</h3>
                  <p className="text-sb-grey">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/DSC09230-large.webp"
            alt="What you can create background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-sb-black/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
                What You Can Create
              </h2>
              <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {useCases.map((useCase, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                  <Sparkles className="w-6 h-6 text-sb-grey mx-auto mb-2" />
                  <p className="text-sb-black font-medium">{useCase}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Studios Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-sb-black mb-6">
                Our Spaces
              </h2>
              <div className="w-24 h-1 bg-sb-black mx-auto mb-8"></div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studiosData.map((studio, index) => (
              <AnimatedSection key={studio.id} delay={index * 0.1}>
                <Link href={`/studios/${studio.slug}`}>
                  <div className="group relative overflow-hidden rounded-lg bg-sb-grey aspect-[4/3] hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-sb-grey-light">
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-sm">Studio Image</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-sb-black/90 via-sb-black/40 to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h3 className="text-2xl font-bold text-white mb-2">{studio.name}</h3>
                      <p className="text-white/90 text-sm mb-2">{studio.size} {studio.unit}</p>
                      <p className="text-white/80 text-sm line-clamp-2">{studio.description}</p>
                      <div className="mt-4 flex items-center text-white font-medium group-hover:translate-x-2 transition-transform">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.6}>
            <div className="text-center mt-12">
              <Link
                href="/studios"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-sb-black text-white text-lg font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
              >
                <span>View All Studios</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/DSC09190-Pano-large.webp"
            alt="Studio background"
            fill
            className="object-cover scale-110"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-sb-black/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Bring Your Vision to Life?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Book your studio space today and start creating something extraordinary.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-sb-black text-lg font-semibold rounded-lg hover:bg-sb-grey-light transition-all duration-300 hover:scale-105"
            >
              <span>Book Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
