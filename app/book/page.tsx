'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Check, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import Calendar from '@/components/Calendar';
import studiosData from '@/data/studios.json';
import equipmentData from '@/data/equipment.json';
import propsData from '@/data/props.json';
import { formatCurrency } from '@/lib/utils';

interface BookingFormData {
  // Step 1: Studios
  studios: string[];
  
  // Step 2: Equipment
  equipment: { id: string; quantity: number }[];
  
  // Step 3: Props
  props: { id: string; quantity: number }[];
  
  // Step 4: Date & Time
  date: string;
  startTime: string;
  endTime: string;
  duration: 'hourly' | 'daily';
  
  // Step 5: Contact
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
}

function BookingForm() {
  const searchParams = useSearchParams();
  const preselectedStudio = searchParams.get('studio');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudios, setSelectedStudios] = useState<string[]>(
    preselectedStudio ? [preselectedStudio] : []
  );
  const [selectedEquipment, setSelectedEquipment] = useState<{ id: string; quantity: number }[]>([]);
  const [selectedProps, setSelectedProps] = useState<{ id: string; quantity: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<'hourly' | 'fullday'>('hourly');
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingReference, setBookingReference] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<BookingFormData>();

  const totalSteps = 5;

  // Generate time slots (8 AM to 10 PM in 1-hour intervals)
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleTimeSlotToggle = (slot: string) => {
    setSelectedTimeSlots((prev) => {
      if (prev.includes(slot)) {
        return prev.filter((s) => s !== slot);
      }
      return [...prev, slot].sort();
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;

    if (bookingType === 'fullday') {
      // Full day pricing
      selectedStudios.forEach((studioId) => {
        const studio = studiosData.find((s) => s.id === studioId);
        if (studio) {
          total += studio.pricePerDay;
        }
      });

      // Equipment full day
      selectedEquipment.forEach((item) => {
        const equipment = equipmentData.find((e) => e.id === item.id);
        if (equipment) {
          total += equipment.pricePerDay * item.quantity;
        }
      });
    } else {
      // Hourly pricing
      const hours = selectedTimeSlots.length;

      // Studios
      selectedStudios.forEach((studioId) => {
        const studio = studiosData.find((s) => s.id === studioId);
        if (studio) {
          total += studio.pricePerHour * hours;
        }
      });

      // Equipment
      selectedEquipment.forEach((item) => {
        const equipment = equipmentData.find((e) => e.id === item.id);
        if (equipment) {
          total += equipment.pricePerHour * hours * item.quantity;
        }
      });
    }

    // Props (always daily rate)
    selectedProps.forEach((item) => {
      const prop = propsData.find((p) => p.id === item.id);
      if (prop) {
        total += prop.pricePerDay * item.quantity;
      }
    });

    return total;
  };

  const handleStudioToggle = (studioId: string) => {
    setSelectedStudios((prev) =>
      prev.includes(studioId) ? prev.filter((id) => id !== studioId) : [...prev, studioId]
    );
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setSelectedEquipment((prev) => {
      const exists = prev.find((item) => item.id === equipmentId);
      if (exists) {
        return prev.filter((item) => item.id !== equipmentId);
      }
      return [...prev, { id: equipmentId, quantity: 1 }];
    });
  };

  const handlePropToggle = (propId: string) => {
    setSelectedProps((prev) => {
      const exists = prev.find((item) => item.id === propId);
      if (exists) {
        return prev.filter((item) => item.id !== propId);
      }
      return [...prev, { id: propId, quantity: 1 }];
    });
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const bookingData = {
        studios: selectedStudios,
        equipment: selectedEquipment,
        props: selectedProps,
        date: selectedDate?.toISOString(),
        bookingType,
        timeSlots: selectedTimeSlots,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        message: data.message,
        total: calculateTotal(),
      };

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const result = await response.json();
      setBookingReference(result.bookingReference || '');
      setBookingSubmitted(true);
    } catch (error) {
      setSubmitError('Failed to submit booking. Please try again or contact us directly.');
      console.error('Booking submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (bookingSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-sb-black mb-4">Booking Received!</h1>
            
            {bookingReference && (
              <div className="bg-sb-black text-white p-6 rounded-lg mb-6">
                <p className="text-sm text-white/80 mb-2">Your Booking Reference</p>
                <p className="text-3xl font-bold tracking-wider">{bookingReference}</p>
                <p className="text-xs text-white/70 mt-2">Please save this reference number for future correspondence</p>
              </div>
            )}
            
            <p className="text-xl text-sb-grey mb-8">
              Thank you for your booking request. Our representative will call you shortly to
              confirm your booking and arrange payment.
            </p>
            <div className="bg-sb-grey-light p-6 rounded-lg mb-8">
              <p className="text-sb-black font-medium mb-2">What happens next?</p>
              <ul className="text-left text-sb-grey space-y-2">
                <li>✓ We'll review your booking details</li>
                <li>✓ Our team will call you within 24 hours</li>
                <li>✓ We'll confirm availability and discuss payment</li>
                <li>✓ You'll receive a confirmation email with your reference number</li>
              </ul>
            </div>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-sb-black text-white font-semibold rounded-lg hover:bg-sb-grey-dark transition-all duration-300"
            >
              Back to Home
            </a>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all flex-shrink-0 ${
                    step <= currentStep
                      ? 'bg-sb-black text-white'
                      : 'bg-sb-grey-light text-sb-grey'
                  }`}
                >
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-sb-black' : 'bg-sb-grey-light'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-sb-grey px-1">
            <span className="text-center" style={{ width: '20%' }}>Studios</span>
            <span className="text-center" style={{ width: '20%' }}>Equipment</span>
            <span className="text-center" style={{ width: '20%' }}>Props</span>
            <span className="text-center" style={{ width: '20%' }}>Date & Time</span>
            <span className="text-center" style={{ width: '20%' }}>Contact</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Select Studios */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-sb-black mb-6">Select Studio(s)</h2>
                <div className="space-y-4 mb-8">
                  {studiosData.map((studio) => (
                    <div
                      key={studio.id}
                      onClick={() => handleStudioToggle(studio.id)}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                        selectedStudios.includes(studio.id)
                          ? 'border-sb-black bg-sb-grey-light'
                          : 'border-sb-grey-light hover:border-sb-grey'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-sb-black mb-2">{studio.name}</h3>
                          <p className="text-sb-grey mb-3">{studio.description}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-sb-grey">
                              {studio.size} {studio.unit}
                            </span>
                            <span className="text-sb-black font-semibold">
                              {formatCurrency(studio.pricePerHour, studio.currency)}/hr
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            selectedStudios.includes(studio.id)
                              ? 'bg-sb-black border-sb-black'
                              : 'border-sb-grey'
                          }`}
                        >
                          {selectedStudios.includes(studio.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Equipment */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-sb-black mb-2">Add Equipment (Optional)</h2>
                <p className="text-sb-grey mb-6">Select any equipment you'd like to rent</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {equipmentData.slice(0, 10).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleEquipmentToggle(item.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedEquipment.find((e) => e.id === item.id)
                          ? 'border-sb-black bg-sb-grey-light'
                          : 'border-sb-grey-light hover:border-sb-grey'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="text-xs text-sb-grey uppercase">{item.category}</span>
                          <h3 className="text-lg font-bold text-sb-black mb-1">{item.name}</h3>
                          <p className="text-sm text-sb-grey mb-2 line-clamp-1">
                            {item.description}
                          </p>
                          <span className="text-sm text-sb-black font-semibold">
                            {formatCurrency(item.pricePerDay, item.currency)}/day
                          </span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                            selectedEquipment.find((e) => e.id === item.id)
                              ? 'bg-sb-black border-sb-black'
                              : 'border-sb-grey'
                          }`}
                        >
                          {selectedEquipment.find((e) => e.id === item.id) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Select Props */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-sb-black mb-2">Add Props (Optional)</h2>
                <p className="text-sb-grey mb-6">Select any props you'd like to use</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {propsData.slice(0, 12).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handlePropToggle(item.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProps.find((p) => p.id === item.id)
                          ? 'border-sb-black bg-sb-grey-light'
                          : 'border-sb-grey-light hover:border-sb-grey'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-sb-grey uppercase">{item.category}</span>
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedProps.find((p) => p.id === item.id)
                              ? 'bg-sb-black border-sb-black'
                              : 'border-sb-grey'
                          }`}
                        >
                          {selectedProps.find((p) => p.id === item.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-sb-black mb-1">{item.name}</h3>
                      <span className="text-sm text-sb-black font-semibold">
                        {formatCurrency(item.pricePerDay, item.currency)}/day
                      </span>
                    </div>
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
                <h2 className="text-3xl font-bold text-sb-black mb-2">Select Date & Time</h2>
                <p className="text-sb-grey mb-6">Choose your booking type and preferred date</p>
                
                {/* Booking Type Selector */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-sb-black mb-4">Booking Type</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingType('hourly');
                        setSelectedTimeSlots([]);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        bookingType === 'hourly'
                          ? 'border-sb-black bg-sb-black text-white'
                          : 'border-sb-grey-light hover:border-sb-grey bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <h4 className="text-xl font-bold mb-1">Hourly Booking</h4>
                        <p className={`text-sm ${bookingType === 'hourly' ? 'text-white/80' : 'text-sb-grey'}`}>
                          Select specific hours (8 AM - 10 PM)
                        </p>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setBookingType('fullday');
                        setSelectedTimeSlots([]);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        bookingType === 'fullday'
                          ? 'border-sb-black bg-sb-black text-white'
                          : 'border-sb-grey-light hover:border-sb-grey bg-white'
                      }`}
                    >
                      <div className="text-center">
                        <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
                        <h4 className="text-xl font-bold mb-1">Full Day</h4>
                        <p className={`text-sm ${bookingType === 'fullday' ? 'text-white/80' : 'text-sb-grey'}`}>
                          8 AM - 10 PM (14 hours)
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Calendar */}
                  <div>
                    <h3 className="text-lg font-semibold text-sb-black mb-4">Select Date</h3>
                    <Calendar
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                    />
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="text-lg font-semibold text-sb-black mb-4">
                      {bookingType === 'fullday' ? 'Full Day Booking' : 'Select Time Slots'} {selectedDate && `(${selectedDate.toLocaleDateString()})`}
                    </h3>
                    {!selectedDate ? (
                      <div className="bg-sb-grey-light rounded-lg p-8 text-center">
                        <Clock className="w-12 h-12 text-sb-grey mx-auto mb-4" />
                        <p className="text-sb-grey">Please select a date first</p>
                      </div>
                    ) : bookingType === 'fullday' ? (
                      <div className="bg-sb-black text-white rounded-lg p-8 text-center">
                        <Check className="w-12 h-12 mx-auto mb-4" />
                        <h4 className="text-xl font-bold mb-2">Full Day Selected</h4>
                        <p className="text-white/80 mb-4">8:00 AM - 10:00 PM (14 hours)</p>
                        <p className="text-sm text-white/70">
                          Full day booking includes access to the studio for the entire operating hours.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTimeSlots.includes(slot);
                          const nextSlot = timeSlots[timeSlots.indexOf(slot) + 1] || '22:00';
                          
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleTimeSlotToggle(slot)}
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-sb-black bg-sb-black text-white'
                                  : 'border-sb-grey-light hover:border-sb-grey bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Clock className="w-5 h-5" />
                                  <span className="font-medium">{slot} - {nextSlot}</span>
                                </div>
                                {isSelected && <Check className="w-5 h-5" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                    
                    {selectedTimeSlots.length > 0 && (
                      <div className="mt-4 p-4 bg-sb-grey-light rounded-lg">
                        <p className="text-sm font-semibold text-sb-black mb-2">
                          Selected: {selectedTimeSlots.length} hour{selectedTimeSlots.length > 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-sb-grey">
                          {selectedTimeSlots[0]} - {timeSlots[timeSlots.indexOf(selectedTimeSlots[selectedTimeSlots.length - 1]) + 1] || '22:00'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                {(selectedTimeSlots.length > 0 || bookingType === 'fullday') && selectedDate && (
                  <div className="bg-sb-grey-light rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-sb-black mb-4">Booking Summary</h3>
                    <div className="space-y-3">
                      {selectedStudios.map((studioId) => {
                        const studio = studiosData.find((s) => s.id === studioId);
                        if (!studio) return null;
                        return (
                          <div key={studioId} className="flex justify-between text-sm">
                            <span className="text-sb-grey">
                              {studio.name} {bookingType === 'fullday' ? '(Full Day)' : `× ${selectedTimeSlots.length}h`}
                            </span>
                            <span className="font-semibold text-sb-black">
                              {formatCurrency(
                                bookingType === 'fullday' 
                                  ? studio.pricePerDay 
                                  : studio.pricePerHour * selectedTimeSlots.length, 
                                'AED'
                              )}
                            </span>
                          </div>
                        );
                      })}
                      
                      {selectedEquipment.map((item) => {
                        const equipment = equipmentData.find((e) => e.id === item.id);
                        if (!equipment) return null;
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-sb-grey">
                              {equipment.name} {bookingType === 'fullday' ? '(Full Day)' : `× ${selectedTimeSlots.length}h`}
                            </span>
                            <span className="font-semibold text-sb-black">
                              {formatCurrency(
                                bookingType === 'fullday'
                                  ? equipment.pricePerDay * item.quantity
                                  : equipment.pricePerHour * selectedTimeSlots.length * item.quantity, 
                                'AED'
                              )}
                            </span>
                          </div>
                        );
                      })}
                      
                      {selectedProps.map((item) => {
                        const prop = propsData.find((p) => p.id === item.id);
                        if (!prop) return null;
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-sb-grey">{prop.name} (daily)</span>
                            <span className="font-semibold text-sb-black">
                              {formatCurrency(prop.pricePerDay * item.quantity, 'AED')}
                            </span>
                          </div>
                        );
                      })}
                      
                      <div className="border-t border-sb-grey pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-sb-black">Total</span>
                          <span className="text-2xl font-bold text-sb-black">
                            {formatCurrency(calculateTotal(), 'AED')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Contact Information */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl font-bold text-sb-black mb-6">Contact Information</h2>
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-sb-black mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                      placeholder="John Doe"
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
                      className="w-full px-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
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

                  <div>
                    <label className="block text-sm font-semibold text-sb-black mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      {...register('company')}
                      className="w-full px-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-sb-black mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      className="w-full px-4 py-3 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                      placeholder="Any special requirements or questions?"
                    />
                  </div>

                  {/* Final Price Summary */}
                  <div className="bg-sb-black text-white rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Final Booking Summary</h3>
                    <div className="space-y-3 mb-4">
                      {selectedStudios.map((studioId) => {
                        const studio = studiosData.find((s) => s.id === studioId);
                        if (!studio) return null;
                        return (
                          <div key={studioId} className="flex justify-between text-sm">
                            <span className="text-white/80">
                              {studio.name} {bookingType === 'fullday' ? '(Full Day)' : `× ${selectedTimeSlots.length}h`}
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(
                                bookingType === 'fullday' 
                                  ? studio.pricePerDay 
                                  : studio.pricePerHour * selectedTimeSlots.length, 
                                'AED'
                              )}
                            </span>
                          </div>
                        );
                      })}
                      
                      {selectedEquipment.map((item) => {
                        const equipment = equipmentData.find((e) => e.id === item.id);
                        if (!equipment) return null;
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-white/80">
                              {equipment.name} {bookingType === 'fullday' ? '(Full Day)' : `× ${selectedTimeSlots.length}h`} × {item.quantity}
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(
                                bookingType === 'fullday'
                                  ? equipment.pricePerDay * item.quantity
                                  : equipment.pricePerHour * selectedTimeSlots.length * item.quantity, 
                                'AED'
                              )}
                            </span>
                          </div>
                        );
                      })}
                      
                      {selectedProps.map((item) => {
                        const prop = propsData.find((p) => p.id === item.id);
                        if (!prop) return null;
                        return (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-white/80">{prop.name} × {item.quantity} (daily)</span>
                            <span className="font-semibold">
                              {formatCurrency(prop.pricePerDay * item.quantity, 'AED')}
                            </span>
                          </div>
                        );
                      })}
                      
                      <div className="border-t border-white/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold">Total Amount</span>
                          <span className="text-3xl font-bold">
                            {formatCurrency(calculateTotal(), 'AED')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-white/70 mt-4">
                      <p className="mb-1">📅 Date: {selectedDate?.toLocaleDateString()}</p>
                      <p>⏰ Time: {bookingType === 'fullday' 
                        ? '8:00 AM - 10:00 PM (Full Day - 14 hours)' 
                        : `${selectedTimeSlots[0]} - ${timeSlots[timeSlots.indexOf(selectedTimeSlots[selectedTimeSlots.length - 1]) + 1] || '22:00'} (${selectedTimeSlots.length} hour${selectedTimeSlots.length > 1 ? 's' : ''})`
                      }</p>
                    </div>
                  </div>

                  <div className="bg-sb-black text-white p-6 rounded-lg">
                    <p className="font-medium mb-2">Payment Information</p>
                    <p className="text-sm text-white/80">
                      Our representative will call you to confirm your booking and arrange payment.
                      We accept various payment methods including bank transfer, credit card, and
                      cash.
                    </p>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <p className="text-red-700 text-sm">{submitError}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-sb-grey-light">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-sb-grey-light text-sb-grey cursor-not-allowed'
                  : 'bg-white text-sb-black border-2 border-sb-black hover:bg-sb-black hover:text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && selectedStudios.length === 0) ||
                  (currentStep === 4 && (!selectedDate || (bookingType === 'hourly' && selectedTimeSlots.length === 0)))
                }
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  (currentStep === 1 && selectedStudios.length === 0) ||
                  (currentStep === 4 && (!selectedDate || (bookingType === 'hourly' && selectedTimeSlots.length === 0)))
                    ? 'bg-sb-grey-light text-sb-grey cursor-not-allowed'
                    : 'bg-sb-black text-white hover:bg-sb-grey-dark hover:scale-105'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-8 py-3 bg-sb-black text-white rounded-lg font-semibold hover:bg-sb-grey-dark transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit Booking'}</span>
                <Check className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
