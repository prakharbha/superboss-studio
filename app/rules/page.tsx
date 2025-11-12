import { AlertCircle, Check, X } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import Link from 'next/link';
import Image from 'next/image';

export default function RulesPage() {
  const generalRules = [
    'All bookings must be confirmed at least 24 hours in advance',
    'Valid ID required for all studio bookings',
    'Studio access is granted only during booked hours',
    'Maximum occupancy limits must be respected',
    'All equipment must be returned in the same condition',
    'Smoking is strictly prohibited inside all studio spaces',
    'Food and beverages are allowed only in designated areas',
    'Professional conduct is expected from all clients and crew',
  ];

  const dosList = [
    'Arrive on time for your booking',
    'Treat all equipment and props with care',
    'Clean up your workspace before leaving',
    'Report any damages or issues immediately',
    'Follow fire safety and emergency procedures',
    'Keep noise levels reasonable',
    'Respect other clients using adjacent spaces',
    'Dispose of waste in designated bins',
  ];

  const dontsList = [
    'Don\'t exceed the maximum occupancy',
    'Don\'t move or remove studio equipment without permission',
    'Don\'t use nails, screws, or adhesives on walls',
    'Don\'t block fire exits or emergency equipment',
    'Don\'t bring pets (unless pre-approved for shoots)',
    'Don\'t sublease or share your booking without permission',
    'Don\'t use open flames or pyrotechnics without approval',
    'Don\'t leave the studio unattended during your booking',
  ];

  const cancellationPolicy = [
    'Cancellations made 48+ hours before booking: Full refund',
    'Cancellations made 24-48 hours before: 50% refund',
    'Cancellations made less than 24 hours: No refund',
    'No-shows will be charged the full booking amount',
    'Rescheduling is subject to availability',
  ];

  const paymentTerms = [
    'Payment must be confirmed before studio access',
    'We accept bank transfer, credit card, and cash',
    'Deposits may be required for large bookings',
    'Security deposits are refundable upon inspection',
    'Additional charges apply for overtime usage',
    'Equipment damage will be charged separately',
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/DSC09248-large.webp"
            alt="Rules background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-sb-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
              Studio Rules & Guidelines
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
              Please read and follow these guidelines to ensure a smooth and professional
              experience for everyone.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  Important Notice
                </h3>
                <p className="text-yellow-800">
                  By booking our studio, you agree to comply with all rules and guidelines. Failure
                  to follow these rules may result in termination of your booking without refund
                  and potential ban from future bookings.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* General Rules */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-sb-black mb-8">General Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generalRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-sb-grey-light rounded-lg"
                >
                  <Check className="w-5 h-5 text-sb-black flex-shrink-0 mt-0.5" />
                  <span className="text-sb-grey">{rule}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-16 bg-sb-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Do's */}
            <AnimatedSection>
              <div className="bg-white rounded-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-sb-black">Do's</h2>
                </div>
                <ul className="space-y-3">
                  {dosList.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sb-grey">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Don'ts */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-sb-black">Don'ts</h2>
                </div>
                <ul className="space-y-3">
                  {dontsList.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sb-grey">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Cancellation Policy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-sb-black mb-8">Cancellation Policy</h2>
            <div className="bg-sb-grey-light rounded-lg p-8">
              <ul className="space-y-4">
                {cancellationPolicy.map((policy, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-sb-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sb-grey text-lg">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Payment Terms */}
      <section className="py-16 bg-sb-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-sb-black mb-8">Payment Terms</h2>
            <div className="bg-white rounded-lg p-8">
              <ul className="space-y-4">
                {paymentTerms.map((term, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-sb-black flex-shrink-0 mt-1" />
                    <span className="text-sb-grey text-lg">{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Safety & Emergency */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-sb-black mb-8">Safety & Emergency</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-sb-grey-light rounded-lg p-6">
                <h3 className="text-xl font-bold text-sb-black mb-3">Fire Safety</h3>
                <p className="text-sb-grey">
                  Fire extinguishers are located throughout the facility. Familiarize yourself
                  with emergency exits upon arrival.
                </p>
              </div>
              <div className="bg-sb-grey-light rounded-lg p-6">
                <h3 className="text-xl font-bold text-sb-black mb-3">First Aid</h3>
                <p className="text-sb-grey">
                  First aid kits are available at the reception. Notify staff immediately in case
                  of any injuries.
                </p>
              </div>
              <div className="bg-sb-grey-light rounded-lg p-6">
                <h3 className="text-xl font-bold text-sb-black mb-3">Emergency Contact</h3>
                <p className="text-sb-grey">
                  In case of emergency, contact our staff immediately or call emergency services
                  at 999.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sb-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-4xl font-bold mb-6">Have Questions About Our Rules?</h2>
            <p className="text-xl text-sb-grey-light mb-8">
              Our team is here to help clarify any questions you may have.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-sb-black text-lg font-semibold rounded-lg hover:bg-sb-grey-light transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
