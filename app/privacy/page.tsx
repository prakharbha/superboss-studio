import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Mail } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Privacy Policy - SuperBoss Studio',
  description: 'Learn how SuperBoss Studio collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-sb-grey-light via-white to-sb-grey-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-sb-grey hover:text-sb-black transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-sb-black mb-6">Privacy Policy</h1>
            <div className="w-24 h-1 bg-sb-black mb-8"></div>
            <p className="text-lg text-sb-grey">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <AnimatedSection>
              <div className="bg-sb-grey-light rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-4">
                  <Shield className="w-8 h-8 text-sb-black flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-sb-black mb-2">Your Privacy Matters</h3>
                    <p className="text-sb-grey">
                      At SuperBoss Studio, we are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">1. Information We Collect</h2>
              <p className="text-sb-grey mb-4">
                We collect information that you provide directly to us when you:
              </p>
              <ul className="list-disc pl-6 text-sb-grey space-y-2 mb-6">
                <li>Book a studio or request information.</li>
                <li>Contact us through our website or email.</li>
                <li>Subscribe to our newsletter or download our catalog.</li>
                <li>Create an account on our platform.</li>
              </ul>
              <p className="text-sb-grey mb-4">
                The types of information we may collect include:
              </p>
              <ul className="list-disc pl-6 text-sb-grey space-y-2">
                <li>Name and contact information (email, phone number, address).</li>
                <li>Company name and business information.</li>
                <li>Booking details and preferences.</li>
                <li>Payment information (processed securely through third-party providers).</li>
                <li>Communication history with our team.</li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">2. How We Use Your Information</h2>
              <p className="text-sb-grey mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-sb-grey space-y-2">
                <li>Process and manage your studio bookings.</li>
                <li>Communicate with you about your reservations and inquiries.</li>
                <li>Send you important updates about our services.</li>
                <li>Improve our services and customer experience.</li>
                <li>Send promotional materials (only with your consent).</li>
                <li>Comply with legal obligations.</li>
                <li>Prevent fraud and ensure security.</li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">3. Information Sharing</h2>
              <p className="text-sb-grey mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-sb-grey space-y-2">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our business (e.g., payment processors, email services).</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">4. Data Security</h2>
              <div className="flex items-start space-x-4 bg-sb-grey-light rounded-lg p-6 mb-4">
                <Lock className="w-6 h-6 text-sb-black flex-shrink-0 mt-1" />
                <p className="text-sb-grey">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">5. Your Rights</h2>
              <p className="text-sb-grey mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-sb-grey space-y-2">
                <li>Access the personal information we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of your personal information.</li>
                <li>Object to processing of your personal information.</li>
                <li>Request restriction of processing.</li>
                <li>Data portability.</li>
                <li>Withdraw consent at any time.</li>
              </ul>
            </AnimatedSection>

            <AnimatedSection delay={0.6}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">6. Cookies and Tracking</h2>
              <p className="text-sb-grey mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookies through your browser settings.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.7}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">7. Children's Privacy</h2>
              <p className="text-sb-grey mb-4">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.8}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">8. Changes to This Policy</h2>
              <p className="text-sb-grey mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.9}>
              <h2 className="text-3xl font-bold text-sb-black mb-4 mt-12">9. Contact Us</h2>
              <div className="bg-sb-grey-light rounded-lg p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Mail className="w-6 h-6 text-sb-black flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sb-grey mb-4">
                      If you have any questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="space-y-2 text-sb-grey">
                      <p><strong>Email:</strong> info@superbossstudio.com</p>
                      <p><strong>Phone:</strong> +971 56 156 1570</p>
                      <p><strong>Address:</strong> Umm Ramool, St. 17, Warehouse No. 4, Dubai, UAE</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={1}>
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-sb-black text-white font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

