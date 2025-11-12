'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import studiosData from '@/data/studios.json';
import equipmentData from '@/data/equipment.json';
import propsData from '@/data/props.json';

type FormData = {
  // Step 1: Studios
  studios: string[];
  // Step 2: Equipment
  equipment: string[];
  // Step 3: Props
  props: string[];
  // Step 4: Date & Time
  date: string;
  startTime: string;
  endTime: string;
  // Step 5: Contact
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
};

const steps = [
  { id: 1, name: 'Select Studio', description: 'Choose your studio space' },
  { id: 2, name: 'Equipment', description: 'Add equipment (optional)' },
  { id: 3, name: 'Props', description: 'Add props (optional)' },
  { id: 4, name: 'Date & Time', description: 'Choose your booking time' },
  { id: 5, name: 'Contact Details', description: 'Your information' },
];

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const selectedStudios = watch('studios') || [];
  const selectedEquipment = watch('equipment') || [];
  const selectedProps = watch('props') || [];

  const onSubmit = async (data: FormData) => {
    console.log('Booking Data:', data);
    // Here you would typically send this to your backend
    setIsSubmitted(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-16"
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Booking Request Received!</h2>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your booking request. Our representative will call you shortly to confirm your booking and arrange payment.
        </p>
        <div className="bg-gray-50 p-6 rounded-xl">
          <p className="text-gray-700">
            You will receive a confirmation email at the address you provided. 
            If you have any questions, feel free to contact us at{' '}
            <a href="tel:+971561561570" className="text-black font-semibold hover:underline">
              +971 56 156 1570
            </a>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id}
                </div>
                <div className="mt-2 text-center hidden md:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-black' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Studios */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Select Studio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {studiosData.map((studio) => (
                  <label
                    key={studio.id}
                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedStudios.includes(studio.id)
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={studio.id}
                      {...register('studios', { required: 'Please select at least one studio' })}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{studio.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{studio.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold">{studio.size} {studio.unit}</span>
                          <span className="text-gray-500">From {studio.currency} {studio.pricePerHour}/hr</span>
                        </div>
                      </div>
                      {selectedStudios.includes(studio.id) && (
                        <CheckCircle className="w-6 h-6 text-black flex-shrink-0 ml-4" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.studios && (
                <p className="text-red-500 text-sm mt-2">{errors.studios.message}</p>
              )}
            </motion.div>
          )}

          {/* Step 2: Equipment */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Equipment</h2>
              <p className="text-gray-600 mb-6">Optional - Skip if not needed</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {equipmentData.map((item) => (
                  <label
                    key={item.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedEquipment.includes(item.id)
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={item.id}
                      {...register('equipment')}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                        <p className="text-sm font-semibold text-gray-900">{item.currency} {item.pricePerDay}/day</p>
                      </div>
                      {selectedEquipment.includes(item.id) && (
                        <CheckCircle className="w-5 h-5 text-black flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Props */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Add Props</h2>
              <p className="text-gray-600 mb-6">Optional - Skip if not needed</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {propsData.map((item) => (
                  <label
                    key={item.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedProps.includes(item.id)
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={item.id}
                      {...register('props')}
                      className="sr-only"
                    />
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                        <p className="text-sm font-semibold text-gray-900">{item.currency} {item.pricePerDay}/day</p>
                      </div>
                      {selectedProps.includes(item.id) && (
                        <CheckCircle className="w-5 h-5 text-black flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Date & Time */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Select Date & Time</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Booking Date
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Please select a date' })}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-2" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      {...register('startTime', { required: 'Please select start time' })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-2" />
                      End Time
                    </label>
                    <input
                      type="time"
                      {...register('endTime', { required: 'Please select end time' })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    />
                    {errors.endTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Contact Details */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Contact Details</h2>
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone number is required' })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    placeholder="+971 50 123 4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors resize-none"
                    placeholder="Any special requirements or questions..."
                  ></textarea>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold"
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 font-semibold"
            >
              Submit Booking
              <CheckCircle className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

