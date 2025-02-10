// src/components/products/ProductFilters.js
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'hoodies', name: 'Hoodies' },
  { id: 'shirts', name: 'Shirts' },
  { id: 't-shirts', name: 'T-Shirts' },
  { id: 'jackets', name: 'Jackets' }
];

export default function ProductFilters({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-300 text-black rounded-lg shadow-lg p-6">
      {/* Mobile Filter Button */}
      <button
        className="lg:hidden w-full flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Filters</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Content */}
      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sort By</h3>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </div>
  );
}