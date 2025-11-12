'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Clock, Check } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      reset();
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again or contact us directly.');
      console.error('Contact form error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/home-banner-2.webp"
            alt="Contact background"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-sb-black/60" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">Get in Touch</h1>
            <div className="w-24 h-1 bg-white mx-auto mb-8"></div>
            <p className="text-xl text-white max-w-3xl mx-auto drop-shadow-lg">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <AnimatedSection>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-sb-black mb-6">Contact Information</h2>
                  <p className="text-sb-grey mb-8">
                    Reach out to us through any of the following channels. We're here to help you
                    bring your creative vision to life.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sb-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sb-black mb-1">Address</h3>
                      <p className="text-sb-grey">
                        Umm Ramool, St. 17, Warehouse No. 4
                        <br />
                        Dubai, United Arab Emirates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sb-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sb-black mb-1">Phone</h3>
                      <a
                        href="tel:+971561561570"
                        className="text-sb-grey hover:text-sb-black transition-colors"
                      >
                        +971 56 156 1570
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sb-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sb-black mb-1">Email</h3>
                      <a
                        href="mailto:info@superbossstudio.com"
                        className="text-sb-grey hover:text-sb-black transition-colors"
                      >
                        info@superbossstudio.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sb-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sb-black mb-1">Instagram</h3>
                      <a
                        href="https://www.instagram.com/superbossproduction"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sb-grey hover:text-sb-black transition-colors"
                      >
                        @superbossproduction
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sb-black rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sb-black mb-1">Business Hours</h3>
                      <p className="text-sb-grey">
                        Monday - Sunday
                        <br />
                        8:00 AM - 10:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.2}>
              <div className="bg-sb-grey-light rounded-lg p-8">
                <h2 className="text-2xl font-bold text-sb-black mb-6">Send us a Message</h2>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-green-700">
                      Thank you for contacting us. We'll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-sb-black mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 bg-white border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-sb-black mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        className="w-full px-4 py-3 bg-white border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-sb-black mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full px-4 py-3 bg-white border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                        placeholder="+971 50 123 4567"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-sb-black mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        {...register('subject', { required: 'Subject is required' })}
                        className="w-full px-4 py-3 bg-white border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                        placeholder="How can we help?"
                      />
                      {errors.subject && (
                        <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-sb-black mb-2">
                        Message *
                      </label>
                      <textarea
                        {...register('message', { required: 'Message is required' })}
                        rows={5}
                        className="w-full px-4 py-3 bg-white border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                        placeholder="Tell us more about your project..."
                      />
                      {errors.message && (
                        <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 bg-sb-black text-white font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-sb-grey-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-sb-black mb-8 text-center">Find Us</h2>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.3604772686844!2d55.35153731501487!3d25.231799983881673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d1e0e0e0e0e%3A0x0!2zMjXCsDEzJzU0LjUiTiA1NcKwMjEnMTIuNiJF!5e0!3m2!1sen!2sae!4v1234567890123!5m2!1sen!2sae"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SuperBoss Studio Location"
                className="w-full"
              />
              <div className="p-6 text-center bg-white">
                <div className="flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-sb-black mr-2" />
                  <p className="text-lg font-semibold text-sb-black">Umm Ramool, St. 17, Warehouse No. 4, Dubai</p>
                </div>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=25.2318,55.3537"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-sb-black text-white rounded-lg hover:bg-sb-grey-dark transition-all hover:scale-105 font-semibold"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
