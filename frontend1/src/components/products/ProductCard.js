// src/components/products/ProductCard.js
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-gray-300 rounded-lg shadow-lg text-black overflow-hidden"
    >
      <Link href={`/products/${product.category}/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.images.main}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 transform hover:scale-105"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <span className="bg-inherit text-gray-900 px-4 py-2 rounded-full text-sm font-medium">
                View Details
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-black text-xl font-semibold mt-1">${product.price}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {product.colors.map((color) => (
              <div
                key={color.code}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}