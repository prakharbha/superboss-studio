'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Menu, X, ChevronDown, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load modal since it's only needed when user clicks
const CatalogDownloadModal = dynamic(() => import('./CatalogDownloadModal'), {
  ssr: false,
});

const studios = [
  { name: 'Boss Unit', slug: 'boss-unit' },
  { name: 'Boss Frame', slug: 'boss-frame' },
  { name: 'Boss Cell', slug: 'boss-cell' },
  { name: 'Super Cell', slug: 'super-cell' },
  { name: 'Super Frame', slug: 'super-frame' },
  { name: 'Boss Arena', slug: 'boss-arena' },
  { name: 'Super Feast', slug: 'super-feast' },
  { name: 'Super Voice', slug: 'super-voice' },
  { name: 'Super Station', slug: 'super-station' },
  { name: 'Super Lounge', slug: 'super-lounge' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStudiosOpen, setIsStudiosOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-[55] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'h-16 md:h-20' : 'h-24 md:h-28'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.webp"
              alt="SuperBoss Studio"
              width={240}
              height={80}
              className={`w-auto transition-all duration-300 ${
                isScrolled ? 'h-10 md:h-12' : 'h-15 md:h-18'
              }`}
              priority
              quality={90}
              sizes="(max-width: 768px) 180px, 240px"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-base font-medium text-sb-black hover:text-sb-grey transition-colors"
            >
              Home
            </Link>

            {/* Studios Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsStudiosOpen(true)}
              onMouseLeave={() => setIsStudiosOpen(false)}
            >
              <Link href="/studios" className="flex items-center space-x-1 text-base font-medium text-sb-black hover:text-sb-grey transition-colors">
                <span>Studios</span>
                <ChevronDown className="w-5 h-5" />
              </Link>

              <AnimatePresence>
                {isStudiosOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2"
                  >
                    <Link
                      href="/studios"
                      className="block px-4 py-2 text-sm text-sb-black hover:bg-sb-grey-light transition-colors font-semibold border-b border-sb-grey-light"
                    >
                      All Studios
                    </Link>
                    {studios.map((studio) => (
                      <Link
                        key={studio.slug}
                        href={`/studios/${studio.slug}`}
                        className="block px-4 py-2 text-sm text-sb-black hover:bg-sb-grey-light transition-colors"
                      >
                        {studio.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/equipment"
              className="text-base font-medium text-sb-black hover:text-sb-grey transition-colors"
            >
              Equipment
            </Link>

            <Link
              href="/props"
              className="text-base font-medium text-sb-black hover:text-sb-grey transition-colors"
            >
              Props
            </Link>

            <Link
              href="/events"
              className="text-base font-medium text-sb-black hover:text-sb-grey transition-colors"
            >
              Events
            </Link>

            <Link
              href="/contact"
              className="text-base font-medium text-sb-black hover:text-sb-grey transition-colors"
            >
              Contact
            </Link>

            {/* Catalog Download Button */}
            <button
              onClick={() => setIsCatalogModalOpen(true)}
              aria-label="Download catalog"
              className="text-base font-medium text-sb-black hover:text-sb-grey transition-colors flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Catalog</span>
            </button>

            {/* Book Now CTA */}
            <Link
              href="/book"
              className="px-6 py-2.5 bg-sb-black text-white text-base font-semibold rounded-md hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
            >
              Book Online
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2 text-sb-black"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Menu - Full Screen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden fixed inset-0 top-0 left-0 right-0 bottom-0 bg-white z-[60] overflow-hidden"
            style={{ position: 'fixed' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-6 right-6 p-2 text-sb-black hover:text-sb-grey transition-colors z-[70]"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="h-full w-full flex flex-col justify-evenly px-8 py-12 overflow-y-auto">
              <Link
                href="/"
                className="text-2xl font-semibold text-sb-black hover:text-sb-grey transition-colors text-center py-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Studios Mobile Dropdown */}
              <div className="text-center py-4">
                <Link
                  href="/studios"
                  className="text-2xl font-semibold text-sb-black hover:text-sb-grey transition-colors block mb-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Studios
                </Link>
                <button
                  onClick={() => setIsStudiosOpen(!isStudiosOpen)}
                  className="flex items-center justify-center w-full text-sm text-sb-grey hover:text-sb-black transition-colors"
                >
                  <span>View All Studios</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform ${
                      isStudiosOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isStudiosOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      {studios.map((studio) => (
                        <Link
                          key={studio.slug}
                          href={`/studios/${studio.slug}`}
                          className="block text-lg text-sb-black hover:text-sb-grey transition-colors font-medium"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {studio.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/equipment"
                className="text-2xl font-semibold text-sb-black hover:text-sb-grey transition-colors text-center py-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Equipment
              </Link>

              <Link
                href="/props"
                className="text-2xl font-semibold text-sb-black hover:text-sb-grey transition-colors text-center py-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Props
              </Link>

              <Link
                href="/events"
                className="text-2xl font-semibold text-sb-black hover:text-sb-grey transition-colors text-center py-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Events
              </Link>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCatalogModalOpen(true);
                }}
                className="text-2xl font-semibold text-sb-black hover:text-sb-grey transition-colors text-center py-4 flex items-center justify-center space-x-2"
              >
                <Download className="w-6 h-6" />
                <span>Download Catalog</span>
              </button>

              <Link
                href="/contact"
                className="text-2xl font-semibold text-sb-black hover:text-sb-grey transition-colors text-center py-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <Link
                href="/book"
                className="block w-full max-w-xs mx-auto px-8 py-4 bg-sb-black text-white text-xl font-bold rounded-lg text-center hover:bg-sb-grey-dark transition-all hover:scale-105 my-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Online
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog Download Modal */}
      <CatalogDownloadModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
      />
    </>
  );
}
