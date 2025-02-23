'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Function to generate URL-friendly slug from category name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

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

        <div className={`
          flex flex-wrap justify-center gap-6
          ${categories.length <= 3 ? 'max-w-5xl mx-auto' : 'max-w-7xl'}
        `}>
          {categories.map((category, index) => (
            <motion.div
              key={category._id}
              className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/products/${generateSlug(category.name)}`}
                className="block"
                onMouseEnter={() => setHoveredId(category._id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  {/* Image Container */}
                  <div className="relative h-96 w-full overflow-hidden">
                    <Image
                      src={category.image || '/categories/hoodies.png'}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500 to-blue-700 opacity-60 transition-opacity duration-300 group-hover:opacity-70" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <motion.div
                      animate={{
                        y: hoveredId === category._id ? -5 : 0,
                        opacity: hoveredId === category._id ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Customize Banner */}
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
                    href="/coming"
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