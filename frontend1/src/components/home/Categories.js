// src/components/home/Categories.js
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'hoodies',
    name: 'Hoodies',
    description: 'Premium comfort hoodies for every style',
    image: '/categories/hoodies.png',
    items: '20+ Items',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'shirts',
    name: 'Shirts',
    description: 'Classic and modern shirt designs',
    image: '/categories/shirts.png',
    items: '15+ Items',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 't-shirts',
    name: 'T-Shirts',
    description: 'Comfortable and stylish t-shirts',
    image: '/categories/t-shirts.png',
    items: '25+ Items',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'jackets',
    name: 'Jackets',
    description: 'Premium quality designer jackets',
    image: '/categories/jackets.png',
    items: '10+ Items',
    color: 'from-red-500 to-red-700'
  }
];

export default function Categories() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl text-black md:text-4xl font-bold mb-4"
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Explore our wide range of customizable clothing options
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/products/${category.id}`}
                className="block"
                onMouseEnter={() => setHoveredId(category.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  {/* Image Container */}
                  <div className="relative h-96 w-full overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-60 transition-opacity duration-300 group-hover:opacity-70`} />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <motion.div
                      animate={{
                        y: hoveredId === category.id ? -5 : 0,
                        opacity: hoveredId === category.id ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">
                          {category.items}
                        </span>
                        <span className="text-white flex items-center group-hover:translate-x-1 transition-transform">
                          Shop Now 
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Categories Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="h-48 bg-gray-900 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
              <div className="relative h-full flex items-center justify-center px-6">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Customize Any Design
                  </h3>
                  <Link
                    href="/customize"
                    className="inline-block bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
                  >
                    Start Designing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}