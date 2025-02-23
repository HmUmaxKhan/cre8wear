// components/ImageSlider.jsx
'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageSlider({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square relative bg-gray-100 rounded-lg">
        <Image
          src="/placeholder-product.jpg"
          alt="Product placeholder"
          fill
          className="object-cover rounded-lg"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[currentImageIndex].src}
          alt={images[currentImageIndex].alt}
          fill
          className="object-cover transition-transform duration-500"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImageIndex === index ? 'bg-blue-600 w-4' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Preview */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              currentImageIndex === index ? 'ring-2 ring-blue-600' : 'opacity-75'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}