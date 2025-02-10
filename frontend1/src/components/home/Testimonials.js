// src/components/home/Testimonials.js
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Designer',
    image: '/testimonials/sarah.jpg',
    quote: 'The customization options are incredible. I was able to create exactly what I envisioned!',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Art Student',
    image: '/testimonials/michael.jpg',
    quote: 'Using the AI design generator was a game-changer. It helped me create unique patterns I never thought possible.',
    rating: 5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Small Business Owner',
    image: '/testimonials/emily.jpg',
    quote: 'Perfect for my business merchandise. The quality is outstanding, and the customization process was so simple.',
    rating: 4
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Graphic Designer',
    image: '/testimonials/james.jpg',
    quote: 'As a designer, I appreciate the attention to detail and the professional quality of the prints.',
    rating: 5
  }
];

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-black font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600">
            Hear from our satisfied customers about their experience
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Slide Controls */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonials Slider */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    
                    <blockquote className="text-xl italic text-gray-900 mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="mb-4">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`text-2xl ${
                            index < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <div className="text-blue-600 font-semibold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}