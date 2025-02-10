// src/components/home/FeaturedProducts.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Hardcoded featured products data (replace with API call later)
const featuredProducts = [
  {
    id: '1',
    name: 'Classic Cotton Hoodie',
    description: 'Premium comfort hoodie',
    price: 49.99,
    category: 'hoodies',
    image: '/products/hoodie-1.png',
    colors: [
      { name: 'Black', code: '#000000' },
      { name: 'Navy', code: '#000080' },
      { name: 'Gray', code: '#808080' }
    ],
    badge: 'Best Seller'
  },
  {
    id: '2',
    name: 'Designer T-Shirt',
    description: 'Modern graphic design',
    price: 29.99,
    category: 't-shirts',
    image: '/products/tshirt-1.png',
    colors: [
      { name: 'White', code: '#FFFFFF' },
      { name: 'Black', code: '#000000' }
    ],
    badge: 'New'
  },
  {
    id: '3',
    name: 'Premium Denim Jacket',
    description: 'Stylish denim jacket',
    price: 79.99,
    category: 'jackets',
    image: '/products/jacket-1.png',
    colors: [
      { name: 'Blue', code: '#0000FF' },
      { name: 'Black', code: '#000000' }
    ],
    badge: 'Popular'
  },
  {
    id: '4',
    name: 'Casual Oxford Shirt',
    description: 'Classic casual shirt',
    price: 39.99,
    category: 'shirts',
    image: '/products/shirt-1.png',
    colors: [
      { name: 'White', code: '#FFFFFF' },
      { name: 'Light Blue', code: '#ADD8E6' }
    ],
    badge: 'Limited Edition'
  }
];

export default function FeaturedProducts() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl text-black md:text-4xl font-bold mb-4"
          >
            Featured Products
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Discover our most popular customizable items
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Link
                        href={`/products/${product.category}/${product.id}`}
                        className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/customize/${product.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Customize
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  {/* Price and Colors */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price}</span>
                    <div className="flex -space-x-2">
                      {product.colors.map((color) => (
                        <div
                          key={color.code}
                          className="w-6 h-6 rounded-full border-2 border-white"
                          style={{ backgroundColor: color.code }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}