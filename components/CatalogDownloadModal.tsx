'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Download, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CatalogFormData {
  name: string;
  phone: string;
}

interface CatalogDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogDownloadModal({ isOpen, onClose }: CatalogDownloadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CatalogFormData>();

  const onSubmit = async (data: CatalogFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/catalog-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setSubmitted(true);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = '/catalogue.pdf';
      link.download = 'SuperBoss-Studio-Catalogue.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close modal after download
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError('Failed to process request. Please try again.');
      console.error('Catalog download error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 text-sb-grey hover:text-sb-black transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-sb-black mb-2">
                    Download Started!
                  </h3>
                  <p className="text-sb-grey">
                    Thank you! Your catalog is downloading now.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-sb-black rounded-full flex items-center justify-center mb-4">
                      <Download className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-sb-black mb-2">
                      Download Catalog
                    </h2>
                    <p className="text-sb-grey">
                      Please provide your details to download our studio catalog.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-sb-black mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-sb-black mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full px-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                        placeholder="+971 50 123 4567"
                      />
                      {errors.phone && (
                        <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 border-2 border-sb-grey-light text-sb-black font-semibold rounded-lg hover:bg-sb-grey-light transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-sb-black text-white font-semibold rounded-lg hover:bg-sb-grey-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Download className="w-5 h-5" />
                        <span>{isSubmitting ? 'Processing...' : 'Download'}</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

