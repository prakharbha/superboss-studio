'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundSliderProps {
  images: string[];
  interval?: number;
  className?: string;
}

export default function BackgroundSlider({ 
  images, 
  interval = 5000,
  className = '' 
}: BackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`Background ${index + 1}`}
            fill
            priority={index === 0}
            quality={85}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}

