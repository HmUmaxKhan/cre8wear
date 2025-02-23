'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const slideImages = [
  {
    url: '/hero/19.png',
    alt: 'Custom Hoodie Design',
    category: 'Hoodies'
  },
  {
    url: '/hero/20.png',
    alt: 'Custom T-Shirt Design',
    category: 'T-Shirts'
  },
  {
    url: '/hero/21.png',
    alt: 'Custom Jacket Design',
    category: 'Jackets'
  },
  {
    url: '/hero/26.png',
    alt: 'Custom Shirt Design',
    category: 'Shirts'
  },
  {
    url: '/hero/27.png',
    alt: 'Custom Shirt Design',
    category: 'Shirts'
  },
  {
    url: '/hero/28.png',
    alt: 'Custom Shirt Design',
    category: 'Shirts'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        {/* Content Container */}
        <div className="relative z-20 flex flex-col lg:flex-row h-full">
          {/* Left Content - Text */}
          <div className="relative z-20 w-full lg:w-1/2 flex items-center justify-center lg:justify-start px-4 sm:px-6 lg:px-12 py-20 lg:py-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8 text-center lg:text-left max-w-md"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                Your
                <br />
                Style
                <br />
                <span className="text-blue-500">Your</span>
                <br />
                <span className="text-blue-500">Canvas</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg">
                Design custom clothing that's uniquely you. Choose from our
                premium collection and bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/coming"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-center inline-block"
                >
                  Start Designing
                </Link>
                <Link
                  href="/products"
                  className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-center inline-block"
                >
                  Browse Collection
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Image Slider */}
          <div className="absolute lg:relative top-20 right-0 w-full lg:w-1/2 h-full">
            <AnimatePresence mode="wait">
              {slideImages.map((slide, index) => (
                currentSlide === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={slide.url}
                      alt={slide.alt}
                      fill
                      className="object-cover w-full h-full"
                      priority={index === 0}
                    />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}