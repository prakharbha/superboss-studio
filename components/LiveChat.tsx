'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hello! Welcome to SuperBoss Studio. How can we help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showContactForm, setShowContactForm] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if popup has been shown in this session
    const popupShown = sessionStorage.getItem('chat-popup-shown');
    
    if (!popupShown) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('chat-popup-shown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = () => {
    if (!userName || !userEmail) return;
    
    setShowContactForm(false);
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        text: `Hi, I'm ${userName}. I'd like to inquire about your studio.`,
        sender: 'user',
        timestamp: new Date(),
      },
      {
        id: messages.length + 2,
        text: `Great to meet you, ${userName}! I'll help you with your inquiry. What would you like to know about our studios?`,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Prepare WhatsApp message
    const whatsappNumber = '+971561561570';
    const message = `Hi, I'm ${userName} (${userEmail}${userPhone ? ', ' + userPhone : ''}).\n\n${inputValue}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Add message to chat
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Auto-reply
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: "Opening WhatsApp... You'll be connected directly with our team for real-time support! 💬",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 500);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-40 bg-sb-black text-white p-4 rounded-full shadow-2xl hover:bg-sb-grey-dark transition-all duration-300 hover:scale-110"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-sb-black p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-sb-black" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">SuperBoss Studio</h3>
                  <p className="text-white/90 text-xs">Online now</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close chat"
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Form or Messages */}
            {showContactForm ? (
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-sb-black mb-2">Start a conversation</h3>
                <p className="text-sm text-sb-grey mb-6">
                  Please provide your details to begin chatting with us.
                </p>
                <form onSubmit={(e) => { e.preventDefault(); handleStartChat(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-sb-black mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-2 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sb-black mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-sb-black mb-1">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full px-4 py-2 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-sb-black text-white py-3 rounded-lg font-medium hover:bg-sb-grey-dark transition-colors"
                  >
                    Start Chat
                  </button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-sb-grey-light">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-sb-black text-white'
                              : 'bg-white text-sb-black'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-white/70' : 'text-sb-grey'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-sb-grey-light">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-sb-grey-light rounded-lg focus:outline-none focus:ring-2 focus:ring-sb-black"
                    />
                    <button
                      type="submit"
                      aria-label="Send message"
                      className="bg-sb-black text-white p-2 rounded-lg hover:bg-sb-grey-dark transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-sb-grey mt-2">
                    Our team typically responds within a few hours.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

