'use client';
import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

const HelpWheel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" />,
      href: 'https://wa.me/1234567890?text=Hi%20there!',
      color: 'bg-green-500'
    },
    {
      name: 'Instagram',
      icon: '📸',
      href: 'https://instagram.com/youraccount',
      color: 'bg-pink-500'
    },
    {
      name: 'TikTok',
      icon: '🎵',
      href: 'https://tiktok.com/@youraccount',
      color: 'bg-black'
    },
    {
      name: 'Email',
      icon: <Mail className="w-4 h-4 sm:w-6 sm:h-6" />,
      href: 'mailto:your@email.com',
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 z-50">
      {/* Help button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white 
          flex items-center justify-center shadow-lg transition-all duration-300 
          ${isOpen ? 'transform rotate-45' : ''}`}
      >
        <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Semi-circle menu */}
      <div className={`absolute transition-all duration-500 
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        {contactOptions.map((option, index) => {
          // Calculate position in semi-circle (180 degrees)
          const totalAngle = 180; // Semi-circle
          const startAngle = -90; // Start from bottom
          const angle = startAngle + (index * totalAngle) / (contactOptions.length - 1);
          const radius = window.innerWidth < 640 ? 60 : 80; // Responsive radius
          const radian = (angle * Math.PI) / 180;
          
          // Calculate positions
          const x = Math.cos(radian) * radius;
          const y = Math.sin(radian) * radius;

          return (
            <a
              key={option.name}
              href={option.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`absolute w-8 h-8 sm:w-12 sm:h-12 rounded-full ${option.color} 
                text-white flex items-center justify-center shadow-md 
                transition-all duration-500 transform hover:scale-110 
                ${isOpen ? 'scale-100' : 'scale-0'}`}
              style={{
                transform: isOpen
                  ? `translate(${x}px, ${y}px)`
                  : 'translate(0, 0)',
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {typeof option.icon === 'string' ? option.icon : option.icon}
              
              {/* Tooltip */}
              <span className="absolute invisible group-hover:visible whitespace-nowrap
                bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8
                left-1/2 transform -translate-x-1/2">
                {option.name}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default HelpWheel;