'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail, Phone, MapPin, Download } from 'lucide-react';
import CatalogDownloadModal from './CatalogDownloadModal';

const studios = [
  { name: 'Boss Unit', slug: 'boss-unit' },
  { name: 'Boss Frame', slug: 'boss-frame' },
  { name: 'Boss Cell', slug: 'boss-cell' },
  { name: 'Super Cell', slug: 'super-cell' },
  { name: 'Super Frame', slug: 'super-frame' },
  { name: 'Boss Arena', slug: 'boss-arena' },
];

export default function Footer() {
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  return (
    <footer className="bg-sb-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Image
              src="/logo-footer.webp"
              alt="SuperBoss Studio"
              width={1000}
              height={205}
              className="h-12 md:h-14 w-auto mb-6"
              unoptimized
            />
            <p className="text-sb-grey-light text-sm leading-relaxed">
              Built across 16,000 sq ft, our studio blends artistry and architectural excellence.
              Your arena to convert bold ideas to life.
            </p>
          </div>

          {/* Studios */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Studios</h3>
            <ul className="space-y-2">
              {studios.map((studio) => (
                <li key={studio.slug}>
                  <Link
                    href={`/studios/${studio.slug}`}
                    className="text-sb-grey-light text-sm hover:text-white transition-colors"
                  >
                    {studio.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/equipment"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/props"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  Props
                </Link>
              </li>
              <li>
                <Link
                  href="/rules"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  Rules
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsCatalogModalOpen(true)}
                  aria-label="Download catalog"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Catalog</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-sb-grey-light flex-shrink-0 mt-0.5" />
                <span className="text-sb-grey-light text-sm">
                  Umm Ramool, St. 17, Warehouse No. 4, Dubai
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sb-grey-light flex-shrink-0" />
                <a
                  href="tel:+971561561570"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  +971 56 156 1570
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sb-grey-light flex-shrink-0" />
                <a
                  href="mailto:info@superbossstudio.com"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  info@superbossstudio.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-sb-grey-light flex-shrink-0" />
                <a
                  href="https://www.instagram.com/superbossproduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sb-grey-light text-sm hover:text-white transition-colors"
                >
                  @superbossproduction
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sb-grey-dark">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <p className="text-sb-grey-light text-sm">
                © {new Date().getFullYear()} SuperBoss Film Production & Studio. All rights reserved.
              </p>
              <p className="text-sb-grey-light text-xs">
                Website by{' '}
                <a
                  href="https://www.nandann.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-sb-grey-light transition-colors underline"
                >
                  Nandann Creative Agency
                </a>
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sb-grey-light text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sb-grey-light text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Download Modal */}
      <CatalogDownloadModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
      />
    </footer>
  );
}
