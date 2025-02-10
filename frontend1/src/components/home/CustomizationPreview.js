// src/components/home/CustomizationPreview.js
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CustomizationPreview() {
  const [activeTab, setActiveTab] = useState('colors');

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold leading-tight">
              Bring Your Ideas to Life
            </h2>
            <p className="text-xl text-gray-600">
              Our advanced customization studio gives you complete creative control
            </p>

            <div className="space-y-6">
              <div className="flex space-x-4">
                {['colors', 'designs', 'ai'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full transition-all ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="bg-black p-6 rounded-lg shadow-lg">
                {activeTab === 'colors' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold">Choose Your Colors</h3>
                    <p>Pick from our wide range of colors for each part of your garment</p>
                    <div className="flex space-x-2">
                      {['#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map((color) => (
                        <div
                          key={color}
                          className="w-8 h-8 rounded-full cursor-pointer transform hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'designs' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold">Upload Your Designs</h3>
                    <p>Add your own artwork or choose from our design library</p>
                    {/* Add design upload preview here */}
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="space-y-4 animate-fade-in">
                    <h3 className="text-xl font-semibold">AI Design Generation</h3>
                    <p>Let our AI help you create unique designs</p>
                    {/* Add AI design preview here */}
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/customize"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try It Now
            </Link>
          </div>

          <div className="relative h-[600px]">
            <Image
              src="/images/customization-preview.jpg"
              alt="Customization Preview"
              fill
              className="object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}