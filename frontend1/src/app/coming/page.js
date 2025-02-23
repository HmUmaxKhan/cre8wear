import React from 'react';
import { Sparkles } from 'lucide-react';

const ComingSoonPage = () => {
  // Your WhatsApp number without any special characters
  const whatsappNumber = "1234567890"; // Replace with your actual number
  const whatsappMessage = "Hi! I'm interested in your services."; // Customize this message
  
  const getSocialLink = (platform) => {
    switch(platform) {
      case 'whatsapp':
        // WhatsApp API URL format
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      case 'facebook':
        return 'https://facebook.com/yourpage'; // Replace with your Facebook page URL
      case 'instagram':
        return 'https://instagram.com/yourprofile'; // Replace with your Instagram profile URL
      default:
        return '#';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated sparkles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 animate-pulse">
          <Sparkles className="w-6 h-6 text-blue-300 opacity-75" />
        </div>
        <div className="absolute top-3/4 right-1/4 animate-bounce">
          <Sparkles className="w-8 h-8 text-blue-300 opacity-50" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-pulse delay-300">
          <Sparkles className="w-5 h-5 text-blue-300 opacity-60" />
        </div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 space-y-8">
        <h1 className="text-6xl font-bold mb-4 animate-fade-in text-gray-800">
          Coming Soon
        </h1>
        
        <p className="text-xl text-gray-600 max-w-xl mx-auto animate-slide-up">
          We're working hard to bring you something amazing. Stay tuned!
        </p>

        {/* Social links */}
        <div className="flex justify-center gap-6 mt-8">
          {['whatsapp', 'facebook', 'instagram'].map(social => (
            <a
              key={social}
              href={getSocialLink(social)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <span className="capitalize">{social}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;