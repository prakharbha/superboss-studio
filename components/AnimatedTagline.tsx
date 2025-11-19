'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTaglineProps {
  taglines: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function AnimatedTagline({
  taglines,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2500,
  className = '',
}: AnimatedTaglineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (taglines.length === 0) return;

    const currentTagline = taglines[currentIndex];
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If paused, wait then start deleting
    if (isPaused) {
      timeoutRef.current = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // If deleting, remove characters
    if (isDeleting) {
      if (displayText.length === 0) {
        // Finished deleting, move to next tagline and reset states
        setIsDeleting(false);
        setIsPaused(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % taglines.length);
        return;
      }
      timeoutRef.current = setTimeout(() => {
        setDisplayText(currentTagline.slice(0, displayText.length - 1));
      }, deletingSpeed);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // If typing, add characters
    if (displayText.length < currentTagline.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayText(currentTagline.slice(0, displayText.length + 1));
      }, typingSpeed);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Finished typing, pause before deleting
    if (displayText.length === currentTagline.length && !isPaused && !isDeleting) {
      setIsPaused(true);
    }
  }, [displayText, currentIndex, isDeleting, isPaused, taglines, typingSpeed, deletingSpeed, pauseDuration]);

  // Reset display text when tagline index changes (safety check)
  useEffect(() => {
    if (taglines.length > 0 && displayText.length > 0 && !isDeleting) {
      // Only reset if we're not in the middle of deleting
      const currentTagline = taglines[currentIndex];
      if (displayText !== currentTagline.slice(0, displayText.length)) {
        setDisplayText('');
      }
    }
  }, [currentIndex, taglines]);

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block ml-1 text-white"
        >
          |
        </motion.span>
      </motion.span>
    </span>
  );
}

