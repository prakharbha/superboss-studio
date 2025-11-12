import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | SuperBoss Studio',
  description: 'Terms and conditions for using SuperBoss Film Production & Studio services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-sb-black mb-4">
            Terms of Service
          </h1>
          <p className="text-sb-grey text-lg">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">1. Acceptance of Terms</h2>
            <p className="text-sb-grey mb-4">
              By accessing and using SuperBoss Film Production & Studio's services, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">2. Studio Rental Services</h2>
            <p className="text-sb-grey mb-4">
              <strong>Booking and Reservations:</strong> All studio bookings must be confirmed in writing. A booking reference number will be provided upon confirmation.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Payment Terms:</strong> Payment is required as per the agreed terms at the time of booking. Full payment may be required before studio access is granted.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Cancellation Policy:</strong> Cancellations must be made in accordance with our cancellation policy. Fees may apply for late cancellations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">3. Studio Usage Rules</h2>
            <p className="text-sb-grey mb-4">
              <strong>Permitted Use:</strong> Studios are to be used only for professional photography, videography, and creative production purposes.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Prohibited Activities:</strong> Illegal activities, dangerous stunts without proper safety measures, and activities that may damage the premises are strictly prohibited.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Equipment Care:</strong> Clients are responsible for any damage to studio equipment, props, or facilities during their rental period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">4. Equipment and Props Rental</h2>
            <p className="text-sb-grey mb-4">
              <strong>Condition:</strong> All equipment and props are provided in good working condition. Clients must report any issues immediately.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Liability:</strong> Clients are liable for any damage, loss, or theft of rented equipment and props during the rental period.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Return:</strong> All rented items must be returned in the same condition as received, clean and undamaged.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">5. Liability and Insurance</h2>
            <p className="text-sb-grey mb-4">
              <strong>Client Responsibility:</strong> Clients are responsible for their own equipment, crew, and talent during the rental period.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Insurance:</strong> Clients are advised to maintain appropriate insurance coverage for their activities and equipment.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Limitation of Liability:</strong> SuperBoss Studio is not liable for any indirect, incidental, or consequential damages arising from the use of our facilities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">6. Safety and Security</h2>
            <p className="text-sb-grey mb-4">
              <strong>Safety Compliance:</strong> All clients must comply with safety regulations and guidelines provided by SuperBoss Studio.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Emergency Procedures:</strong> Clients must familiarize themselves with emergency exits and procedures.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Security:</strong> Clients are responsible for the security of their personal belongings and equipment.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">7. Intellectual Property</h2>
            <p className="text-sb-grey mb-4">
              <strong>Content Ownership:</strong> All content created by clients remains their intellectual property.
            </p>
            <p className="text-sb-grey mb-4">
              <strong>Studio Branding:</strong> SuperBoss Studio retains the right to use images of the facilities for marketing purposes, unless otherwise agreed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">8. Modifications to Terms</h2>
            <p className="text-sb-grey mb-4">
              SuperBoss Studio reserves the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">9. Governing Law</h2>
            <p className="text-sb-grey mb-4">
              These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-sb-black mb-4">10. Contact Information</h2>
            <p className="text-sb-grey mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-none text-sb-grey space-y-2">
              <li>📧 Email: info@superbossstudio.com</li>
              <li>📞 Phone: +971 56 156 1570</li>
              <li>📍 Address: Umm Ramool, St. 17, Warehouse No. 4, Dubai</li>
            </ul>
          </section>
        </div>

        {/* Back to Home */}
        <div className="mt-12 pt-8 border-t border-sb-grey-light">
          <Link
            href="/"
            className="inline-flex items-center text-sb-black hover:text-sb-grey transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

