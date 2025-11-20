'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar, Clock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

interface Studio {
  id: string;
  name: string;
  size: number;
  unit: string;
  description: string;
  pricePerHour: number;
  price2Hours?: number;
  price4Hours?: number;
  price6Hours?: number;
  price8Hours: number;
  pricePerDay: number; // Legacy field
  currency: string;
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerHour: number;
  pricePerDay: number;
  currency: string;
  available: boolean;
  image?: any;
}

interface Prop {
  id: string;
  name: string;
  category: string;
  description: string;
  pricePerDay: number;
  currency: string;
  available: boolean;
  image?: any;
}

interface BookingFormProps {
  studios: Studio[];
  equipment: Equipment[];
  props: Prop[];
}

type FormData = {
  // Step 1: Studios
  studios: string[];
  // Step 2: Equipment
  equipment: string[];
  // Step 3: Props
  props: string[];
  // Step 4: Date & Time
  bookingType: 'fullDay' | 'hourly';
  date: string;
  selectedHours: string[];
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

export default function BookingForm({ studios: studiosData = [], equipment: equipmentData = [], props: propsData = [] }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
  const [fullDayStartTime, setFullDayStartTime] = useState<string>('9:00');
  const [bookingId, setBookingId] = useState<string>('');
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();

  const selectedStudios = watch('studios') || [];
  const selectedEquipment = watch('equipment') || [];
  const selectedProps = watch('props') || [];
  const bookingType = watch('bookingType') || 'hourly';

  // Ensure data is always arrays
  const safeStudiosData = Array.isArray(studiosData) ? studiosData : [];
  const safeEquipmentData = Array.isArray(equipmentData) ? equipmentData : [];
  const safePropsData = Array.isArray(propsData) ? propsData : [];

  // Helper function to calculate studio price based on number of hours
  const calculateStudioPrice = (studio: Studio, hours: number): { total: number; unitPrice: number; hourLabel: string } => {
    if (hours === 0) {
      return { total: 0, unitPrice: studio.pricePerHour, hourLabel: '0 Hours' };
    }

    // Use package pricing when available, otherwise calculate from hourly rate
    if (hours === 1) {
      return { total: studio.pricePerHour, unitPrice: studio.pricePerHour, hourLabel: '1 Hour' };
    } else if (hours === 2) {
      const price = studio.price2Hours || (studio.pricePerHour * 2);
      return { total: price, unitPrice: price, hourLabel: '2 Hours' };
    } else if (hours === 3) {
      // 3 hours = 1 hour price + 2 hour price
      const price1 = studio.pricePerHour;
      const price2 = studio.price2Hours || (studio.pricePerHour * 2);
      const price = price1 + price2;
      return { total: price, unitPrice: studio.pricePerHour, hourLabel: '3 Hours' };
    } else if (hours === 4) {
      const price = studio.price4Hours || (studio.pricePerHour * 4);
      return { total: price, unitPrice: price, hourLabel: '4 Hours' };
    } else if (hours === 5) {
      // 5 hours = 4 hour price + 1 hour price
      const price4 = studio.price4Hours || (studio.pricePerHour * 4);
      const price1 = studio.pricePerHour;
      const price = price4 + price1;
      return { total: price, unitPrice: studio.pricePerHour, hourLabel: '5 Hours' };
    } else if (hours === 6) {
      const price = studio.price6Hours || (studio.pricePerHour * 6);
      return { total: price, unitPrice: price, hourLabel: '6 Hours' };
    } else if (hours === 7) {
      // 7 hours = 6 hour price + 1 hour price
      const price6 = studio.price6Hours || (studio.pricePerHour * 6);
      const price1 = studio.pricePerHour;
      const price = price6 + price1;
      return { total: price, unitPrice: studio.pricePerHour, hourLabel: '7 Hours' };
    } else if (hours === 8 || hours >= 8) {
      const price = studio.price8Hours || studio.pricePerDay;
      return { total: price, unitPrice: price, hourLabel: '8 Hours (Full Day)' };
    } else {
      // For other hour counts (9+), calculate from hourly rate
      const price = studio.pricePerHour * hours;
      return { total: price, unitPrice: studio.pricePerHour, hourLabel: `${hours} Hours` };
    }
  };

  // Calculate hours from selected time ranges
  const calculateHoursFromRanges = (ranges: string[]): number => {
    return ranges.length; // Each range is 1 hour
  };

  // Generate time slots array from ranges for API compatibility
  const generateTimeSlotsFromRanges = (ranges: string[]): string[] => {
    return ranges.map(range => {
      const startHour = parseInt(range.split('-')[0].trim());
      return `${startHour}:00`;
    });
  };

  // Calculate price breakdown
  const priceBreakdown = useMemo(() => {
    const breakdown = {
      studios: [] as Array<{ name: string; quantity: number; unitPrice: number; total: number; needsTimeSelection: boolean; hourLabel: string }>,
      equipment: [] as Array<{ name: string; quantity: number; unitPrice: number; total: number; needsTimeSelection: boolean }>,
      props: [] as Array<{ name: string; quantity: number; unitPrice: number; total: number; needsTimeSelection: boolean }>,
      total: 0,
    };

    // Determine number of hours
    const hours = bookingType === 'fullDay' 
      ? 8 
      : calculateHoursFromRanges(selectedTimeRanges);
    
    // Calculate studio prices
    if (Array.isArray(selectedStudios)) {
      selectedStudios.forEach((studioId: string) => {
        const studio = safeStudiosData.find(s => s.id === studioId);
        if (studio) {
          if (bookingType === 'fullDay') {
            const priceInfo = calculateStudioPrice(studio, 8);
            breakdown.studios.push({
              name: studio.name,
              quantity: 1,
              unitPrice: priceInfo.unitPrice,
              total: priceInfo.total,
              needsTimeSelection: false,
              hourLabel: priceInfo.hourLabel,
            });
            breakdown.total += priceInfo.total;
          } else if (hours > 0) {
            const priceInfo = calculateStudioPrice(studio, hours);
            breakdown.studios.push({
              name: studio.name,
              quantity: 1,
              unitPrice: priceInfo.unitPrice,
              total: priceInfo.total,
              needsTimeSelection: false,
              hourLabel: priceInfo.hourLabel,
            });
            breakdown.total += priceInfo.total;
          } else {
            breakdown.studios.push({
              name: studio.name,
              quantity: 1,
              unitPrice: studio.pricePerHour,
              total: 0,
              needsTimeSelection: true,
              hourLabel: '',
            });
          }
        }
      });
    }

    // Calculate equipment prices (always per day)
    if (Array.isArray(selectedEquipment)) {
      selectedEquipment.forEach((equipId: string) => {
        const equip = safeEquipmentData.find(e => e.id === equipId);
        if (equip) {
          const total = equip.pricePerDay;
          breakdown.equipment.push({
            name: equip.name,
            quantity: 1,
            unitPrice: equip.pricePerDay,
            total,
            needsTimeSelection: false,
          });
          breakdown.total += total;
        }
      });
    }

    // Calculate props prices (always per day)
    if (Array.isArray(selectedProps)) {
      selectedProps.forEach((propId: string) => {
        const prop = safePropsData.find(p => p.id === propId);
        if (prop) {
          const total = prop.pricePerDay;
          breakdown.props.push({
            name: prop.name,
            quantity: 1,
            unitPrice: prop.pricePerDay,
            total,
            needsTimeSelection: false, // Props are always per day
          });
          breakdown.total += total;
        }
      });
    }

    return breakdown;
  }, [selectedStudios, selectedEquipment, selectedProps, bookingType, selectedTimeRanges, safeStudiosData, safeEquipmentData, safePropsData]);

  const totalPrice = priceBreakdown.total;

  // Generate booking ID
  const generateBookingId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `SB-${timestamp}-${random}`.toUpperCase();
  };

  const onSubmit = async (data: FormData) => {
    const newBookingId = generateBookingId();
    setBookingId(newBookingId);
    
    try {
      // Prepare booking data for API
      const bookingData = {
        bookingId: newBookingId,
        studios: data.studios || [],
        equipment: data.equipment || [],
        props: data.props || [],
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : data.date,
        bookingType: data.bookingType || 'hourly',
        timeSlots: bookingType === 'fullDay' 
          ? selectedHours.length > 0 ? selectedHours : ['fullDay']
          : generateTimeSlotsFromRanges(selectedTimeRanges),
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company || '',
        message: data.message || '',
        total: totalPrice,
      };

      // Send booking to API
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Booking submission error:', result);
        alert('Failed to submit booking. Please try again or contact us directly.');
        return;
      }

      console.log('Booking submitted successfully:', result);
    setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('An error occurred while submitting your booking. Please try again or contact us directly at +971 56 156 1570');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    // Validate step 4 before proceeding
    if (currentStep === 4) {
      if (!selectedDate) {
        setValue('date', '', { shouldValidate: true });
        return;
      }
      if (bookingType === 'hourly' && selectedTimeRanges.length === 0) {
        alert('Please select at least one time range');
        return;
      }
      if (bookingType === 'fullDay' && !fullDayStartTime) {
        alert('Please select a start time for full day booking');
        return;
      }
    }
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto px-4 py-16"
      >
        <div className="text-center mb-8">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Booking Request Received!</h2>
          <p className="text-xl text-gray-600 mb-2">
            Your booking ID: <span className="font-bold text-black">{bookingId}</span>
          </p>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl mb-6 border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Booking Summary</h3>
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="text-gray-900">{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">Booking Type:</span>
              <span className="text-gray-900">
                {bookingType === 'fullDay' 
                  ? 'Full Day' 
                  : selectedTimeRanges.length > 0
                    ? `Hourly (${selectedTimeRanges.length} hour${selectedTimeRanges.length !== 1 ? 's' : ''})` 
                    : 'Hourly'}
              </span>
            </div>
            
            {/* Price Breakdown */}
            {totalPrice > 0 && (
              <div className="py-3 border-b border-gray-300">
                <p className="font-semibold text-gray-700 mb-2">Price Breakdown:</p>
                <div className="space-y-2 text-sm">
                  {priceBreakdown.studios.length > 0 && (
                    <div className="bg-white/60 rounded p-2">
                      <p className="font-medium text-gray-600 mb-1">Studios</p>
                      {priceBreakdown.studios.map((studio: any, idx: number) => {
                        const calculatedHours = selectedTimeRanges.length;
                        return (
                          <div key={idx} className="flex justify-between text-gray-700">
                            <span>{studio.name}</span>
                            <span className="font-medium">
                              {bookingType === 'fullDay' 
                                ? `AED ${studio.total.toLocaleString()} (8 Hours)`
                                : studio.needsTimeSelection
                                  ? `Select time range`
                                  : `AED ${studio.total.toLocaleString()} (${studio.hourLabel || `${calculatedHours} hour${calculatedHours !== 1 ? 's' : ''}`})`
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {priceBreakdown.equipment.length > 0 && (
                    <div className="bg-white/60 rounded p-2">
                      <p className="font-medium text-gray-600 mb-1">Equipment</p>
                      {priceBreakdown.equipment.map((equip, idx) => {
                        const calculatedHours = selectedTimeRanges.length;
                        return (
                          <div key={idx} className="flex justify-between text-gray-700">
                            <span>{equip.name}</span>
                            <span className="font-medium">
                              {bookingType === 'fullDay' 
                                ? `AED ${equip.unitPrice.toLocaleString()}`
                                : `AED ${equip.unitPrice.toLocaleString()}/hr × ${calculatedHours} = AED ${equip.total.toLocaleString()}`
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {priceBreakdown.props.length > 0 && (
                    <div className="bg-white/60 rounded p-2">
                      <p className="font-medium text-gray-600 mb-1">Props</p>
                      {priceBreakdown.props.map((prop, idx) => (
                        <div key={idx} className="flex justify-between text-gray-700">
                          <span>{prop.name}</span>
                          <span className="font-medium">AED {prop.unitPrice.toLocaleString()}/day</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center py-3 bg-black text-white px-4 rounded-lg mt-4">
              <span className="font-bold text-lg">Estimated Total:</span>
              <span className="font-bold text-2xl">AED {totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 mb-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">📞 Next Steps</h3>
          <p className="text-blue-800 mb-3">
            Our representative will <strong>call you shortly</strong> to:
          </p>
          <ul className="list-disc list-inside text-blue-800 space-y-2 mb-3">
            <li>Confirm your booking details</li>
            <li>Discuss any special requirements</li>
            <li>Arrange payment and finalize your reservation</li>
          </ul>
          <p className="text-sm text-blue-700">
            You will receive a confirmation email at the address you provided once the booking is confirmed.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl text-center">
          <p className="text-gray-700 mb-2">
            Questions? Contact us directly:
          </p>
          <a href="tel:+971561561570" className="text-2xl font-bold text-black hover:underline inline-block">
            +971 56 156 1570
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center">
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
                  className={`h-1 flex-1 transition-all duration-300 ${
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
                {safeStudiosData.map((studio) => (
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
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <span className="font-semibold">{studio.size} {studio.unit}</span>
                        </div>
                        {/* Pricing Information */}
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex flex-wrap gap-2">
                            <span>1hr: {studio.currency} {studio.pricePerHour.toLocaleString()}</span>
                            {studio.price2Hours && <span>• 2hr: {studio.currency} {studio.price2Hours.toLocaleString()}</span>}
                            {studio.price4Hours && <span>• 4hr: {studio.currency} {studio.price4Hours.toLocaleString()}</span>}
                            {studio.price6Hours && <span>• 6hr: {studio.currency} {studio.price6Hours.toLocaleString()}</span>}
                            <span>• Full Day: {studio.currency} {(studio.price8Hours || studio.pricePerDay).toLocaleString()}</span>
                          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {safeEquipmentData.map((item) => (
                  <label
                    key={item.id}
                    className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
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
                    {(() => {
                      // Get image URL - handle both direct URL string and Sanity image object
                      let imageUrl = null;
                      let imageAlt = item.name;
                      
                      if (item.image) {
                        if (typeof item.image === 'string') {
                          imageUrl = item.image;
                        } else if (item.image.asset?.url) {
                          imageUrl = item.image.asset.url;
                          imageAlt = item.image.alt || item.name;
                        } else if (item.image.asset) {
                          // Use urlFor for Sanity image objects
                          try {
                            imageUrl = urlFor(item.image).width(400).height(300).url();
                            imageAlt = item.image.alt || item.name;
                          } catch (e) {
                            // Fallback if urlFor fails
                            imageUrl = null;
                          }
                        }
                      }
                      
                      return imageUrl ? (
                        <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="text-3xl mb-1">📷</div>
                            <p className="text-xs">{item.category}</p>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      </div>
                      {selectedEquipment.includes(item.id) && (
                        <CheckCircle className="w-5 h-5 text-black flex-shrink-0 ml-2" />
                      )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{item.currency} {item.pricePerDay}/day</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                {safePropsData.map((item) => (
                  <label
                    key={item.id}
                    className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
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
                    {(() => {
                      // Get image URL - handle both direct URL string and Sanity image object
                      let imageUrl = null;
                      let imageAlt = item.name;
                      
                      if (item.image) {
                        if (typeof item.image === 'string') {
                          imageUrl = item.image;
                        } else if (item.image.asset?.url) {
                          imageUrl = item.image.asset.url;
                          imageAlt = item.image.alt || item.name;
                        } else if (item.image.asset) {
                          // Use urlFor for Sanity image objects
                          try {
                            imageUrl = urlFor(item.image).width(400).height(300).url();
                            imageAlt = item.image.alt || item.name;
                          } catch (e) {
                            // Fallback if urlFor fails
                            imageUrl = null;
                          }
                        }
                      }
                      
                      return imageUrl ? (
                        <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="text-3xl mb-1">🎨</div>
                            <p className="text-xs">{item.category}</p>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                      </div>
                      {selectedProps.includes(item.id) && (
                        <CheckCircle className="w-5 h-5 text-black flex-shrink-0 ml-2" />
                      )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{item.currency} {item.pricePerDay}/day</p>
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
              
              {/* Booking Type Selection */}
              <div className="mb-8">
                <label className="block text-xl font-bold text-gray-900 mb-4">
                  Choose Booking Type
                </label>
                <div className="flex gap-6">
                  <label className="flex-1 cursor-pointer group">
                    <input
                      type="radio"
                      value="hourly"
                      {...register('bookingType', { required: 'Please select booking type' })}
                      className="sr-only"
                      onChange={() => {
                        setValue('bookingType', 'hourly');
                        setSelectedHours([]);
                        setSelectedTimeRanges([]);
                        setFullDayStartTime('9:00');
                      }}
                    />
                    <div className={`p-6 rounded-xl border-3 transition-all duration-300 shadow-md hover:shadow-xl ${
                      bookingType === 'hourly'
                        ? 'border-black bg-black text-white scale-105 shadow-xl'
                        : 'border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-xl font-bold mb-2 ${
                            bookingType === 'hourly' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Hourly Booking
                          </h3>
                          <p className={`text-base ${
                            bookingType === 'hourly' ? 'text-gray-200' : 'text-gray-600'
                          }`}>
                            Select specific hours
                          </p>
                        </div>
                        {bookingType === 'hourly' && (
                          <CheckCircle className="w-8 h-8 text-white flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer group">
                    <input
                      type="radio"
                      value="fullDay"
                      {...register('bookingType', { required: 'Please select booking type' })}
                      className="sr-only"
                      onChange={() => {
                        setValue('bookingType', 'fullDay');
                        setSelectedHours([]);
                        setSelectedTimeRanges([]);
                        // Set default start time and calculate end time
                        const defaultStart = '9:00';
                        setFullDayStartTime(defaultStart);
                        const [startHour] = defaultStart.split(':').map(Number);
                        let endHour = startHour + 8;
                        if (endHour >= 24) {
                          endHour = endHour - 24;
                        }
                        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
                        setSelectedHours([`${defaultStart}-${endTime}`]);
                        setValue('selectedHours', [`${defaultStart}-${endTime}`], { shouldValidate: true });
                      }}
                    />
                    <div className={`p-6 rounded-xl border-3 transition-all duration-300 shadow-md hover:shadow-xl ${
                      bookingType === 'fullDay'
                        ? 'border-black bg-black text-white scale-105 shadow-xl'
                        : 'border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-xl font-bold mb-2 ${
                            bookingType === 'fullDay' ? 'text-white' : 'text-gray-900'
                          }`}>
                            Full Day Booking (8 Hours)
                          </h3>
                          <p className={`text-base ${
                            bookingType === 'fullDay' ? 'text-gray-200' : 'text-gray-600'
                          }`}>
                            8 Hours - Full Day
                          </p>
                        </div>
                        {bookingType === 'fullDay' && (
                          <CheckCircle className="w-8 h-8 text-white flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </label>
                </div>
                {errors.bookingType && (
                  <p className="text-red-500 text-sm mt-2">{errors.bookingType.message}</p>
                )}
              </div>

              {/* Calendar and Hour Selection Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Calendar Section - 50% */}
                <div>
                  <label className="block text-xl font-bold text-gray-900 mb-4">
                    <Calendar className="inline w-6 h-6 mr-2" />
                    Select Date
                  </label>
                  <div className="flex justify-center bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-200 shadow-sm">
                    <div className="scale-125 transform origin-center">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          if (date) {
                            setValue('date', format(date, 'yyyy-MM-dd'), { shouldValidate: true });
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-md"
                        showOutsideDays
                      />
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="mt-4 p-4 bg-black text-white rounded-lg text-center">
                      <p className="text-sm font-medium mb-1">Selected Date</p>
                      <p className="text-xl font-bold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...register('date', { required: 'Please select a date' })}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-2">{errors.date.message}</p>
                  )}
                </div>

                {/* Time Range Selection Section - 50% */}
                <div className={`${bookingType === 'fullDay' ? 'opacity-40 pointer-events-none' : ''}`}>
                  <label className="block text-xl font-bold text-gray-900 mb-4">
                    <Clock className="inline w-6 h-6 mr-2" />
                    Select Time Ranges
                  </label>
                  {bookingType === 'fullDay' ? (
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm">
                      <label className="block text-sm font-semibold text-gray-700 mb-4">
                        <Clock className="inline w-5 h-5 mr-2" />
                        Select Start Time (8 Hours Full Day)
                      </label>
                      <select
                        value={fullDayStartTime}
                        onChange={(e) => {
                          setFullDayStartTime(e.target.value);
                          // Calculate end time (start + 8 hours)
                          const [startHour, startMin] = e.target.value.split(':').map(Number);
                          let endHour = startHour + 8;
                          let endMin = startMin;
                          if (endHour >= 24) {
                            endHour = endHour - 24;
                          }
                          const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
                          // Set selected hours for API
                          setSelectedHours([`${e.target.value}-${endTime}`]);
                          setValue('selectedHours', [`${e.target.value}-${endTime}`], { shouldValidate: true });
                        }}
                        className="w-full p-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium text-lg focus:border-black focus:outline-none"
                      >
                        {Array.from({ length: 17 }, (_, i) => {
                          const hour = 7 + i;
                          const timeValue = `${hour.toString().padStart(2, '0')}:00`;
                          const timeLabel = hour < 12 
                            ? `${hour}:00 AM` 
                            : hour === 12 
                            ? '12:00 PM' 
                            : `${hour - 12}:00 PM`;
                          return (
                            <option key={timeValue} value={timeValue}>
                              {timeLabel}
                            </option>
                          );
                        })}
                      </select>
                      {fullDayStartTime && (
                        <div className="mt-4 p-4 bg-black text-white rounded-lg">
                          <p className="text-sm font-medium mb-2">Booking Duration</p>
                          <p className="text-lg font-bold">
                            {(() => {
                              const [startHour, startMin] = fullDayStartTime.split(':').map(Number);
                              let endHour = startHour + 8;
                              let endMin = startMin;
                              if (endHour >= 24) {
                                endHour = endHour - 24;
                              }
                              const startLabel = startHour < 12 
                                ? `${startHour}:00 AM` 
                                : startHour === 12 
                                ? '12:00 PM' 
                                : `${startHour - 12}:00 PM`;
                              const endLabel = endHour < 12 
                                ? `${endHour}:00 AM` 
                                : endHour === 12 
                                ? '12:00 PM' 
                                : `${endHour - 12}:00 PM`;
                              return `${startLabel} - ${endLabel} (8 Hours)`;
                            })()}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm">
                      <p className="text-sm text-gray-600 mb-4">
                        Select the time ranges you need (7:00 AM - 12:00 AM)
                      </p>
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {Array.from({ length: 17 }, (_, i) => {
                          const startHour = 7 + i;
                          const endHour = 8 + i;
                          const startLabel = startHour < 12 
                            ? `${startHour}:00 AM` 
                            : startHour === 12 
                            ? '12:00 PM' 
                            : `${startHour - 12}:00 PM`;
                          const endLabel = endHour < 12 
                            ? `${endHour}:00 AM` 
                            : endHour === 12 
                            ? '12:00 PM' 
                            : `${endHour - 12}:00 PM`;
                          const rangeValue = `${startHour}:00-${endHour}:00`;
                          const isSelected = selectedTimeRanges.includes(rangeValue);
                          
                          return (
                            <button
                              key={rangeValue}
                              type="button"
                              onClick={() => {
                                const newRanges = isSelected
                                  ? selectedTimeRanges.filter(r => r !== rangeValue)
                                  : [...selectedTimeRanges, rangeValue].sort();
                                setSelectedTimeRanges(newRanges);
                                const slots = generateTimeSlotsFromRanges(newRanges);
                                setSelectedHours(slots);
                                setValue('selectedHours', slots, { shouldValidate: true });
                              }}
                              className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                                isSelected
                                  ? 'border-black bg-black text-white shadow-md'
                                  : 'border-gray-300 bg-white hover:border-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  isSelected 
                                    ? 'border-white bg-white' 
                                    : 'border-gray-400 bg-white'
                                }`}>
                                  {isSelected && (
                                    <CheckCircle className="w-4 h-4 text-black" />
                                  )}
                                </div>
                                <span className="text-base font-medium">
                                  {startLabel} - {endLabel}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {selectedTimeRanges.length > 0 && (
                        <div className="mt-4 p-3 bg-black text-white rounded-lg">
                          <p className="text-sm font-medium">
                            Selected: {selectedTimeRanges.length} hour{selectedTimeRanges.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-gray-300 mt-1">
                            {selectedTimeRanges.map(range => {
                              const [start, end] = range.split('-');
                              const startHour = parseInt(start.split(':')[0]);
                              const endHour = parseInt(end.split(':')[0]);
                              const startLabel = startHour < 12 
                                ? `${startHour}:00 AM` 
                                : startHour === 12 
                                ? '12:00 PM' 
                                : `${startHour - 12}:00 PM`;
                              const endLabel = endHour < 12 
                                ? `${endHour}:00 AM` 
                                : endHour === 12 
                                ? '12:00 PM' 
                                : `${endHour - 12}:00 PM`;
                              return `${startLabel} - ${endLabel}`;
                            }).join(', ')}
                          </p>
                        </div>
                      )}
                      <input
                        type="hidden"
                        {...register('selectedHours', { 
                          required: bookingType === 'hourly' ? 'Please select at least one time range' : false,
                          validate: (value) => bookingType === 'hourly' ? selectedTimeRanges.length > 0 : true
                        })}
                      />
                      {errors.selectedHours && (
                        <p className="text-red-500 text-sm mt-2">{errors.selectedHours.message}</p>
                      )}
                    </div>
                  )}
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

        {/* Price Summary & Navigation */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          {/* Price Summary */}
          {(priceBreakdown.studios.length > 0 || priceBreakdown.equipment.length > 0 || priceBreakdown.props.length > 0) && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl mb-6 border-2 border-gray-200">
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Price Breakdown</p>
                <div className="space-y-2">
                  {/* Studios Breakdown */}
                  {priceBreakdown.studios.length > 0 && (
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Studios</p>
                      {priceBreakdown.studios.map((studio: any, idx: number) => {
                        const calculatedHours = selectedTimeRanges.length;
                        return (
                          <div key={idx} className="flex justify-between items-center text-sm mb-1 last:mb-0">
                            <span className="text-gray-700">{studio.name}</span>
                            <span className="text-gray-900 font-medium">
                              {bookingType === 'fullDay' 
                                ? `AED ${studio.total.toLocaleString()} (8 Hours)`
                                : studio.needsTimeSelection
                                  ? `AED ${studio.unitPrice.toLocaleString()}/hr (Select time range)`
                                  : `AED ${studio.total.toLocaleString()} (${studio.hourLabel || `${calculatedHours} hour${calculatedHours !== 1 ? 's' : ''}`})`
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Equipment Breakdown */}
                  {priceBreakdown.equipment.length > 0 && (
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Equipment</p>
                      {priceBreakdown.equipment.map((equip, idx) => {
                        const calculatedHours = selectedTimeRanges.length;
                        return (
                          <div key={idx} className="flex justify-between items-center text-sm mb-1 last:mb-0">
                            <span className="text-gray-700">{equip.name}</span>
                            <span className="text-gray-900 font-medium">
                              {bookingType === 'fullDay' 
                                ? `AED ${equip.unitPrice.toLocaleString()} (Full Day)`
                                : equip.needsTimeSelection
                                  ? `AED ${equip.unitPrice.toLocaleString()}/hr (Select time range)`
                                  : `AED ${equip.unitPrice.toLocaleString()}/hr × ${calculatedHours} = AED ${equip.total.toLocaleString()}`
                              }
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Props Breakdown */}
                  {priceBreakdown.props.length > 0 && (
                    <div className="bg-white/60 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Props</p>
                      {priceBreakdown.props.map((prop, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm mb-1 last:mb-0">
                          <span className="text-gray-700">{prop.name}</span>
                          <span className="text-gray-900 font-medium">
                            AED {prop.unitPrice.toLocaleString()}/day
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Total</p>
                    {((bookingType === 'hourly' && selectedTimeRanges.length === 0) && (priceBreakdown.studios.length > 0 || priceBreakdown.equipment.length > 0)) ? (
                      <>
                        <p className="text-2xl font-bold text-gray-700">Select hours to calculate</p>
                        <p className="text-xs text-gray-500 mt-1">Props: AED {priceBreakdown.props.reduce((sum, p) => sum + p.total, 0).toLocaleString()}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-gray-900">AED {totalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">Final price will be confirmed by our representative</p>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Selected Items:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedStudios.length} Studio{selectedStudios.length !== 1 ? 's' : ''}
                      {selectedEquipment.length > 0 && `, ${selectedEquipment.length} Equipment`}
                      {selectedProps.length > 0 && `, ${selectedProps.length} Props`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
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
        </div>
      </form>
    </div>
  );
}

