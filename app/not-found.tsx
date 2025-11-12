import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.webp"
            alt="SuperBoss Studio"
            width={200}
            height={67}
            className="mx-auto"
            priority
          />
        </div>

        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-sb-black leading-none">
            404
          </h1>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-sb-black mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-sb-grey mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-base text-sb-grey">
            It might have been moved or deleted, or you may have mistyped the URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="px-8 py-4 bg-sb-black text-white text-lg font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
          >
            Go to Homepage
          </Link>
          <Link
            href="/studios"
            className="px-8 py-4 bg-transparent text-sb-black text-lg font-semibold rounded-lg border-2 border-sb-black hover:bg-sb-black hover:text-white transition-all duration-300"
          >
            Browse Studios
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-sb-grey-light">
          <p className="text-sm text-sb-grey mb-4">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/equipment"
              className="text-sb-grey hover:text-sb-black transition-colors text-sm"
            >
              Equipment
            </Link>
            <span className="text-sb-grey-light">•</span>
            <Link
              href="/props"
              className="text-sb-grey hover:text-sb-black transition-colors text-sm"
            >
              Props
            </Link>
            <span className="text-sb-grey-light">•</span>
            <Link
              href="/book"
              className="text-sb-grey hover:text-sb-black transition-colors text-sm"
            >
              Book Now
            </Link>
            <span className="text-sb-grey-light">•</span>
            <Link
              href="/contact"
              className="text-sb-grey hover:text-sb-black transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8">
          <p className="text-sm text-sb-grey">
            Need help? Contact us at{' '}
            <a
              href="tel:+971561561570"
              className="text-sb-black hover:underline font-medium"
            >
              +971 56 156 1570
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

