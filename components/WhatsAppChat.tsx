'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const whatsappNumber = '+971561561570';
  const defaultMessage = 'Hi! I would like to inquire about booking a studio.';

  // Removed auto-popup - button only opens on user click
  // useEffect(() => {
  //   const popupShown = sessionStorage.getItem('whatsapp-popup-shown');
  //   if (!popupShown) {
  //     const timer = setTimeout(() => {
  //       setIsOpen(true);
  //       setHasShown(true);
  //       sessionStorage.setItem('whatsapp-popup-shown', 'true');
  //     }, 30000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <motion.button
        onClick={handleWhatsAppClick}
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20BA5A] transition-all duration-300 hover:scale-110"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Auto-popup Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">SuperBoss Studio</h3>
                  <p className="text-white/90 text-xs">Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 bg-[#ECE5DD]">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-gray-700 mb-2">
                  👋 Hello! Welcome to SuperBoss Studio.
                </p>
                <p className="text-sm text-gray-700">
                  How can we help you today? Click below to start a conversation on WhatsApp.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white">
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-[#25D366] text-white py-3 rounded-lg font-medium hover:bg-[#20BA5A] transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Chat</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
