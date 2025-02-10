'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { products } from '@/data/products';

export default function CategoryPage({ params }) {
  const { category } = params;
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let result = products.filter(product => product.category === category);
    setFilteredProducts(result);
    setLoading(false);
  }, [category]);

  const handlePriceChange = (range) => {
    setPriceRange(range);
    const filtered = products.filter(product => 
      product.category === category &&
      product.price >= range[0] &&
      product.price <= range[1]
    );
    setFilteredProducts(filtered);
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    let sorted = [...filteredProducts];
    switch(sortType) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Keep default sorting
        break;
    }
    setFilteredProducts(sorted);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 text-white sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-center mt-14 capitalize">{category}</h1>
      {/* Category Header */}
      <div className="mb-8">
        
        <p className="text-white mt-2">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        {/* Price Filter */}
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-white mb-2">
            Price Range
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="200"
              color='#fffff'
              value={priceRange[1]}
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value)])}
              className="w-48"
            />
            <span className="text-sm text-white">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
        </div>

        {/* Sort Options */}
        <div className="w-full md:w-auto">
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">No products found</h2>
          <p className="mt-2 text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}